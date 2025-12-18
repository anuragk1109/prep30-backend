const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizSession" },


  courseId: mongoose.Schema.Types.ObjectId,
  subjectId: mongoose.Schema.Types.ObjectId,
  chapterId: mongoose.Schema.Types.ObjectId,


  level: String,
  score: Number,


  correctAnswers: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },


  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selectedIndex: Number
    }
  ],


  attemptedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);