import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing, ${email}!`);
    setEmail('');
  };

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Master the Future of Tech</h1>
          <p>Join DesbyCodeTech and learn Software Development, UI/UX, and AI from industry experts.</p>
          <button className="cta-btn" onClick={() => navigate('/catalogue')}>Explore Courses</button>
        </div>
      </section>

      {/* ABOUT THE COMPANY SECTION */}
      <section className="about-section">
        <div className="about-grid">
          <div className="about-card">
            <div className="icon">📜</div>
            <h3>Our History</h3>
            <p>Founded by tech visionary Big Chupa, DesbyCodeTech started as a passion project to bridge the gap between theoretical computer science and practical, world-class software engineering.</p>
          </div>
          <div className="about-card">
            <div className="icon">👁️</div>
            <h3>Our Vision</h3>
            <p>To become the leading digital academy in Africa, empowering millions of students to build a name for themselves in the global tech ecosystem.</p>
          </div>
          <div className="about-card">
            <div className="icon">🚀</div>
            <h3>Our Mission</h3>
            <p>To provide accessible, high-quality, and project-based education that transforms beginners into job-ready full-stack developers and AI engineers.</p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay in the Loop</h2>
          <p>Subscribe to our newsletter for the latest tech tutorials, course discounts, and ecosystem news.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;