import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="container">
        {/* Left Section with Heading */}
        <div className="left-section">
          <h1 className="title">
            Welcome to <span className="brand">BiteBuddy</span>
          </h1>
          <p className="tagline">
            Passionate about connecting foodies with their dream restaurants.
            Join us for a culinary journey like no other.
          </p>
        </div>

        {/* Right Section with Image */}
        <div className="right-section">
          <img src="home copy.png" alt="BiteBuddy" className="image" />
        </div>
      </div>

      <div className="about-container">
        {/* About Section 1 */}
        <section className="about-section">
          <h2>What is BiteBuddy?</h2>
          <p>
            BiteBuddy is a cutting-edge platform designed to connect customers
            with a wide range of restaurants, making it easier than ever to
            explore, book, and manage table reservations online. Unlike a single
            restaurant, BiteBuddy is a hub where multiple restaurants can
            register, allowing customers to browse menus, book tables, and
            rebook previous reservations all in one place.
          </p>
        </section>

        {/* About Section 2 */}
        <section className="about-section">
          <h2>Start Your Journey with BiteBuddy Today</h2>
          <p>
            Whether you’re a <strong>customer</strong> looking for a great place
            to dine or a <strong>restaurant owner</strong> seeking to simplify
            table management, BiteBuddy is the perfect solution. Join us today
            and enjoy a seamless dining experience!
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home;
