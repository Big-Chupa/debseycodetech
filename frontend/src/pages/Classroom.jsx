import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Classroom.css';

const Classroom = () => {
  const { id } = useParams(); // Grabs the course ID from the URL
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0); // Tracks which video is playing
  const [loading, setLoading] = useState(true);

  // Fetch the course data when the page loads
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://debseycodetech.onrender.com/api/courses/${id}`, {
          headers: { 'x-auth-token': token } 
        });
        setCourse(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load classroom:", err);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  // THE PROGRESS TRACKER ENGINE
  // This watches the 'activeLessonIndex'. Whenever it changes, it calls the backend!
  useEffect(() => {
    const saveProgress = async () => {
      // Don't do anything if the course hasn't loaded or doesn't have dynamic lessons
      if (!course || !course.lessons || course.lessons.length === 0) return;

      try {
        const token = localStorage.getItem('token');
        await axios.post('https://debseycodetech.onrender.com/api/auth/progress', {
          courseId: id,
          lessonIndex: activeLessonIndex
        }, {
          headers: { 'x-auth-token': token } // Use your exact token header here
        });
        console.log(`Saved progress: Module ${activeLessonIndex + 1}`);
      } catch (err) {
        console.error("Could not save progress:", err);
      }
    };

    saveProgress();
  }, [activeLessonIndex, course, id]); // React runs this whenever one of these 3 things changes

  if (loading) return <div className="theater-loading"><div className="theater-spinner"></div>Loading Masterclass...</div>;
  if (!course) return <div className="theater-error">Course not found or access denied.</div>;

  // Check if this course has the new dynamic lessons array
  const hasLessons = course.lessons && course.lessons.length > 0;
  
  // If it has lessons, play the active one. If it's an old v1 course, play the preview video.
  const activeVideoUrl = hasLessons ? course.lessons[activeLessonIndex].videoUrl : course.previewVideo;

  return (
    <div className="classroom-container">
      {/* THEATER NAVIGATION */}
      <nav className="classroom-nav">
        <button onClick={() => navigate('/mylearning')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h2 className="nav-course-title">{course.title}</h2>
      </nav>

      <div className="theater-layout">
        
        {/* LEFT SIDE: THE STAGE (VIDEO PLAYER) */}
        <div className="video-section">
          <div className="video-player-wrapper">
            {activeVideoUrl ? (
              <video
                key={activeVideoUrl} // CRITICAL: Forces React to reload the player when the URL changes
                controls
                controlsList="nodownload" // Adds a tiny bit of protection against right-click downloads
                className="main-video"
                autoPlay
              >
                <source src={activeVideoUrl} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            ) : (
              <div className="no-video-placeholder">
                <p>No video available for this module.</p>
              </div>
            )}
          </div>

          <div className="lesson-details">
            <h3>{hasLessons ? course.lessons[activeLessonIndex].title : 'Course Introduction'}</h3>
            <p>Module {activeLessonIndex + 1}</p>
          </div>
        </div>

        {/* RIGHT SIDE: THE CURRICULUM PLAYLIST */}
        <div className="curriculum-sidebar">
          <div className="sidebar-header">
            <h3>Course Content</h3>
            <span>{hasLessons ? course.lessons.length : 0} Modules</span>
          </div>

          <div className="lesson-list">
            {hasLessons ? (
              course.lessons.map((lesson, index) => (
                <div
                  key={lesson._id || index}
                  className={`lesson-item ${index === activeLessonIndex ? 'active' : ''}`}
                  onClick={() => setActiveLessonIndex(index)}
                >
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-info">
                    <h4>{lesson.title}</h4>
                    <span className="duration">⏳ {lesson.duration || 'Video'}</span>
                  </div>
                  {index === activeLessonIndex && <div className="playing-indicator">▶️</div>}
                </div>
              ))
            ) : (
              <div className="lesson-item active">
                <div className="lesson-info">
                  <h4>Legacy Course Video</h4>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Classroom;