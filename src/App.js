// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import BookmarksPage from "./pages/BookmarksPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";

const App = () => {
  const [bookmarks, setBookmarks] = useState([]); // Initialize as an empty array

  // Load bookmarks from localStorage on app mount
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    if (Array.isArray(storedBookmarks)) {
      setBookmarks(storedBookmarks); // Set bookmarks only if it's an array
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage bookmarks={bookmarks} setBookmarks={setBookmarks} />} />
          <Route path="/search" element={<SearchPage bookmarks={bookmarks} setBookmarks={setBookmarks} />} />
          <Route path="/bookmarks" element={<BookmarksPage bookmarks={bookmarks} setBookmarks={setBookmarks} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
