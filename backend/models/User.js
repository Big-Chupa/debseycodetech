const mongoose = require('mongoose');

// A mini-schema to track how far along they are in a specific course
const progressSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lastWatchedLesson: { type: Number, default: 0 }, // Tracks the index of the video they are on
  completedLessons: [{ type: Number }] // Array of lesson indexes they have fully watched
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  
  // The list of courses they own
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  
  // THE NEW UPGRADE: The list of bookmarks for those courses!
  courseProgress: [progressSchema]

}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);