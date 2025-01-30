import React, { useState, useEffect } from 'react';
import Books from './services/booksService';
import BooksTable from './components/BooksTable';

function App() {
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState(['All']);
  const [genreFilter, setGenreFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // Sorting config: which column, which direction
  const [sortConfig, setSortConfig] = useState({
    key: null,     // 'title', 'author', 'year'
    direction: 'asc',
  });

  // On mount, fetch all books => build a unique list of genres
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

  // Handle dropdown changes
  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
  };

  // Handle table column header click => update sortConfig
  const handleSortChange = (column) => {
    setSortConfig((prev) => {
      // If clicking the same column, toggle direction
      if (prev.key === column) {
        return {
          ...prev,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // Switching to a new column, default to 'asc'
        return { key: column, direction: 'asc' };
      }
    });
  };

  // Sort the books in memory, according to sortConfig
  const sortedBooks = React.useMemo(() => {
    if (!sortConfig.key) return books; // no sort column chosen
    const { key, direction } = sortConfig;
    // Make a copy to avoid mutating state
    const sorted = [...books];

    sorted.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      // For "year", let's do numeric comparison
      // For "title"/"author", case-insensitive string compare
      if (key === 'year') {
        return Number(valA) - Number(valB);
      } else {
        // key is 'title' or 'author'
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      }
    });

    // Reverse if direction is 'desc'
    if (direction === 'desc') {
      sorted.reverse();
    }
    return sorted;
  }, [books, sortConfig]);

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
          <BooksTable
            books={sortedBooks}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
