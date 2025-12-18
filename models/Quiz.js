const mongoose = require("mongoose");


const QuizSchema = new mongoose.Schema({
courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },


subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", default: null },
chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", default: null },


level: {
type: String,
enum: ["COURSE", "SUBJECT", "CHAPTER"],
required: true
},


title: String,


questions: [
{
question: String,
options: [String],
correctIndex: Number
}
],
quizDate: Date,
isPublished: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model("Quiz", QuizSchema);