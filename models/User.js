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
}
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema);

