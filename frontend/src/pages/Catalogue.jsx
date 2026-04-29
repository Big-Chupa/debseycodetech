import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Catalogue.css';

const Catalogue = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem('userRole'); 

  useEffect(() => {
    fetchCourses();
  }, []);

  // Wrapped in a function so we can call it again if we need to refresh
  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://debseycodetech.onrender.com/api/courses');
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to fetch courses. Make sure your Node.js backend is running!');
      setLoading(false);
    }
  };

  // --- THE DELETION ENGINE ---
  const handleDelete = async (courseId, courseTitle) => {
    // 1. Ask for confirmation so you don't accidentally delete a 10-hour course!
    const isConfirmed = window.confirm(`WARNING: Are you sure you want to completely delete "${courseTitle}"? This cannot be undone.`);
    
    if (isConfirmed) {
      try {
        // 2. Send the kill command to the backend
        await axios.delete(`https://debseycodetech.onrender.com/api/courses/${courseId}`);
        
        // 3. Remove it from the screen immediately without reloading the page
        setCourses(courses.filter(course => course._id !== courseId));
        alert('Course deleted successfully.');
      } catch (err) {
        console.error("Delete error:", err);
        alert('Failed to delete course.');
      }
    }
  };

  if (loading) return <div className="catalogue-loading">Loading DesbyCodeTech Courses...</div>;
  if (error) return <div className="catalogue-error">{error}</div>;

  return (
    <div className="catalogue-container">
      <div className="catalogue-header">
        <h1 className="catalogue-title">Available Courses</h1>
        
        {role === 'admin' && (
          <button className="admin-add-btn" onClick={() => navigate('/admin')}>
            + Add New Course
          </button>
        )}
      </div>
      
      {courses.length === 0 ? (
        <p className="no-courses">No courses available yet. Admins need to add some!</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              
              <div className="course-image-container">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
                ) : (
                  <div className="placeholder-thumbnail">No Image</div>
                )}
                <span className="course-category-badge">{course.category}</span>
              </div>

              <div className="course-content">
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">
                  {course.description.substring(0, 80)}...
                </p>
                
                <div className="course-footer">
                  <span className="course-price">
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </span>
                  
                  <button 
                    className="view-course-btn"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    View Overview
                  </button>
                </div>

                {/* --- ADMIN ONLY DELETION ZONE --- */}
                {role === 'admin' && (
                  <div className="admin-actions" style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    <button 
                      onClick={() => handleDelete(course._id, course.title)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                    >
                      🗑️ Delete Course
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalogue;