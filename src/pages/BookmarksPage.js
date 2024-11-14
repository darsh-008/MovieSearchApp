// src/pages/BookmarksPage.js
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import MovieItem from "../components/MovieItem";
import Toast from "../components/Toast";
import MovieDetailPopup from "../components/MovieDetailPopup";

const BookmarksPage = ({ bookmarks, setBookmarks }) => {
  const [toastMessage, setToastMessage] = useState("");
  const [user] = useAuthState(auth);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (user) {
        const userBookmarksRef = doc(db, "bookmarks", user.uid);
        const userDoc = await getDoc(userBookmarksRef);

        if (userDoc.exists()) {
          setBookmarks(userDoc.data().movies || []);
        } else {
          setBookmarks([]); // No bookmarks for the user
        }
      }
    };

    fetchBookmarks();
  }, [user, setBookmarks]);

  const handleRemoveBookmark = async (movie) => {
    if (user) {
      const userBookmarksRef = doc(db, "bookmarks", user.uid);

      // Update Firestore by removing the movie
      await updateDoc(userBookmarksRef, {
        movies: arrayRemove(movie)
      });

      // Update state and show confirmation toast
      const updatedBookmarks = bookmarks.filter((b) => b.id !== movie.id);
      setBookmarks(updatedBookmarks);
      setToastMessage("Bookmark removed successfully!");
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
      <h1>Bookmarked Movies</h1>

      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}

      <div className="movie-list">
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="movie-card">
              <MovieItem
                movie={bookmark}
                handleBookmark={handleRemoveBookmark}
                isBookmarked={true}
                className="movie-item"
                onClick={() => handleMovieClick(bookmark)}
              />
            </div>
          ))
        ) : (
          <p>No bookmarks added yet.</p>
        )}
      </div>
      {showPopup && selectedMovie && (
        <MovieDetailPopup movie={selectedMovie} onClose={closePopup} />
      )}
    </div>
  );
};

export default BookmarksPage;
