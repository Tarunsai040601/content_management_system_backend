import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!formData.email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address.",
        confirmButtonColor: "#263c33",
      });

      return;
    }

    // Password validation
    if (!formData.password) {
      Swal.fire({
        icon: "warning",
        title: "Password Required",
        text: "Please enter your password.",
        confirmButtonColor: "#263c33",
      });

      return;
    }

    try {
      setLoading(true);

      // =========================
      // LOGIN API
      // =========================

      const response = await fetch(
        "http://localhost:8095/api/registerRouter/Login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      console.log("Login Response:", data);

      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid email or password.",
          confirmButtonColor: "#263c33",
        });

        return;
      }

      // =================================================
      // IMPORTANT:
      // Backend response:
      //
      // data.user.role
      // data.token
      // =================================================

      const role = data.user?.role;
      const token = data.token;

      console.log("User Role:", role);
      console.log("Token:", token);

      // =========================
      // TOKEN CHECK
      // =========================

      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Login Error",
          text: "Authentication token was not received.",
          confirmButtonColor: "#263c33",
        });

        return;
      }

      // =========================
      // ADMIN LOGIN
      // =========================

      if (role === "admin") {
        // Save ADMIN token
        localStorage.setItem("adminToken", token);

        // Remove customer token
        localStorage.removeItem("customerToken");

        // Save role
        localStorage.setItem("userRole", "admin");

        // Save admin details if needed later
        localStorage.setItem("adminUser", JSON.stringify(data.user));

        await Swal.fire({
          icon: "success",
          title: "Welcome Admin!",
          text: data.message || "Admin login successful.",
          confirmButtonText: "Continue",
          confirmButtonColor: "#263c33",
        });

        // Admin Dashboard
        navigate("/admin-dashboard");

        return;
      }

      // =========================
      // CUSTOMER LOGIN
      // =========================

      if (role === "customer") {
        // Save CUSTOMER token
        localStorage.setItem("customerToken", token);

        // Remove admin token
        localStorage.removeItem("adminToken");

        // Save role
        localStorage.setItem("userRole", "customer");

        // Save customer details if needed
        localStorage.setItem("customerUser", JSON.stringify(data.user));

        await Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: data.message || "Customer login successful.",
          confirmButtonText: "Continue",
          confirmButtonColor: "#263c33",
        });

        // Customer Dashboard
        navigate("/customer-dashboard");

        return;
      }

      // =========================
      // INVALID ROLE
      // =========================

      Swal.fire({
        icon: "error",
        title: "Invalid Role",
        text: "User role is not recognized.",
        confirmButtonColor: "#263c33",
      });
    } catch (error) {
      console.error("Login Error:", error);

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
    <div className="login-page">
      {/* Decorative Shapes */}

      <div className="login-orb login-orb-one"></div>

      <div className="login-orb login-orb-two"></div>

      <div className="login-container">
        {/* =========================
            LEFT
        ========================= */}

        <div className="login-visual">
          <div className="login-image-overlay"></div>

          <div className="login-visual-content">
            <div className="login-brand">
              <span className="login-brand-icon">⌂</span>

              <span>ESTORA</span>
            </div>

            <div className="login-quote">
              <div className="quote-line"></div>

              <h1>
                Welcome
                <br />
                <span>Home.</span>
              </h1>

              <p>
                Your next chapter begins with the right address. Explore
                exceptional properties made for you.
              </p>
            </div>

            <div className="login-property-card">
              <div className="mini-property-image"></div>

              <div className="mini-property-content">
                <span>FEATURED PROPERTY</span>

                <h3>Modern Luxury Villa</h3>

                <p>Hyderabad, Telangana</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT
        ========================= */}

        <div className="login-form-section">
          <div className="login-card">
            {/* Mobile Logo */}

            <div className="login-mobile-brand">
              <span className="login-brand-icon">⌂</span>

              <span>ESTORA</span>
            </div>

            {/* Heading */}

            <div className="login-heading">
              <span className="login-overline">WELCOME BACK</span>

              <h2>
                Sign in to
                <br />
                your account
              </h2>

              <p>Access your properties and manage your real-estate journey.</p>
            </div>

            {/* =========================
                FORM
            ========================= */}

            <form onSubmit={handleSubmit}>
              {/* Email */}

              <div className="login-input-group">
                <label htmlFor="login-email">Email Address</label>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">✉</span>

                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}

              <div className="login-input-group">
                <div className="login-label-row">
                  <label htmlFor="login-password">Password</label>
                </div>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>

              {/* Button */}

              <button type="submit" className="login-submit" disabled={loading}>
                <span>{loading ? "Signing In..." : "Sign In"}</span>

                {!loading && <span className="login-arrow">→</span>}
              </button>
            </form>

            {/* Register */}

            <div className="login-register">
              <span>Don't have an account?</span>

              <a href="/register">Create Account</a>
            </div>

            {/* Security */}

            <div className="login-security">
              <span>✦</span>

              <p>Your information is protected with secure authentication.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
