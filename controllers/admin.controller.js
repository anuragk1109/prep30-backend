const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const mongoose = require("mongoose");

exports.createCourse = async (req, res) => {
  try {
    const { title, name, description, isActive } = req.body;
    const resolvedTitle = title || name;
    if (!resolvedTitle) {
      return res.status(400).json({ error: "title (or name) is required" });
    }

    const created = await Course.create({
      title: resolvedTitle,
      description: description || "",
      isActive
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course", details: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { courseId, title, name, order } = req.body;

    const resolvedCourseId = courseId?._id || courseId;
    if (!resolvedCourseId || !mongoose.Types.ObjectId.isValid(resolvedCourseId)) {
      return res.status(400).json({ error: "Valid courseId is required" });
    }

    const course = await Course.findById(resolvedCourseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const created = await Subject.create({
      courseId: resolvedCourseId,
      title: title || name,
      order
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject", details: error.message });
  }
};

exports.createChapter = async (req, res) => {
  try {
    const { subjectId, title, name, order } = req.body;

    const resolvedSubjectId = subjectId?._id || subjectId;
    if (!resolvedSubjectId || !mongoose.Types.ObjectId.isValid(resolvedSubjectId)) {
      return res.status(400).json({ error: "Valid subjectId is required" });
    }

    const subject = await Subject.findById(resolvedSubjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const created = await Chapter.create({
      subjectId: resolvedSubjectId,
      title: title || name,
      order
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ error: "Failed to create chapter", details: error.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { title, chapterId, questions } = req.body;
    
    // Get chapter details to populate courseId and subjectId
    const chapter = await Chapter.findById(chapterId).populate('subjectId');
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }
    
    // Transform questions to use correctIndex instead of correctOption
    const transformedQuestions = questions.map(q => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctOption || q.correctIndex
    }));
    
    // Create quiz with required fields
    const quiz = await Quiz.create({
      courseId: chapter.subjectId.courseId,
      subjectId: chapter.subjectId._id,
      chapterId: chapterId,
      level: "CHAPTER",
      title: title,
      questions: transformedQuestions,
      isPublished: true
    });
    
    res.status(201).json({
      message: "Quiz created successfully",
      data: {
        quizId: quiz._id,
        title: quiz.title,
        chapterId: chapterId,
        questionsCount: questions.length
      }
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz", details: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { chapterId, question, options, correctIndex, correctOption, explanation, difficulty } = req.body;

    if (!chapterId || !question || !options || !Array.isArray(options)) {
      return res.status(400).json({ error: "chapterId, question, and options array are required" });
    }

    const resolvedCorrectIndex = correctIndex ?? correctOption;
    if (resolvedCorrectIndex === undefined || resolvedCorrectIndex === null) {
      return res.status(400).json({ error: "correctIndex (or correctOption) is required" });
    }

    const chapter = await Chapter.findById(chapterId).populate("subjectId");
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }
    if (!chapter.subjectId || !chapter.subjectId.courseId) {
      return res.status(400).json({ error: "Chapter hierarchy is incomplete" });
    }

    const created = await Question.create({
      courseId: chapter.subjectId.courseId,
      subjectId: chapter.subjectId._id,
      chapterId,
      question,
      options,
      correctIndex: resolvedCorrectIndex,
      explanation: explanation || "",
      difficulty
    });

    res.status(201).json({ message: "Question created successfully", data: created });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question", details: error.message });
  }
};

exports.createQuestionsBulk = async (req, res) => {
  try {
    const { chapterId, questions } = req.body;

    if (!chapterId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "chapterId and non-empty questions array are required" });
    }

    const chapter = await Chapter.findById(chapterId).populate("subjectId");
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }
    if (!chapter.subjectId || !chapter.subjectId.courseId) {
      return res.status(400).json({ error: "Chapter hierarchy is incomplete" });
    }

    const docs = questions.map((q) => ({
      courseId: chapter.subjectId.courseId,
      subjectId: chapter.subjectId._id,
      chapterId,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex ?? q.correctOption,
      explanation: q.explanation || "",
      difficulty: q.difficulty
    }));

    const inserted = await Question.insertMany(docs, { ordered: true });

    res.status(201).json({
      message: "Questions created successfully",
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    console.error("Error creating questions:", error);
    res.status(500).json({ error: "Failed to create questions", details: error.message });
  }
};