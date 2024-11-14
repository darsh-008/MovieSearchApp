// src/components/MovieItem.js
import React from "react";

const MovieItem = ({ movie, handleBookmark, isBookmarked, onClick }) => {
  return (
    <div className="movie-item" onClick={() => onClick(movie)}>
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
      <button
        className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
        onClick={(e) => {
          e.stopPropagation(); // Prevent this click from triggering the movie popup
          handleBookmark(movie);
        }}
      >
        ★
      </button>
    </div>
  );
};

export default MovieItem;
