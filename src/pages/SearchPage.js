// src/pages/SearchPage.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Toast from "../components/Toast";
import MovieDetailPopup from "../components/MovieDetailPopup";

const SearchPage = ({ bookmarks, setBookmarks }) => {
  const [movies, setMovies] = useState([]);
  const [toastMessage, setToastMessage] = useState(""); 
  const [user] = useAuthState(auth);
  const query = new URLSearchParams(useLocation().search).get("q");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const apiKey = "5391343148960f0d40e995a08483ca5c"; 

  useEffect(() => {
    const fetchMovies = async () => {
      if (query) {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
          );
          const data = await response.json();
          setMovies(data.results);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      }
    };

    fetchMovies();
  }, [query, apiKey]);

  const handleAddBookmark = async (movie) => {
    if (!user) {
      setToastMessage("You need to be logged in to add bookmarks.");
      return;
    }

    const isBookmarked = bookmarks.some((b) => b.id === movie.id);

    if (!isBookmarked) {
      try {
        const userBookmarksRef = doc(db, "bookmarks", user.uid);
        const userDoc = await getDoc(userBookmarksRef);

        if (userDoc.exists()) {
          // If document exists, update it
          await updateDoc(userBookmarksRef, {
            movies: arrayUnion(movie),
          });
        } else {
          // If document doesn't exist, create it with the movie
          await setDoc(userBookmarksRef, {
            movies: [movie],
          });
        }

        const updatedBookmarks = [...bookmarks, movie];
        setBookmarks(updatedBookmarks);
        setToastMessage("Movie added to bookmarks!");
      } catch (error) {
        console.error("Error adding bookmark:", error);
        setToastMessage("Failed to add bookmark. Please try again.");
      }
    } else {
      setToastMessage("This movie is already bookmarked!");
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowPopup(true); 
  };

  const closePopup = () => setShowPopup(false);
  const closeToast = () => setToastMessage("");
  
  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => {
            const isBookmarked = bookmarks.some((b) => b.id === movie.id);
            return (
              <div key={movie.id} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  onClick={() => handleMovieClick(movie)}
                />
                <h3>{movie.title}</h3>
                <p>Release Date: {movie.release_date}</p>
                <p>Rating: {movie.vote_average}</p>
                <button
                  className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
                  onClick={() => handleAddBookmark(movie)}
                >
                  ★
                </button>
              </div>
            );
          })
        ) : (
          <p>No movies found.</p>
        )}
      </div>
      {showPopup && selectedMovie && (
        <MovieDetailPopup movie={selectedMovie} onClose={closePopup} />
      )}
    </div>
  );
};

export default SearchPage;
