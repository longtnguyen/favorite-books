import React, { useState, useEffect } from 'react';
import Books from './services/booksService';
import BooksTable from './components/BooksTable';

function App() {
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState(['All']);
  const [genreFilter, setGenreFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // On mount, fetch all books
  useEffect(() => {
    const fetchAllGenres = async () => {
      setLoading(true);
      try {
        const booksAll = await new Books().askListBooks('All');
        
        // Collect unique genres, help with deduping
        const uniqueGenres = new Set();
        booksAll.forEach((b) => {
          if (Array.isArray(b.genre)) {
            b.genre.forEach((g) => uniqueGenres.add(g));
          }
        });
  
        // 1) Convert each genre to "Title Case" (first letter of each word uppercase)
        // 2) Sort them alphabetically, this might not be needed, but here just in case
        const sorted = Array.from(uniqueGenres)
          .map((g) => {
            return g
              .split(' ')
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join(' ');
          })
          .sort((a, b) => a.localeCompare(b));
  
        // 3) Add 'All' to the front
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

  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
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
            onChange={handleGenreChange}
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
          <BooksTable books={books} />
        )}
      </main>
    </div>
  );
}

export default App;
