const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Chapter", ChapterSchema);