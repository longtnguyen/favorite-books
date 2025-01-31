import data from './booksData.js';

export default class Books {
  askListBooks(genre = 'All') {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        let allBooks = data.books || [];
        if (genre && genre !== 'All') {
          const lower = genre.toLowerCase();
          allBooks = allBooks.filter((book) =>
            book.genre.some((g) => g.toLowerCase() === lower)
          );
        }
        const truncatedBookList = allBooks.slice(0, 10);
        resolve(truncatedBookList);
      }, this._random());
    });
  }

  _random() {
    return Math.floor(Math.random() * 1200);
  }
}