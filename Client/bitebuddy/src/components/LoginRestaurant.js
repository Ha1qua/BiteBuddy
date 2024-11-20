import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./LoginRestaurant.css";
import { useNavigate } from "react-router-dom";

function LoginRestaurant() {
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between SignUp and Login
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track form submission
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    restaurantName: "",
    ownerName: "",
    address: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const inputRefs = {
    email: useRef(),
    restaurantName: useRef(),
    ownerName: useRef(),
    address: useRef(),
    password: useRef(),
    confirmPassword: useRef(),
    phoneNumber: useRef(),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Enter a valid email (e.g., abc@gmail.com).";
    }

    if (isSignUp && formData.restaurantName.length < 7) {
      newErrors.restaurantName =
        "Restaurant name must be at least 7 characters.";
    }

    if (isSignUp && formData.ownerName.length < 3) {
      newErrors.ownerName = "Owner name must be at least 3 characters.";
    }

    if (isSignUp && formData.address.length < 10) {
      newErrors.address = "Address must be at least 10 characters.";
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must have uppercase, lowercase, numbers, special characters, and at least 8 characters.";
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const phonePattern = /^0\d{10}$/;
    if (isSignUp && !phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must start with 0 and have 11 digits.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true); // Indicate form submission
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      inputRefs[firstErrorField].current.scrollIntoView({ behavior: "smooth" });
      inputRefs[firstErrorField].current.focus();
      return;
    }

    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        if (isSignUp) {
          console.log("Signup successful:", response.data);

          // Clear form and switch to login mode
          setFormData({
            email: "",
            restaurantName: "",
            ownerName: "",
            address: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
          });
          setIsSignUp(false); // Toggle to login form
        } else {
          console.log("Login successful:", response.data);
          navigate("/dashboard"); // Redirect to dashboard after login
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Enter correct credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="image-section">
          <img
            src="loginpic copy.jpeg"
            alt="Restaurant"
            className="login-image"
          />
        </div>
        <div className="text-section">
          <p>
            Dining made effortless – Skip the wait, embrace the convenience, and
            let your cravings come to you!
          </p>
        </div>
      </div>

      <div className="form-section">
        <h2 className="h2">{isSignUp ? "Create Your Account" : "Log In"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="restaurantName">
                  Restaurant Name <span className="required">*</span>
                </label>
                <input
                  ref={inputRefs.restaurantName}
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                />
                {hasSubmitted && errors.restaurantName && (
                  <span className="error">{errors.restaurantName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="ownerName">
                  Owner Name <span className="required">*</span>
                </label>
                <input
                  ref={inputRefs.ownerName}
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                />
                {hasSubmitted && errors.ownerName && (
                  <span className="error">{errors.ownerName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Address <span className="required">*</span>
                </label>
                <input
                  ref={inputRefs.address}
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {hasSubmitted && errors.address && (
                  <span className="error">{errors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  ref={inputRefs.phoneNumber}
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {hasSubmitted && errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              ref={inputRefs.email}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {hasSubmitted && errors.email && (
              <span className="error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              ref={inputRefs.password}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {hasSubmitted && errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                ref={inputRefs.confirmPassword}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {hasSubmitted && errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button type="submit" className="btn">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="toggle-prompt">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span className="toggle-link" onClick={() => setIsSignUp(false)}>
                Log in
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span className="toggle-link" onClick={() => setIsSignUp(true)}>
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default LoginRestaurant;
