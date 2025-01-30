import React, { useState, useMemo } from 'react';
import BookRow from './BookRow';

function BooksTable({ books }) {
  // Tracks which column is sorted and its direction.
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
    if (!sortConfig.key) return books; // No sorting set, return original
    const sorted = [...books].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [books, sortConfig]);

  return (
    <table className="books-table">
      <thead>
        <tr>
          <th className="rank-col">Rank</th>

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
        </tr>
      </thead>

      <tbody>
        {sortedBooks && sortedBooks.length > 0 ? (
          sortedBooks.map((book, index) => (
            <BookRow key={`${book.title}-${index}`} book={book} index={index} />
          ))
        ) : (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center' }}>
              No books found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default BooksTable;
