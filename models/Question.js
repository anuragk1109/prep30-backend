const mongoose = require("mongoose");


const QuestionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },

  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },

  explanation: { type: String, default: "" },
  difficulty: { type: String, enum: ["EASY", "MEDIUM", "HARD"], default: "MEDIUM" },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model("Question", QuestionSchema);
