import React from "react";
import "./Autocomplete.scss";

function Autocomplete({
  searchInput,
  handleInputChange,
  setShowSuggestions,
  clearSearch,
  showSuggestions,
  filteredGenres,
  handleGenreSelect,
  setGenreFilter,
}) {
  //Note: I am allow user to hit enter and search here, it might be better to not have this feature at all
  // However, if down the road we decide to allow user to search for partial match
  // like 'phy' to match biography and physics, this might come in handy
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setGenreFilter(searchInput.trim() === "" ? "All" : searchInput);
    }
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
    <div className="autocomplete-container">
      <input
        id="genre-autocomplete"
        type="text"
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Genres"
      />
      {searchInput === "" && (
        <img
          src="/icon-right.png"
          alt="Dropdown Chevron"
          className="chevron-icon"
          aria-hidden="true"
        />
      )}
      {searchInput !== "" && (
        <img
          src="/clear.png"
          alt="Clear input"
          className="clear-icon"
          onClick={clearSearch}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              clearSearch();
            }
          }}
          aria-label="Clear genre filter"
        />
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
  );
}

export default Autocomplete;
