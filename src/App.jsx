import React, { useState, useEffect } from 'react';
import Books from './services/booksService';
import BooksTable from './components/BooksTable';
import './styles/App.scss';

function App() {
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState(['All']);
  const [genreFilter, setGenreFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState({}); // New state for favorites

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteBooks');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites state changes
  useEffect(() => {
    localStorage.setItem('favoriteBooks', JSON.stringify(favorites));
  }, [favorites]);

  // On mount, fetch all books once to build the genre list
  useEffect(() => {
    const fetchAllGenres = async () => {
      setLoading(true);
      try {
        const booksAll = await new Books().askListBooks('All');
        // Collect unique genres
        const uniqueGenres = new Set();
        booksAll.forEach((b) => {
          if (Array.isArray(b.genre)) {
            b.genre.forEach((g) => uniqueGenres.add(g));
          }
        });

        // Convert each genre to "Title Case" and sort alphabetically
        const sorted = Array.from(uniqueGenres)
          .map((g) =>
            g
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          )
          .sort((a, b) => a.localeCompare(b));

        // Add "All" to the front
        setAllGenres(['All', ...sorted]);
      } catch (err) {
        console.error('Failed to fetch all books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGenres();
  }, []);

  // Whenever genreFilter changes, fetch the filtered list from server
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const filtered = await new Books().askListBooks(genreFilter);
        setBooks(filtered);
      } catch (err) {
        console.error('Failed to fetch filtered books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [genreFilter]);

  // Toggle favorite status for a book
  const toggleFavorite = (bookKey) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [bookKey]: !prevFavorites[bookKey],
    }));
  };

  return (
    <div className="app-container">
      <header>
        <h1 className="title">My Favorite Books</h1>

        <div className="genre-filter">
          <label htmlFor="genre-select">Filter by genre:</label>
          <select
            id="genre-select"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {allGenres.map((g) => (
              <option value={g} key={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main>
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <BooksTable
            books={books}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
  );
}

export default App;
