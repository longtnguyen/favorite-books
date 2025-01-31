import React from "react";
import "./BookRow.scss";
import { capitalizeEachWord } from "../../utils/helpers";
function BookRow({ book, isFavorite, toggleFavorite }) {
  const { title, author, year, genre, id } = book;
  return (
    <tr
      onClick={() => toggleFavorite(id)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleFavorite(id);
        }
      }}
    >
      <td className="title-cell">{title}</td>
      <td>{author}</td>
      <td>{year}</td>
      {/*Capitalize each genre, join with comman separated */}
      <td>{(genre || []).map(capitalizeEachWord).join(", ")}</td>

      <td
        className="favorite-cell"
        role="button"
        aria-label={
          isFavorite
            ? "Unmark as currently reading"
            : "Mark as currently reading"
        }
      >
        <span className={`favorite-star ${isFavorite ? "favorited" : ""}`}>
          {isFavorite ? "★" : "☆"}
        </span>
      </td>
    </tr>
  );
}

export default BookRow;
