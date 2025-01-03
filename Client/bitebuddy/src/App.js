import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LoginUser from "./components/LoginUser";
import LoginRestaurant from "./components/LoginRestaurant";
import Home from "./components/Home";
import Dashboard from "./components/Dasboard";
import RestaurantUser from "./components/RestaurantUser";
import Message from "./components/Message";
import Chef from "./components/Chef";
import Review from "./components/Reviews";
import Insights from "./components/Insights";
import Testcase from "./components/Testcase";
import Faqs from "./components/Faqs";

function App() {
  const [chefMessages, setChefMessages] = useState([]);

  const addChefMessage = (message) => {
    setChefMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login-user" element={<LoginUser />} /> */}
        <Route path="/login-restaurant" element={<LoginRestaurant />} />
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant-user" element={<RestaurantUser />} />
        <Route path="/insights" element={<Insights />} />
        <Route
          path="/chef"
          element={<Chef addChefMessage={addChefMessage} />}
        />
        <Route
          path="/message"
          element={<Message chefMessages={chefMessages} />}
        />
        <Route path="/review" element={<Review />} />
        <Route path="/testcase" element={<Testcase />} />
        <Route path="/faq" element={<Faqs />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
