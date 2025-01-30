import React, { useState, useMemo } from 'react';
import BookRow from './BookRow';
// Note: Client-side sorting is implemented here to demonstrate a different way we can accomplish sorting.
// In a production environment, server-side sortin might be better, especially when the source of truth resides on the server.
function BooksTable({ books, favorites, toggleFavorite }) {
  // Track which column is sorted and the sort direction ("asc" or "desc").
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Toggle or set the sort direction whenever a header is clicked.
  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        // Toggle direction
        return {
          ...prev,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // Sort ascending on the new column
        return { key: columnKey, direction: 'asc' };
      }
    });
  };

  // Helper to render the symbol next to the header.
  const sortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  // Sort the books array based on sortConfig.
  const sortedBooks = useMemo(() => {
    if (!sortConfig.key) return books; // No sorting yet

    // Create a copy to sort
    const sorted = [...books].sort((a, b) => {
      let aVal, bVal;

      if (sortConfig.key === 'favorite') {
        // Sort based on favorite status
        aVal = favorites[`${a.title}-${a.author}-${a.year}`] ? 1 : 0;
        bVal = favorites[`${b.title}-${b.author}-${b.year}`] ? 1 : 0;
      } else {
        // Sort based on other keys (title, author, year)
        aVal = a[sortConfig.key].toLowerCase();
        bVal = b[sortConfig.key].toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [books, sortConfig, favorites]);

  return (
    <table className="books-table">
      <thead>
        <tr>
          <th
            onClick={() => handleSort('title')}
            style={{ cursor: 'pointer' }}
          >
            Title{sortIndicator('title')}
          </th>
          <th
            onClick={() => handleSort('author')}
            style={{ cursor: 'pointer' }}
          >
            Author{sortIndicator('author')}
          </th>
          <th
            onClick={() => handleSort('year')}
            style={{ cursor: 'pointer' }}
          >
            Year{sortIndicator('year')}
          </th>

          <th>Genres</th>
          <th
            onClick={() => handleSort('favorite')}
            style={{ cursor: 'pointer' }}
          >
            Currently Reading{sortIndicator('favorite')}
          </th> {/* New Favorite Column Header */}
        </tr>
      </thead>

      <tbody>
        {sortedBooks && sortedBooks.length > 0 ? (
          sortedBooks.map((book, index) => {
            // Create a unique key for each book
            const bookKey = `${book.title}-${book.author}-${book.year}`;
            return (
              <BookRow
                key={bookKey}
                book={book}
                isFavorite={!!favorites[bookKey]}
                toggleFavorite={() => toggleFavorite(bookKey)}
              />
            );
          })
        ) : (
          <tr>
            <td colSpan={6} style={{ textAlign: 'center' }}>
              No books found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default BooksTable;
