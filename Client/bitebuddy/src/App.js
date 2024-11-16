import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// import LoginUser from "./components/LoginUser";
import LoginRestaurant from "./components/LoginRestaurant";
import Home from "./components/Home";
import Dashboard from "./components/Dasboard";
import RestaurantUser from "./components/RestaurantUser";
import Message from "./components/Message";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login-user" element={<LoginUser />} /> */}
        <Route path="/login-restaurant" element={<LoginRestaurant />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant-user" element={<RestaurantUser />} />
        <Route path="/message" element={<Message />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
