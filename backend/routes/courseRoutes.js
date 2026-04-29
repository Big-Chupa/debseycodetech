const express = require('express');
const router = express.Router();

// THE CRITICAL FIX: Importing the Course model so MongoDB knows what we are talking about
const Course = require('../models/Course');

// ==========================================
// 1. GET ALL COURSES (For the Student Catalogue)
// ==========================================
router.get('/', async (req, res) => {
    try {
        // Fetches all courses and sorts them so the newest ones appear first
        const courses = await Course.find().sort({ createdAt: -1 }); 
        res.status(200).json(courses);
    } catch (err) {
        console.error("Fetch Courses Error:", err);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// ==========================================
// 2. GET A SINGLE COURSE (For the Course Overview Page later)
// ==========================================
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (err) {
        console.error("Fetch Single Course Error:", err);
        res.status(500).json({ error: 'Failed to fetch the course' });
    }
});

// ==========================================
// 3. CREATE A NEW COURSE (For the Admin Dashboard)
// ==========================================
router.post('/', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error("Create Course Error:", err);
        res.status(500).json({ error: 'Failed to create course' });
    }
});

// ==========================================
// 4. THE DELETION ENGINE (Destroy a course)
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        // Find the course by its ID and remove it completely from MongoDB
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        
        if (!deletedCourse) {
            return res.status(404).json({ msg: 'Course not found in the database.' });
        }
        
        res.status(200).json({ msg: 'Course successfully deleted!' });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: 'Failed to delete course' });
    }
});

module.exports = router;