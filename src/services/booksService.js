import data from './booksData.js';

export default class Books {
  askListBooks(genre = 'All') {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        let allBooks = data.books || [];

        // Filter if genre != 'All'
        if (genre && genre !== 'All') {
          const lower = genre.toLowerCase();
          allBooks = allBooks.filter((book) =>
            book.genre.some((g) => g.toLowerCase() === lower)
          );
        }

        resolve(allBooks);
      }, this._random());
    });
  }

  _random() {
    return Math.floor(Math.random() * 1200);
  }
}