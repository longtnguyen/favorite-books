import React from 'react';

function BookRow({ book, index, isFavorite, toggleFavorite }) {
  const { title, author, year, genre, id } = book;

  return (
    <tr>
      <td>{index + 1}</td>
      <td className="title-cell">{title}</td>
      <td>{author}</td>
      <td>{year}</td>
      <td>{(genre || []).join(', ')}</td>
      
      <td
        className="favorite-cell"
        onClick={() => toggleFavorite(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleFavorite(id);
          }
        }}
        aria-label={isFavorite ? 'Unmark as currently reading' : 'Mark as currently reading'}
      >
        <span className={`favorite-star ${isFavorite ? 'favorited' : ''}`}>
          {isFavorite ? '★' : '☆'}
        </span>
      </td>
    </tr>
  );
}

export default BookRow;
