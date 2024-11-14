// src/components/MovieDetailPopup.js
import React from "react";
import "./MovieDetailPopup.css"; // You can add your own styling for the popup

const MovieDetailPopup = ({ movie, onClose }) => {
  return (
    <div className="movie-popup-overlay">
      <div className="movie-popup">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>{movie.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
        />
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Rating:</strong> {movie.vote_average}</p>
        <p><strong>Overview:</strong> {movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieDetailPopup;
