import ENDPOINTS from '../Settings';

const axios = require('axios');

class AudioBook {
  constructor(title, author, frontCover, synopsis, kwargs) {
    this.title = title;
    this.author = author;
    this.frontCover = frontCover;
    this.synopsis = synopsis;
    if (kwargs) {
      this.sample = kwargs.sample;
      this.chapters = kwargs.chapters;
    }
  }
}

function createAudioBooks(data) {
  const books = [];
  Object.values(data).forEach(b => {
    const book = new AudioBook(b.title, b.author, b.front_cover, b.synopsis);
    books.push(book);
  });

  return books;
}
/* Fetch N Audiobooks
 @params {String} url  
*/
function fetchAudioBooks(errorHandler) {
  const url = ENDPOINTS.Books;
  const accesstoken = '';
  const config = {
    method: 'get',
    url,
    headers: {
      Authorization: `Bearer ${accesstoken}`
    }
  };

  axios(config)
    .then(createAudioBooks)
    .catch(errorHandler);
}

function fetchMockData() {
  // eslint-disable-next-line global-require
  // TODO donot bundle mockdata in production.
  const data = __DEV__ ? require('../mockdata/books.json') : [];
  return createAudioBooks(data);
}
function fetchAudioBooksFromStorage(isMockData = false) {
  const books = null;
  return books;
}

// Save
function saveAudioBooks(books) {

}

// Refresh AudioBook list
function refreshAudioBookList(since) {
  // fetchAudioBooks(since)
}

export { fetchMockData };
