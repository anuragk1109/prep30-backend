const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Quiz = require("../models/Quiz");
const Chapter = require("../models/Chapter");
const Question = require("../models/Question");
const mongoose = require("mongoose");

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .sort({ createdAt: -1 });
    
    res.json({
      message: "Courses retrieved successfully",
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve courses" });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { courseId, subjectId, chapterId, isActive } = req.query;

    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (subjectId) filter.subjectId = subjectId;
    if (chapterId) filter.chapterId = chapterId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      message: "Questions retrieved successfully",
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("❌ Error in getQuestions:", error);
    res.status(500).json({ error: "Failed to retrieve questions", details: error.message });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { courseId, subjectId, chapterId } = req.query;
    const limit = Math.max(1, Math.min(parseInt(req.query.limit || "20", 10) || 20, 200));

    if (!courseId && !subjectId && !chapterId) {
      return res.status(400).json({ error: "Provide courseId or subjectId or chapterId" });
    }

    const match = { isActive: true };
    if (courseId) match.courseId = new mongoose.Types.ObjectId(courseId);
    if (subjectId) match.subjectId = new mongoose.Types.ObjectId(subjectId);
    if (chapterId) match.chapterId = new mongoose.Types.ObjectId(chapterId);

    const sampled = await Question.aggregate([
      { $match: match },
      { $sample: { size: limit } },
      {
        $project: {
          courseId: 1,
          subjectId: 1,
          chapterId: 1,
          question: 1,
          options: 1,
          correctIndex: 1,
          explanation: 1,
          difficulty: 1
        }
      }
    ]);

    res.json({
      message: "Quiz generated successfully",
      meta: {
        courseId: courseId || null,
        subjectId: subjectId || null,
        chapterId: chapterId || null,
        limit,
        count: sampled.length
      },
      data: sampled
    });
  } catch (error) {
    console.error("❌ Error in generateQuiz:", error);
    res.status(500).json({ error: "Failed to generate quiz", details: error.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const { courseId } = req.query;
    
    let subjects;
    if (courseId) {
      console.log("🔍 Searching subjects with courseId:", courseId);
      
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        console.log("❌ Invalid ObjectId format:", courseId);
        return res.status(400).json({ error: "Invalid courseId format" });
      }
      
      // Convert courseId to ObjectId for proper MongoDB query
      const objectId = new mongoose.Types.ObjectId(courseId);
      console.log("✅ Converted to ObjectId:", objectId);

      // Be tolerant of legacy data where courseId may have been stored as a string
      subjects = await Subject.find({
        $or: [{ courseId: objectId }, { courseId: courseId }]
      })
        .populate('courseId', 'title description')
        .sort({ order: 1, createdAt: -1 });
        
      console.log(`📊 Found ${subjects.length} subjects for course`);
    } else {
      subjects = await Subject.find({})
        .populate('courseId', 'title description')
        .sort({ order: 1, createdAt: -1 });
    }
    
    res.json({
      message: "Subjects retrieved successfully",
      count: subjects.length,
      data: subjects.map(subject => ({
        _id: subject._id,
        name: subject.title, // Subject name as "name"
        title: subject.title,
        order: subject.order,
        courseId: subject.courseId,
        course: subject.courseId // Populated course details
      }))
    });
  } catch (error) {
    console.error("❌ Error in getAllSubjects:", error);
    res.status(500).json({ error: "Failed to retrieve subjects", details: error.message });
  }
};

// Get all chapters
exports.getAllChapters = async (req, res) => {
  try {
    const { subjectId } = req.query;
    
    let chapters;
    if (subjectId) {
      console.log("🔍 Searching chapters with subjectId:", subjectId);
      
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        console.log("❌ Invalid ObjectId format:", subjectId);
        return res.status(400).json({ error: "Invalid subjectId format" });
      }
      
      // Convert subjectId to ObjectId for proper MongoDB query
      const objectId = new mongoose.Types.ObjectId(subjectId);
      console.log("✅ Converted to ObjectId:", objectId);

      // Be tolerant of legacy data where subjectId may have been stored as a string
      chapters = await Chapter.find({
        $or: [{ subjectId: objectId }, { subjectId: subjectId }]
      })
        .populate('subjectId', 'title order')
        .sort({ order: 1, createdAt: -1 });
        
      console.log(`📖 Found ${chapters.length} chapters for subject`);
    } else {
      chapters = await Chapter.find({})
        .populate('subjectId', 'title order')
        .sort({ order: 1, createdAt: -1 });
    }
    
    res.json({
      message: "Chapters retrieved successfully",
      count: chapters.length,
      data: chapters.map(chapter => ({
        _id: chapter._id,
        name: chapter.title, // Chapter name as "name"
        title: chapter.title,
        order: chapter.order,
        subjectId: chapter.subjectId,
        subject: chapter.subjectId // Populated subject details
      }))
    });
  } catch (error) {
    console.error("❌ Error in getAllChapters:", error);
    res.status(500).json({ error: "Failed to retrieve chapters", details: error.message });
  }
};
exports.getAllQuizzes = async (req, res) => {
  try {
    const { courseId, subjectId, level, isPublished } = req.query;
    
    let filter = {};
    if (courseId) filter.courseId = courseId;
    if (subjectId) filter.subjectId = subjectId;
    if (level) filter.level = level;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    
    const quizzes = await Quiz.find(filter)
      .populate('courseId', 'title description')
      .populate('subjectId', 'title order')
      .populate('chapterId', 'title')
      .sort({ createdAt: -1 });
    
    res.json({
      message: "Quizzes retrieved successfully",
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quizzes" });
  }
};

// Get quiz by ID (with questions)
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findById(id)
      .populate('courseId', 'title description')
      .populate('subjectId', 'title order')
      .populate('chapterId', 'title');
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    
    res.json({
      message: "Quiz retrieved successfully",
      data: quiz
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quiz" });
  }
};

// Add questions to chapter
exports.addQuestionsToChapter = async (req, res) => {
  try {
    const { chapterId, questions } = req.body;
    
    // Validate required fields
    if (!chapterId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        error: "chapterId and questions array are required" 
      });
    }
    
    // Validate chapter exists
    const chapter = await Chapter.findById(chapterId).populate('subjectId');
    if (!chapter) {
      return res.status(404).json({ 
        error: "Chapter not found" 
      });
    }

    if (!chapter.subjectId || !chapter.subjectId.courseId) {
      return res.status(400).json({ error: "Chapter hierarchy is incomplete" });
    }

    const normalizedQuestions = questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex ?? q.correctOption
    }));
    
    // Create a new quiz for this chapter
    const quiz = await Quiz.create({
      courseId: chapter.subjectId.courseId,
      subjectId: chapter.subjectId._id,
      chapterId: chapterId,
      level: "CHAPTER",
      title: `${chapter.title} - Questions`,
      questions: normalizedQuestions,
      isPublished: true
    });
    
    res.status(201).json({
      message: "Questions added to chapter successfully",
      data: {
        quizId: quiz._id,
        chapterId: chapterId,
        questionsCount: questions.length,
        title: quiz.title
      }
    });
  } catch (error) {
    console.error("❌ Error in addQuestionsToChapter:", error);
    res.status(500).json({ 
      error: "Failed to add questions to chapter", 
      details: error.message 
    });
  }
};

// Get questions for a specific quiz
exports.getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId)
      .select('title questions level')
      .populate('courseId', 'title')
      .populate('subjectId', 'title')
      .populate('chapterId', 'title');
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    
    res.json({
      message: "Quiz questions retrieved successfully",
      data: {
        quizId: quiz._id,
        title: quiz.title,
        level: quiz.level,
        course: quiz.courseId,
        subject: quiz.subjectId,
        chapter: quiz.chapterId,
        questions: quiz.questions,
        totalQuestions: quiz.questions.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quiz questions" });
  }
};
