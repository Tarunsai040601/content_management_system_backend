import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Register.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name Required",
        text: "Please enter your full name.",
        confirmButtonColor: "#263c33",
      });
      return;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address.",
        confirmButtonColor: "#263c33",
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must contain at least 6 characters.",
        confirmButtonColor: "#263c33",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://content-management-system-backend-g705.onrender.com/api/registerRouter/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      // Backend error
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#263c33",
        });

        return;
      }

      // Success
      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created successfully.",
        confirmButtonText: "Continue",
        confirmButtonColor: "#263c33",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });

      // Login page ki vellali ante uncomment cheyyi
      // window.location.href = "/login";
    } catch (error) {
      console.error("Registration Error:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to the server. Please try again later.",
        confirmButtonColor: "#263c33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-bg-shape shape-one"></div>
      <div className="register-bg-shape shape-two"></div>

      <div className="register-container">
        {/* LEFT SIDE */}
        <div className="register-showcase">
          <div className="showcase-overlay"></div>

          <div className="showcase-content">
            <div className="brand-logo">
              <span className="logo-icon">⌂</span>
              <span>ESTORA</span>
            </div>

            <div className="showcase-text">
              <p className="showcase-small-title">FIND YOUR PLACE</p>

              <h1>
                Your Dream Home
                <br />
                <span>Starts Here.</span>
              </h1>

              <p>
                Discover beautiful homes, premium properties and extraordinary
                spaces designed for the way you live.
              </p>
            </div>

            <div className="property-stats">
              <div className="stat-item">
                <h3>2.5K+</h3>
                <p>Properties</p>
              </div>

              <div className="stat-divider"></div>

              <div className="stat-item">
                <h3>1.8K+</h3>
                <p>Happy Clients</p>
              </div>

              <div className="stat-divider"></div>

              <div className="stat-item">
                <h3>12+</h3>
                <p>Cities</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="register-form-section">
          <div className="register-card">
            <div className="mobile-logo">
              <span className="logo-icon">⌂</span>
              <span>ESTORA</span>
            </div>

            <div className="form-heading">
              <p>WELCOME TO ESTORA</p>

              <h2>Create Your Account</h2>

              <span>Join us and discover your perfect property.</span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="input-group">
                <label htmlFor="name">Full Name</label>

                <div className="input-wrapper">
                  <span className="input-icon">👤</span>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="input-group">
                <label htmlFor="email">Email Address</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="input-group">
                <label htmlFor="password">Password</label>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              {/* ROLE */}
              <div className="input-group">
                <label htmlFor="role">Account Type</label>

                <div className="input-wrapper">
                  <span className="input-icon">♙</span>

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="customer">customer</option>

                    <option value="admin">admin</option>
                  </select>

                  <span className="select-arrow">⌄</span>
                </div>
              </div>
              {/* SUBMIT */}
              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                <span>
                  {loading ? "Creating Account..." : "Create Account"}
                </span>

                {!loading && <span className="button-arrow">→</span>}
              </button>
            </form>

            {/* LOGIN */}
            <div className="login-section">
              <span>Already have an account?</span>

              <a href="/">Login</a>
            </div>

            <div className="secure-text">
              <span>✦</span>
              Secure & trusted property platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
