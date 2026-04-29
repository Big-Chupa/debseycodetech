const mongoose = require('mongoose');

// We create a mini-schema for the individual lessons
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String, default: '' }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Software development' },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  previewVideo: { type: String, default: '' },
  
  // THE UPGRADE: We tell Mongoose to expect an array of lessons!
  lessons: [lessonSchema]
  
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);