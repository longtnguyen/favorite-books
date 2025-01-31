import React, { useState, useEffect, useCallback } from "react";
import Books from "./services/booksService";
import BooksTable from "./components/BooksTable/BooksTable";
import { debounce } from "lodash";
import "./App.scss";
import LoadingIndicator from "./components/LoadingIndicator/LoadingIndicator";
import Autocomplete from "./components/Autocomplete/Autocomplete";

function App() {
  const [books, setBooks] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [genreFilter, setGenreFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteBooks");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites state changes
  useEffect(() => {
    localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
  }, [favorites]);

  // On mount, fetch all books once to build the genre list
  useEffect(() => {
    const fetchAllGenres = async () => {
      setLoading(true);
      try {
        const booksAll = await new Books().askListBooks("All");
        const uniqueGenres = new Set();
        booksAll.forEach((b) => {
          if (Array.isArray(b.genre)) {
            b.genre.forEach((g) => uniqueGenres.add(g));
          }
        });

        const sorted = Array.from(uniqueGenres)
          .map((g) =>
            g
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          )
          .sort((a, b) => a.localeCompare(b));

        setAllGenres(sorted);
        setFilteredGenres(sorted);
      } catch (err) {
        console.error("Failed to fetch all books:", err);
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
        const truncatedBookList = filtered.slice(0, 10);
        setBooks(truncatedBookList);
      } catch (err) {
        console.error("Failed to fetch filtered books:", err);
      } finally {
        setLoading(false);
      }
    }, 300),
    [],
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
      genre.toLowerCase().includes(input.toLowerCase()),
    );
    setFilteredGenres(filtered);
    setShowSuggestions(true);

    // If input is empty, set genreFilter to 'All'
    if (input.trim() === "") {
      setGenreFilter("All");
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
    setSearchInput("");
    setGenreFilter("All");
    setShowSuggestions(false);
  };

  return (
    <div className="app-container">
      <header>
        {/* I cannot download the book icons from Figma so I use an alternative one, I hope this is okay*/}
        <h1 className="title">📚 My Favorite Books</h1>

        <div className="genre-filter">
          <Autocomplete
            searchInput={searchInput}
            handleInputChange={handleInputChange}
            setShowSuggestions={setShowSuggestions}
            clearSearch={clearSearch}
            showSuggestions={showSuggestions}
            filteredGenres={filteredGenres}
            handleGenreSelect={handleGenreSelect}
            setGenreFilter={setGenreFilter}
          />
        </div>
      </header>

      <main>
        {loading ? (
          <LoadingIndicator />
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
