const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    try {
        // Only admins can do this
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }

        const { title, description, category, thumbnail, lessons, price } = req.body;
        const newCourse = new Course({
            title, description, category, thumbnail, lessons, price, admin: req.user.id
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};