import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'Software development',
    price: 0,
    thumbnail: '', 
    previewVideo: '' 
  });

  const [lessons, setLessons] = useState([
    { title: '', videoUrl: '', duration: '' }
  ]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      alert("Access Denied: Admins Only");
      navigate('/');
    }
  }, [navigate]);

  const handleCourseChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const uploadFileToCloud = async (file) => {
    const formData = new FormData();
    formData.append('video', file); 
    
    setIsUploading(true);
    setStatus({ type: 'info', message: '☁️ Streaming heavy file to Cloudinary...' });
    
    try {
      const response = await axios.post('http://localhost:5005/api/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsUploading(false);
      setStatus({ type: '', message: '' });
      return response.data.url; 
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      setStatus({ type: 'error', message: '❌ File upload failed. Check terminal.' });
      return null;
    }
  };

  const handleCourseFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadedUrl = await uploadFileToCloud(file);
    if (uploadedUrl) {
      setCourseData({ ...courseData, [fieldName]: uploadedUrl });
    }
  };

  const handleLessonFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = await uploadFileToCloud(file);
    if (uploadedUrl) {
      const updatedLessons = [...lessons];
      updatedLessons[index].videoUrl = uploadedUrl;
      setLessons(updatedLessons);
    }
  };

  const handleLessonTextChange = (e, index) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][e.target.name] = e.target.value;
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', videoUrl: '', duration: '' }]);
  };

  const removeLesson = (index) => {
    const updatedLessons = [...lessons];
    updatedLessons.splice(index, 1);
    setLessons(updatedLessons);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // We do the validation manually here instead of relying on the browser!
    if (!courseData.thumbnail) return setStatus({ type: 'error', message: '⚠️ Please upload a Course Thumbnail first.' });
    const missingVideo = lessons.some(lesson => !lesson.videoUrl);
    if (missingVideo) return setStatus({ type: 'error', message: '⚠️ Please wait for all lesson videos to finish uploading.' });

    try {
      setStatus({ type: 'info', message: '🚀 Publishing course to database...' });
      const token = localStorage.getItem('token');
      const finalPayload = { ...courseData, lessons };

      // THE FIX: Reverted to your exact backend route and your exact auth token format!
      await axios.post('http://localhost:5005/api/courses', finalPayload, {
        headers: { 'x-auth-token': token }
      });

      setStatus({ type: 'success', message: '🎉 Course successfully published to the Database!' });
      
      setCourseData({ title: '', description: '', category: 'Software development', price: 0, thumbnail: '', previewVideo: '' });
      setLessons([{ title: '', videoUrl: '', duration: '' }]);

    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.response?.data?.msg || '❌ Failed to publish course. Is the backend route correct?' });
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-hero-banner">
        <h1 className="admin-title">DebseyCodeTech Command Center</h1>
        <p className="admin-subtitle">Master Control for Course Publishing</p>
      </div>

      <div className="admin-glass-card">
        <div className="card-header">
          <h2>Create a New Masterclass</h2>
        </div>
        
        {status.message && (
          <div className={`status-banner ${status.type}`}>
            {status.message}
          </div>
        )}

        <form className="premium-form" onSubmit={handleSubmit}>
          
          <div className="input-grid">
            <div className="input-group full-width">
              <label>Course Title</label>
              <input type="text" name="title" value={courseData.title} onChange={handleCourseChange} required placeholder="e.g. Fullstack React & Node.js Masterclass" />
            </div>

            <div className="input-group full-width">
              <label>Course Description</label>
              <textarea name="description" value={courseData.description} onChange={handleCourseChange} rows="4" required placeholder="Describe what students will learn..." />
            </div>

            <div className="input-group">
              <label>Category</label>
              <div className="select-wrapper">
                <select name="category" value={courseData.category} onChange={handleCourseChange}>
                  <option value="Software development">Software development</option>
                  <option value="Frontend development">Frontend development</option>
                  <option value="Backend development">Backend development</option>
                  <option value="Fullstack development">Fullstack development</option>
                  <option value="UI/UX Design and graphic design">UI/UX Design and graphic design</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Price (₦) - Set to 0 for Free</label>
              <input type="number" name="price" value={courseData.price} onChange={handleCourseChange} min="0" required />
            </div>

            {/* THE FIX: Removed the buggy 'required' attributes from the file inputs */}
            <div className="input-group upload-box">
              <label>Course Thumbnail (Image) *Required</label>
              <input type="file" accept="image/*" onChange={(e) => handleCourseFileChange(e, 'thumbnail')} />
              {courseData.thumbnail && <div className="success-pill">✅ Cloudinary Ready</div>}
            </div>

            <div className="input-group upload-box">
              <label>Free Preview Video (Optional)</label>
              <input type="file" accept="video/*" onChange={(e) => handleCourseFileChange(e, 'previewVideo')} />
              {courseData.previewVideo && <div className="success-pill">✅ Video Ready</div>}
            </div>
          </div>

          <div className="section-divider">
            <span>Course Curriculum Builder</span>
          </div>

          <div className="lessons-container">
            {lessons.map((lesson, index) => (
              <div key={index} className="premium-lesson-card">
                <div className="lesson-card-header">
                  <h3>Module {index + 1}</h3>
                  {lessons.length > 1 && (
                    <button type="button" className="action-btn remove-btn" onClick={() => removeLesson(index)}>
                      🗑️ Remove
                    </button>
                  )}
                </div>
                
                <div className="input-grid">
                  <div className="input-group">
                    <label>Lesson Title</label>
                    <input type="text" name="title" value={lesson.title} onChange={(e) => handleLessonTextChange(e, index)} required placeholder={`e.g. Introduction to Module ${index + 1}`} />
                  </div>

                  <div className="input-group">
                    <label>Duration</label>
                    <input type="text" name="duration" value={lesson.duration} onChange={(e) => handleLessonTextChange(e, index)} placeholder="e.g., 10:45" />
                  </div>

                  {/* THE FIX: Removed the buggy 'required' attributes from the file inputs */}
                  <div className="input-group full-width upload-box lesson-upload">
                    <label>Module Video File *Required</label>
                    <input type="file" accept="video/*" onChange={(e) => handleLessonFileChange(e, index)} />
                    {lesson.videoUrl && <div className="success-pill">✅ Video Streamed Successfully</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="action-btn add-btn" onClick={addLesson}>
              ➕ Add Another Module
            </button>

            <button type="submit" className={`publish-btn ${isUploading ? 'loading' : ''}`} disabled={isUploading}>
              {isUploading ? (
                <><span className="spinner"></span> Syncing with Cloud...</>
              ) : (
                '🚀 Publish Full Masterclass'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;