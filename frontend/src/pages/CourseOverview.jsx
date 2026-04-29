import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// 1. WE CHANGED THIS IMPORT: We now use the physical button component!
import { PaystackButton } from 'react-paystack';
import './CourseOverview.css';

const CourseOverview = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- USER DATA GRAB ---
  let rawEmail = localStorage.getItem('userEmail');
  const userEmail = (rawEmail && rawEmail !== 'undefined' && rawEmail !== 'null') 
                    ? rawEmail 
                    : 'student@desbycodetech.com';

  const token = localStorage.getItem('token');

  // --- THE SUCCESS FUNCTION ---
  const onSuccess = async (reference) => {
    // We kept the traps just so you can see it working in the console!
    console.log("PAYSTACK SUCCESS!", reference);
    alert("Payment verified! Giving you access to the classroom...");

    try {
      await axios.post('https://debseycodetech.onrender.com/api/auth/enroll', {
        email: userEmail,
        courseId: course._id
      });
      
      alert(`Enrollment Complete! You are in!`);
      navigate('/mylearning');
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Backend Error: ${err.response?.data?.msg || err.message}`);
    }
  };

  const onClose = () => {
    alert("Payment canceled. We hope you enroll soon!");
  };

  // --- PAYSTACK BUTTON CONFIGURATION ---
  const componentProps = course ? {
    reference: (new Date()).getTime().toString(),
    email: userEmail,
    amount: course.price * 100, // Converts to kobo
    publicKey: 'pk_test_31aa636a36c45c5e06c95bf024b377abf266ef63', // <--- PUT YOUR TEST KEY HERE
    currency: 'NGN', 
    text: 'Enroll Now',
    onSuccess: onSuccess,
    onClose: onClose,
  } : {};

  // Fetch the specific course data
  useEffect(() => {
    const fetchSingleCourse = async () => {
      try {
        const response = await axios.get(`https://debseycodetech.onrender.com/api/courses/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch single course error:", err);
        setError('Failed to load course details.');
        setLoading(false);
      }
    };
    fetchSingleCourse();
  }, [id]);

  if (loading) return <div className="overview-loading">Loading Course Details...</div>;
  if (error) return <div className="overview-error">{error}</div>;
  if (!course) return <div className="overview-error">Course not found.</div>;

  return (
    <div className="course-overview-container">
      {/* HERO SECTION */}
      <div className="overview-hero">
        <div className="overview-hero-content">
          <span className="overview-category">{course.category}</span>
          <h1 className="overview-title">{course.title}</h1>
          <p className="overview-short-desc">Master the skills you need to build a name for yourself in the tech ecosystem.</p>
        </div>
      </div>

      <div className="overview-body">
        {/* Left Side: Course Details */}
        <div className="overview-details">
          <h2>About This Course</h2>
          <div className="overview-description">
            <p style={{ whiteSpace: 'pre-wrap' }}>{course.description}</p>
          </div>
          
          <div className="overview-perks">
            <h3>What you will get:</h3>
            <ul>
              <li>✅ Full lifetime access</li>
              <li>✅ Project-based learning</li>
              <li>✅ Certificate of completion</li>
              <li>✅ Access to the DesbyCodeTech community</li>
            </ul>
          </div>
        </div>

        {/* Right Side: The Checkout Card */}
        <div className="overview-checkout-card">
          <div className="checkout-image-container">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="checkout-thumbnail" />
            ) : (
              <div className="checkout-placeholder">No Image Available</div>
            )}
          </div>
          
          <div className="checkout-info">
            <div className="checkout-price">
              {course.price === 0 ? 'FREE' : `₦${course.price.toLocaleString()}`}
            </div>
            
            {/* THE SMART BUTTON LOGIC */}
            {!token ? (
              <button className="enroll-btn" onClick={() => { alert("Please login first!"); navigate('/login'); }}>
                Login to Enroll
              </button>
            ) : course.price === 0 ? (
              <button className="enroll-btn" onClick={() => onSuccess({ reference: 'FREE_COURSE' })}>
                Start Learning Now
              </button>
            ) : (
              <PaystackButton className="enroll-btn" {...componentProps} />
            )}
            
            <p className="checkout-guarantee">🔒 Secure checkout backed by Paystack</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;