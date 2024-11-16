import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LoginRestaurant.css";
import { useNavigate } from "react-router-dom";

function LoginRestaurant() {
  const [isSignUp, setIsSignUp] = useState(true); // move between signup and login
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    restaurantName: "",
    ownerName: "",
    address: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "abc@gmail.com";
    }

    if (formData.restaurantName.length < 7) {
      newErrors.restaurantName =
        "Restaurant name must be at least 7 characters";
    }

    if (formData.ownerName.length < 3) {
      newErrors.ownerName = "Owner name must be at least 3 characters";
    }

    if (formData.address.length < 10) {
      newErrors.address = "Address must be at least 10 characters";
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must contain capital & small letters, numbers, special symbols, and be at least 8 characters";
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const phonePattern = /^0\d{10}$/;
    if (!phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must start with 0 and be 11 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form refresh when error occurred
    const endpoint = isSignUp ? "/auth/signup" : "/auth/login";

    try {
      // POST request to send data to the server
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        formData
      );
      alert(isSignUp ? "Signup successful!" : "Login successful!");
      console.log(response.data);

      // Check if the response contains restaurantId and store it
      if (response.data.restaurantId) {
        localStorage.setItem("restaurantId", response.data.restaurantId); // Store restaurant ID
      }

      // Clear the form fields after success
      setFormData({
        email: "",
        restaurantName: "",
        ownerName: "",
        address: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      });
      if (!isSignUp) {
        navigate("/dashboard"); // Navigate to dashboard after login
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0; // Check if the form is valid

  return (
    <div className="login-container">
      <div className="form-section">
        <h2 className="head">
          {isSignUp ? "Create Your Account" : "Unlock your account"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="restaurantName">Restaurant Name</label>
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                />
                {errors.restaurantName && (
                  <span className="error">{errors.restaurantName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="ownerName">Restaurant Owner Name</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
                {errors.ownerName && (
                  <span className="error">{errors.ownerName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                {errors.address && (
                  <span className="error">{errors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="0\d{10}"
                  title="Phone number must be 11 digits and start with 0."
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button type="submit" className="btn">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>

          <p className="toggle-prompt">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span
                  className="toggle-link"
                  onClick={() => setIsSignUp(false)}
                >
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
        </form>
      </div>
    </div>
  );
}
export default LoginRestaurant;
