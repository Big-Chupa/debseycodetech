import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORT COMPONENTS ---
import Navbar from './components/Navbar'; // Make sure the path matches your actual Navbar file
import Footer from './components/Footer';

// --- IMPORT PAGES ---
import Home from './pages/Home';
import Login from './pages/Login';
import Catalogue from './pages/Catalogue';
import AdminDashboard from './pages/AdminPanel';
import CourseOverview from './pages/CourseOverview';
import MyLearning from './pages/MyLearning';
import Classroom from './pages/Classroom';
import Certificate from './pages/Certificate';

function App() {
  return (
    <Router>
      {/* This wrapper ensures the Footer stays at the very bottom of the screen, 
        even if the page doesn't have a lot of content.
      */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Navbar stays at the top of every page */}
        <Navbar />

        {/* The main content area expands to fill the middle space */}
        <main style={{ flex: 1, paddingTop: '70px' }}>
          <Routes>
            {/* The Home page is now the absolute front door of your website */}
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/course/:id" element={<CourseOverview />} />
            <Route path="/mylearning" element={<MyLearning />} />
            <Route path="/classroom/:id" element={<Classroom />} />
            <Route path="/certificate/:id" element={<Certificate />} />
            
          </Routes>
        </main>

        {/* Footer stays at the bottom of every page */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;