import React, { useState, useEffect, useCallback } from 'react';
import Books from './services/booksService';
import BooksTable from './components/BooksTable';
import { debounce } from 'lodash';
import './styles/App.scss';

function App() {
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [genreFilter, setGenreFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
        const uniqueGenres = new Set();
        booksAll.forEach((b) => {
          if (Array.isArray(b.genre)) {
            b.genre.forEach((g) => uniqueGenres.add(g));
          }
        });

        const sorted = Array.from(uniqueGenres)
          .map((g) =>
            g
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          )
          .sort((a, b) => a.localeCompare(b));

        setAllGenres(sorted); // Removed 'All' from the list
        setFilteredGenres(sorted); // Initialize filtered genres without 'All'
      } catch (err) {
        console.error('Failed to fetch all books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGenres();
  }, []);
  // Debounced fetchBooks function
  const debouncedFetchBooks = useCallback(
    debounce(async (filter) => {
      setLoading(true);
      try {
        const filtered = await new Books().askListBooks(filter);
        setBooks(filtered);
      } catch (err) {
        console.error('Failed to fetch filtered books:', err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );
  // Whenever genreFilter changes, fetch the filtered list from server
  useEffect(() => {
    debouncedFetchBooks(genreFilter);
  }, [genreFilter]);

  // Toggle favorite status for a book
  const toggleFavorite = (bookKey) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [bookKey]: !prevFavorites[bookKey],
    }));
  };

  // Handle input change for autocomplete
  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    // Filter genres based on input (excluding 'All')
    const filtered = allGenres.filter((genre) =>
      genre.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredGenres(filtered);
    setShowSuggestions(true);

    // If input is empty, set genreFilter to 'All'
    if (input.trim() === '') {
      setGenreFilter('All');
    }
  };

  // Handle genre selection from suggestions
  const handleGenreSelect = (genre) => {
    setGenreFilter(genre);
    setSearchInput(genre);
    setShowSuggestions(false);
  };

  // Clear the search input and show all books
  const clearSearch = () => {
    setSearchInput('');
    setGenreFilter('All');
    setShowSuggestions(false);
  };

  // Bold the matching part of the genre name
  const highlightMatch = (genre, input) => {
    const index = genre.toLowerCase().indexOf(input.toLowerCase());
    if (index === -1) return genre;

    return (
      <>
        {genre.substring(0, index)}
        <strong>{genre.substring(index, index + input.length)}</strong>
        {genre.substring(index + input.length)}
      </>
    );
  };

  return (
    <div className="app-container">
      <header>
        <h1 className="title">My Favorite Books</h1>

        <div className="genre-filter">
          <label htmlFor="genre-autocomplete">Filter by genre:</label>
          <div className="autocomplete-container">
            <input
              id="genre-autocomplete"
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Type to search genres..."
            />
            {searchInput && (
              <button className="clear-button" onClick={clearSearch}>
                ×
              </button>
            )}
            {showSuggestions && (
              <ul className="suggestions-list">
                {filteredGenres.map((genre) => (
                  <li
                    key={genre}
                    onClick={() => handleGenreSelect(genre)}
                    className="suggestion-item"
                  >
                    {highlightMatch(genre, searchInput)}
                  </li>
                ))}
              </ul>
            )}
          </div>
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