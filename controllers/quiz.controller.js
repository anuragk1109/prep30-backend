const mongoose = require("mongoose");
const Question = require("../models/Question");
const QuizSession = require("../models/QuizSession");
const QuizAttempt = require("../models/QuizAttempt");

exports.listMyQuizzes = async (req, res) => {
  try {
    const sessions = await QuizSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("level courseId subjectId chapterId status createdAt submittedAt")
      .populate("courseId", "title")
      .populate("subjectId", "title")
      .populate("chapterId", "title");

    res.json({
      message: "Quizzes retrieved successfully",
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error("Error listing quizzes:", error);
    res.status(500).json({ error: "Failed to retrieve quizzes", details: error.message });
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
    let level = "COURSE";
    if (chapterId) level = "CHAPTER";
    else if (subjectId) level = "SUBJECT";

    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) return res.status(400).json({ error: "Invalid courseId" });
      match.courseId = new mongoose.Types.ObjectId(courseId);
    }
    if (subjectId) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ error: "Invalid subjectId" });
      match.subjectId = new mongoose.Types.ObjectId(subjectId);
    }
    if (chapterId) {
      if (!mongoose.Types.ObjectId.isValid(chapterId)) return res.status(400).json({ error: "Invalid chapterId" });
      match.chapterId = new mongoose.Types.ObjectId(chapterId);
    }

    const sampled = await Question.aggregate([
      { $match: match },
      { $sample: { size: limit } },
      { $project: { _id: 1 } }
    ]);

    const questionIds = sampled.map((d) => d._id);
    if (questionIds.length === 0) {
      return res.status(404).json({ error: "No questions found for the selected scope" });
    }

    const session = await QuizSession.create({
      userId: req.user.id,
      courseId: courseId || null,
      subjectId: subjectId || null,
      chapterId: chapterId || null,
      level,
      questionIds
    });

    const questions = await Question.find({ _id: { $in: session.questionIds } })
      .select("question options courseId subjectId chapterId difficulty")
      .lean();

    const byId = new Map(questions.map((q) => [String(q._id), q]));
    const orderedQuestions = session.questionIds
      .map((id) => byId.get(String(id)))
      .filter(Boolean);

    res.status(201).json({
      message: "Quiz generated successfully",
      data: {
        quizId: session._id,
        level: session.level,
        courseId: session.courseId,
        subjectId: session.subjectId,
        chapterId: session.chapterId,
        totalQuestions: session.questionIds.length,
        questions: orderedQuestions
      }
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Failed to generate quiz", details: error.message });
  }
};

exports.getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid quizId" });
    }

    const session = await QuizSession.findById(quizId)
      .populate("courseId", "title")
      .populate("subjectId", "title")
      .populate("chapterId", "title");

    if (!session) return res.status(404).json({ error: "Quiz not found" });
    if (String(session.userId) !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const questions = await Question.find({ _id: { $in: session.questionIds } })
      .select("question options courseId subjectId chapterId difficulty")
      .lean();

    const byId = new Map(questions.map((q) => [String(q._id), q]));
    const ordered = session.questionIds
      .map((id) => byId.get(String(id)))
      .filter(Boolean);

    res.json({
      message: "Quiz questions retrieved successfully",
      data: {
        quizId: session._id,
        level: session.level,
        course: session.courseId,
        subject: session.subjectId,
        chapter: session.chapterId,
        questions: ordered,
        totalQuestions: ordered.length
      }
    });
  } catch (error) {
    console.error("Error getting quiz questions:", error);
    res.status(500).json({ error: "Failed to retrieve quiz questions", details: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    if (!quizId) return res.status(400).json({ error: "quizId is required" });
    if (!answers) return res.status(400).json({ error: "answers are required" });
    if (!mongoose.Types.ObjectId.isValid(quizId)) return res.status(400).json({ error: "Invalid quizId" });

    const session = await QuizSession.findById(quizId);
    if (!session) return res.status(404).json({ error: "Quiz not found" });
    if (String(session.userId) !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (session.status === "SUBMITTED") {
      return res.status(400).json({ error: "Quiz already submitted" });
    }

    const questions = await Question.find({ _id: { $in: session.questionIds } })
      .select("correctIndex")
      .lean();

    const correctIndexById = new Map(questions.map((q) => [String(q._id), q.correctIndex]));

    let normalizedAnswers = [];
    if (Array.isArray(answers)) {
      if (answers.length > 0 && typeof answers[0] === "object" && answers[0] !== null) {
        normalizedAnswers = answers
          .map((a) => ({
            questionId: a.questionId,
            selectedIndex: a.selectedIndex ?? a.answerIndex ?? a.correctIndex
          }))
          .filter((a) => a.questionId !== undefined);
      } else {
        normalizedAnswers = session.questionIds.map((qid, idx) => ({
          questionId: qid,
          selectedIndex: answers[idx]
        }));
      }
    } else {
      return res.status(400).json({ error: "answers must be an array" });
    }

    let correctAnswers = 0;
    for (const a of normalizedAnswers) {
      const key = String(a.questionId);
      const correctIndex = correctIndexById.get(key);
      if (correctIndex === undefined) continue;
      if (Number(a.selectedIndex) === Number(correctIndex)) correctAnswers += 1;
    }

    const totalQuestions = session.questionIds.length;
    const score = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);

    session.status = "SUBMITTED";
    session.submittedAt = new Date();
    await session.save();

    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      quizId: session._id,
      courseId: session.courseId,
      subjectId: session.subjectId,
      chapterId: session.chapterId,
      level: session.level,
      score,
      correctAnswers,
      totalQuestions,
      answers: normalizedAnswers
    });

    res.json({
      message: "Quiz submitted successfully",
      data: {
        quizId: session._id,
        attemptId: attempt._id,
        score,
        totalQuestions,
        correctAnswers
      }
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz", details: error.message });
  }
};