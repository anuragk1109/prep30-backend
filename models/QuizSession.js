const mongoose = require("mongoose");


const QuizSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", default: null },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", default: null },

  level: { type: String, enum: ["COURSE", "SUBJECT", "CHAPTER"], required: true },

  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }],

  status: { type: String, enum: ["CREATED", "SUBMITTED"], default: "CREATED" },
  submittedAt: { type: Date, default: null }
}, { timestamps: true });


module.exports = mongoose.model("QuizSession", QuizSessionSchema);
