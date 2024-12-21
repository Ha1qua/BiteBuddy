import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Custom CSS

function Navbar() {
  const [visibleLinks, setVisibleLinks] = useState([]);

  useEffect(() => {
    const navLinks = ["Home", "Login", "Chef", "TestCaseResult", "FAQ"];
    let delay = 2000; // 2 seconds

    const showLinkWithDelay = (link, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setVisibleLinks((prevLinks) => [...prevLinks, link]);
          resolve();
        }, delay * index);
      });
    };

    // Sequentially add each link with the delay
    const addLinksSequentially = async () => {
      for (let i = 0; i < navLinks.length; i++) {
        await showLinkWithDelay(navLinks[i], i);
      }
    };

    addLinksSequentially();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <p className="heading">
          <img
            src="logo copy.jpeg"
            alt="Bite"
            style={{ width: "30px", height: "30px", marginRight: "7px" }}
          />
          BiteBuddy
        </p>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {visibleLinks.includes("Home") && (
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
            )}
            {visibleLinks.includes("Login") && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link"
                  href="/"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  Login
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/login-user">
                      Login as User
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/login-restaurant">
                      Login as Restaurant
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {visibleLinks.includes("Chef") && (
              <li className="nav-item">
                <Link className="nav-link" to="/chef">
                  Chef
                </Link>
              </li>
            )}
            {visibleLinks.includes("TestCaseResult") && (
              <li className="nav-item">
                <Link className="nav-link" to="/testcase">
                  TestCaseResult
                </Link>
              </li>
            )}
            {visibleLinks.includes("FAQ") && (
              <li className="nav-item">
                <Link className="nav-link" to="/faq">
                  FAQ
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
