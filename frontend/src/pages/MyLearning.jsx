import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyLearning.css";

const MyLearning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progressData, setProgressData] = useState([]); // Stores the bookmarks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Student";

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        // Knock on the new backend door we just built!
        const response = await axios.get(
          "http://localhost:5005/api/auth/my-learning",
          {
            headers: { "x-auth-token": token },
          }
        );

        // Save both pieces of data to state
        setEnrolledCourses(response.data.enrolledCourses);
        setProgressData(response.data.courseProgress);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load your learning dashboard.");
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading)
    return <div className="mylearning-loading">Loading your classroom...</div>;
  if (error) return <div className="mylearning-error">{error}</div>;

  return (
    <div className="mylearning-container">
      <div className="mylearning-header">
        <h1>Welcome back, {userName} 👋</h1>
        <p>Pick up right where you left off.</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="empty-state">
          <h2>You haven't enrolled in any courses yet!</h2>
          <button onClick={() => navigate("/catalogue")} className="browse-btn">
            Browse Catalogue
          </button>
        </div>
      ) : (
        <div className="mylearning-grid">
          {enrolledCourses.map((course) => {
            // --- THE 4TH GRADE MATH ENGINE ---
            // 1. Find the bookmark for this specific course
            const bookmark = progressData.find(
              (p) => p.courseId === course._id
            );

            // 2. Count total videos in the course
            const totalLessons =
              course.lessons && course.lessons.length > 0
                ? course.lessons.length
                : 1;

            // 3. Count how many videos they finished
            const watchedLessons = bookmark
              ? bookmark.completedLessons.length
              : 0;

            // 4. Calculate the percentage
            const percentage = Math.round(
              (watchedLessons / totalLessons) * 100
            );

            return (
              <div key={course._id} className="mylearning-card">
                <div className="mylearning-image-wrapper">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="mylearning-thumbnail"
                    />
                  ) : (
                    <div className="mylearning-placeholder">No Image</div>
                  )}

                  {/* The Dynamic Progress Bar! */}
                  <div className="progress-overlay">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {percentage}% Complete
                    </span>
                  </div>
                </div>

                <div className="mylearning-content">
                  <h3>{course.title}</h3>

                  {/* --- THE UPGRADED BUTTON LAYOUT --- */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {percentage === 100 ? (
                      <>
                        <button 
                          className="resume-btn"
                          style={{ background: '#334155', color: '#fff' }} 
                          onClick={() => navigate(`/classroom/${course._id}`)}
                        >
                          🔄 Review Masterclass
                        </button>

                        <button
                          className="resume-btn"
                          style={{
                            background: "#fbbf24",
                            color: "#000",
                            boxShadow: "0 4px 14px rgba(251, 191, 36, 0.4)",
                          }}
                          onClick={() => navigate(`/certificate/${course._id}`)}
                        >
                          🏆 View Certificate
                        </button>
                      </>
                    ) : (
                      <button
                        className="resume-btn"
                        onClick={() => navigate(`/classroom/${course._id}`)}
                      >
                        ▶ Resume Learning
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyLearning;