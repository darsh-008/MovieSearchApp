// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "./Navbar.css"; 

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); // Track logged-in user
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
    // Track auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode); // Save dark mode preference
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    <nav>
      <h1>Movie Search App</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/bookmarks">Bookmarks</Link>
        </li>
        <li>
          {user ? (
            <button onClick={handleLogout} className="nav-button">Logout</button>
          ) : (
            <button onClick={() => navigate("/login")} className="nav-button">Login</button>
          )}
        </li>
      </ul>
      <ul>
        <li>
        <form onSubmit={handleSearchSubmit} className="search-form">
            <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
        </li>
        <li>
        <div className="dark-mode-toggle">
            <div
              className={`switch ${isDarkMode ? "on" : "off"}`}
              onClick={handleDarkModeToggle}
            >
              <div className="slider"></div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
