// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Toast from "../components/Toast";
import MovieDetailPopup from "../components/MovieDetailPopup";

const HomePage = ({ bookmarks, setBookmarks }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [user] = useAuthState(auth);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const apiKey = "5391343148960f0d40e995a08483ca5c";

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
        );
        const data = await response.json();
        setTrendingMovies(data.results);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, [apiKey]);

  const handleAddBookmark = async (movie) => {
    if (!user) {
      setToastMessage("Please log in to bookmark movies!");
      return;
    }

    const userBookmarksRef = doc(db, "bookmarks", user.uid);
    const userDoc = await getDoc(userBookmarksRef);
    const isBookmarked = bookmarks.some((b) => b.id === movie.id);

    if (!isBookmarked) {
      if (userDoc.exists()) {
        await updateDoc(userBookmarksRef, {
          movies: arrayUnion(movie)
        });
      } else {
        await setDoc(userBookmarksRef, { movies: [movie] });
      }
      const updatedBookmarks = [...bookmarks, movie];
      setBookmarks(updatedBookmarks);
      setToastMessage("Movie added to bookmarks!");
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
      <h1>Trending Movies</h1>
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}
      <div className="movie-list">
        {trendingMovies.length > 0 ? (
          trendingMovies.map((movie) => {
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
          <p>No trending movies available.</p>
        )}
      </div>
      {showPopup && selectedMovie && (
        <MovieDetailPopup movie={selectedMovie} onClose={closePopup} />
      )}
    </div>
  );
};

export default HomePage;
