import React from 'react';

function BookRow({ book, index }) {
  const { title, author, year, genre } = book;

  return (
    <tr>
      <td>{index + 1}</td>
      <td className="title-cell">{title}</td>
      <td>{author}</td>
      <td>{year}</td>
      <td>{(genre || []).join(', ')}</td>
    </tr>
  );
}

export default BookRow;
