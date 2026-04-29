import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        // 1. REGISTER FLOW
        await axios.post("http://localhost:5005/api/auth/register", formData);
        alert("Registration Successful! Please login.");
        setIsRegister(false); // Switch to login view
      } else {
        // 2. LOGIN FLOW
        const response = await axios.post(
          "http://localhost:5005/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          },
        );

        // Save the JWT token to the browser's memory
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userName", response.data.user.name); // <--- WE ADDED THIS LINE
        // We grab the email straight from the form data they just typed!
        localStorage.setItem("userEmail", formData.email);

        alert(`Welcome back, ${response.data.user.name}!`);

        // Redirect based on role
        //
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "An error occurred. Make sure your backend is running.",
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isRegister ? "Join DesbyCodeTech" : "Welcome Back"}
        </h2>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            {isRegister ? "Create Account" : "Secure Login"}
          </button>
        </form>

        <div className="auth-toggle">
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Login here</span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsRegister(true)}>Register here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
