import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Certificate.css';

const Certificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef(null); // This points the camera at the certificate
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Dedicated Student';

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5005/api/courses/${id}`, {
          headers: { 'x-auth-token': token } 
        });
        setCourse(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load certificate data:", err);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // THE PDF GENERATOR ENGINE
  const downloadCertificate = () => {
    const input = certificateRef.current;
    
    // Take a 2x scale snapshot for high-quality printing
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      // Create a Landscape, millimeters, A4 size PDF
      const pdf = new jsPDF('landscape', 'mm', 'a4'); 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userName}_${course.title}_Certificate.pdf`);
    });
  };

  if (loading) return <div className="cert-loading">Generating your achievement...</div>;
  if (!course) return <div className="cert-error">Course not found.</div>;

  return (
    <div className="certificate-wrapper">
      <div className="cert-nav">
        <button onClick={() => navigate('/mylearning')} className="back-btn">← Back to Dashboard</button>
        <button onClick={downloadCertificate} className="download-btn">📥 Download PDF</button>
      </div>

      {/* THIS IS THE AREA THE PDF ENGINE WILL SNAPSHOT */}
      <div className="certificate-container" ref={certificateRef}>
        <div className="certificate-border">
          <div className="certificate-content">
            
            <div className="cert-header">
              <h2>DebseyCodeTech</h2>
              <p>Certificate of Completion</p>
            </div>

            <div className="cert-body">
              <p className="presented-to">This is proudly presented to</p>
              <h1 className="student-name">{userName}</h1>
              <p className="completion-text">
                For successfully completing all modules and demonstrating mastery in
              </p>
              <h3 className="course-title">{course.title}</h3>
            </div>

            <div className="cert-footer">
              <div className="signature-block">
                <div className="signature">Big Chupa</div>
                <div className="line"></div>
                <p>Lead Instructor</p>
              </div>
              
              <div className="seal">
                <span>🏆</span>
              </div>

              <div className="date-block">
                <div className="date">{new Date().toLocaleDateString()}</div>
                <div className="line"></div>
                <p>Date Awarded</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;