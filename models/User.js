const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
name: String,


mobile: {
type: String,
unique: true,
sparse: true,
index: true
},


email: {
type: String,
lowercase: true,
sparse: true,
index: true
},


password: {
type: String,
required: false
},


googleId: {
type: String,
sparse: true
},


authProviders: {
type: [String],
enum: ["OTP", "GOOGLE", "EMAIL"],
default: ["OTP"]
},


role: {
type: String,
enum: ["user", "admin"],
default: "user"
},


isVerified: {
type: Boolean,
default: false
},


subscription: {
status: {
type: String,
enum: ["inactive", "active", "past_due", "canceled", "trial"],
default: "active",
index: true
},
plan: {
type: String,
default: null
},
provider: {
type: String,
default: null
},
providerSubscriptionId: {
type: String,
default: null,
index: true
},
currentPeriodStart: {
type: Date,
default: null
},
currentPeriodEnd: {
type: Date,
default: null,
index: true
},
cancelAtPeriodEnd: {
type: Boolean,
default: false
},
canceledAt: {
type: Date,
default: null
},
trialEndsAt: {
type: Date,
default: null
}
},


quizStats: {
attemptCount: {
type: Number,
default: 0
},
bestScore: {
type: Number,
default: null
},
lastAttemptedAt: {
type: Date,
default: null
}
},


quizAttempts: [
{
quizId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Quiz",
required: false,
index: true
},
attemptedAt: {
type: Date,
default: Date.now,
index: true
},
score: {
type: Number,
required: true
},
totalMarks: {
type: Number,
required: false
},
obtainedMarks: {
type: Number,
required: false
}
}
]
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema);

