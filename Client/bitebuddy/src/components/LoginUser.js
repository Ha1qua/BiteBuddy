import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginUser.css";

function LoginUser() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [specialNotes, setSpecialNotes] = useState("");
  const [orderSummary, setOrderSummary] = useState(null);

  // Error states
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    numberOfPeople: "",
  });

  // Validation functions
  const validateFullName = (name) => /^[a-zA-Z\s]{3,}$/.test(name);
  const validatePhoneNumber = (number) => /^\d{11}$/.test(number);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateNumberOfPeople = (number) =>
    Number.isInteger(Number(number)) && number > 0;

  const navigate = useNavigate();

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      fullName: "",
      phoneNumber: "",
      email: "",
      numberOfPeople: "",
    });

    let formValid = true;

    // Validate fields
    if (!validateFullName(fullName)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName:
          "Full Name must be at least 3 characters long and contain only alphabets and spaces.",
      }));
      formValid = false;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone Number should contain exactly 11 digits.",
      }));
      formValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "", // Clear the error message if valid
      }));
    }

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email.",
      }));
      formValid = false;
    }

    if (!validateNumberOfPeople(numberOfPeople)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        numberOfPeople:
          "Number of people should be a valid integer greater than 0.",
      }));
      formValid = false;
    }

    if (!formValid) {
      return;
    }

    // Generate table number (for demo purposes, random between 1 and 100)
    const tableNumber = Math.floor(Math.random() * 100) + 1;

    // Assuming $10 per person for total
    const total = numberOfPeople * 10;

    // Create an order summary object
    const summary = {
      fullName,
      phoneNumber,
      email,
      reservationDate,
      reservationTime,
      numberOfPeople,
      specialNotes,
      total,
    };

    // Set the order summary to display
    setOrderSummary(summary);
  };

  // Handle confirm action
  const handleConfirm = () => {
    // Send the API request using axios, which returns a Promise
    axios
      .post("http://localhost:5000/api/reservations", orderSummary)
      .then((response) => {
        // Log the success message
        console.log("Reservation created successfully:", response.data);

        // Simulate a delay using setTimeout (like thread sleep)
        return new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      })
      .then(() => {
        // Navigate to the notification page after the delay
        navigate("/Notification");
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating reservation:", error);
        alert("There was an issue creating the reservation. Please try again.");
      });
  };

  // Handle edit action
  const handleEdit = () => {
    setOrderSummary(null); // Reset order summary to edit the form again
  };

  return (
    <div className="login-user-container">
      <div className="login-user-form-container">
        <h1>Make a Reservation</h1>

        {/* Reservation Form */}
        {!orderSummary ? (
          <form className="login-user-form" onSubmit={handleFormSubmit}>
            <div className="form-field">
              <label>Full Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      fullName: "",
                    }));
                  }
                }}
                required
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>

            <div className="form-field">
              <label>Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      phoneNumber: "",
                    }));
                  }
                }}
                required
              />
              {errors.phoneNumber && (
                <p className="error">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="form-field">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      email: "",
                    }));
                  }
                }}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-field">
              <label>Date of Reservation:</label>
              <input
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Time of Reservation:</label>
              <input
                type="time"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                required
              />
            </div>

            {/* Number of People Field */}
            <div className="form-field">
              <label>Number of People:</label>
              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => {
                  setNumberOfPeople(e.target.value);
                  if (errors.numberOfPeople) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      numberOfPeople: "",
                    }));
                  }
                }}
                min="1"
                required
              />
              {errors.numberOfPeople && (
                <p className="error">{errors.numberOfPeople}</p>
              )}
            </div>

            {/* Special Notes Field */}
            <div className="form-field">
              <label>Special Notes:</label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g Please provide 2 baby chairs" // Placeholder text
              />
            </div>

            <button type="submit">Continue</button>
          </form>
        ) : (
          // Order Summary after form submission
          <div className="login-user-order-summary">
            <h2>Order Summary</h2>
            <p>
              <strong>Full Name:</strong> {orderSummary.fullName}
            </p>
            <p>
              <strong>Phone Number:</strong> {orderSummary.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {orderSummary.email}
            </p>
            <p>
              <strong>Reservation Date:</strong> {orderSummary.reservationDate}
            </p>
            <p>
              <strong>Reservation Time:</strong> {orderSummary.reservationTime}
            </p>
            <p>
              <strong>Number of People:</strong> {orderSummary.numberOfPeople}
            </p>
            <p>
              <strong>Special Notes:</strong>{" "}
              {orderSummary.specialNotes || "None"}
            </p>
            <p>
              <strong>Total for Reservation:</strong> ${orderSummary.total}
            </p>

            {/* Edit and Confirm Buttons */}
            <button className="b" onClick={handleEdit}>
              Edit
            </button>
            <button className="b" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginUser;
