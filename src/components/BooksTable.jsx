import React from 'react';
import BookRow from './BookRow';

function BooksTable({ books }) {
  return (
    <table className="books-table">
      <thead>
        <tr>
          <th className="rank-col">Rank</th>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>Genres</th>
        </tr>
      </thead>
      <tbody>
        {books && books.length > 0 ? (
          books.map((book, index) => (
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
