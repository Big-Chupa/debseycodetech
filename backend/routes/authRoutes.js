const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware//authMiddleware');

router.post('/register', register);
router.post('/login', login);

// --- ENROLL STUDENT AFTER PAYMENT ---
router.post('/enroll', async (req, res) => {
  try {
    const { email, courseId } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Prevent double-buying
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ msg: 'You already own this course!' });
    }

    // Add the course to their backpack and save
    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ msg: 'Successfully enrolled!' });
  } catch (err) {
    console.error("Enrollment Error:", err);
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// --- GET STUDENT'S PURCHASED COURSES ---
router.post('/my-courses', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).populate('enrolledCourses');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json(user.enrolledCourses);
  } catch (err) {
    console.error("Fetch My Courses Error:", err);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
});

// THE PROGRESS UPDATE ROUTE
// Note: Make sure your auth middleware is applied so you know WHICH student is updating!
router.post('/progress', auth, async (req, res) => {
  try {
    const { courseId, lessonIndex } = req.body;
    const userId = req.user.id; // From your auth token

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Look to see if they already have a bookmark for this course
    const courseProgressIndex = user.courseProgress.findIndex(
      (p) => p.courseId.toString() === courseId
    );

    if (courseProgressIndex > -1) {
      // They already started this course! Update their bookmark.
      user.courseProgress[courseProgressIndex].lastWatchedLesson = lessonIndex;
      
      // Add this lesson to completed array ONLY if it's not already there
      if (!user.courseProgress[courseProgressIndex].completedLessons.includes(lessonIndex)) {
        user.courseProgress[courseProgressIndex].completedLessons.push(lessonIndex);
      }
    } else {
      // First time watching this course! Create a new bookmark.
      user.courseProgress.push({
        courseId,
        lastWatchedLesson: lessonIndex,
        completedLessons: [lessonIndex]
      });
    }

    await user.save();
    res.json({ msg: 'Progress saved successfully', progress: user.courseProgress });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// THE PROGRESS UPDATE ROUTE
// Note: Make sure your auth middleware is applied so you know WHICH student is updating!
router.post('/progress', auth, async (req, res) => {
  try {
    const { courseId, lessonIndex } = req.body;
    const userId = req.user.id; // From your auth token

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Look to see if they already have a bookmark for this course
    const courseProgressIndex = user.courseProgress.findIndex(
      (p) => p.courseId.toString() === courseId
    );

    if (courseProgressIndex > -1) {
      // They already started this course! Update their bookmark.
      user.courseProgress[courseProgressIndex].lastWatchedLesson = lessonIndex;
      
      // Add this lesson to completed array ONLY if it's not already there
      if (!user.courseProgress[courseProgressIndex].completedLessons.includes(lessonIndex)) {
        user.courseProgress[courseProgressIndex].completedLessons.push(lessonIndex);
      }
    } else {
      // First time watching this course! Create a new bookmark.
      user.courseProgress.push({
        courseId,
        lastWatchedLesson: lessonIndex,
        completedLessons: [lessonIndex]
      });
    }

    await user.save();
    res.json({ msg: 'Progress saved successfully', progress: user.courseProgress });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET STUDENT'S ENROLLED COURSES & PROGRESS
router.get('/my-learning', auth, async (req, res) => {
  try {
    // Find the user and automatically populate the full course details
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send back both the courses and the progress array
    res.json({
      enrolledCourses: user.enrolledCourses,
      courseProgress: user.courseProgress
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;