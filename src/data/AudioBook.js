import ENDPOINTS from '../Settings';
import * as FileSystem from 'expo-file-system';

const axios = require('axios');

class AudioBook {
async function download(url) {
  return new Promise((resolve, reject) => {
    FileSystem.downloadAsync(
      url,
      // TODO make sure there is no name collision.
      FileSystem.documentDirectory + url.split('/').pop()
    )
      .then(({ uri }) => {
        resolve(uri);
      })
      .catch(error => {
        reject(error);
      });
  });
}

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
    const bookChapters = [];
    const sample = b.sample ? b.sample : null;
    Object.values(b.book_chapter).forEach(bc => {
      bookChapters.push({
        audio_file: bc.audio_file,
        chapter: bc.chapter
      });
    });
    const params = {sample: sample, chapters: bookChapters};
    const book = new AudioBook(b.title, b.author, b.front_cover, b.synopsis, params);
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
function fetchAudioBooksFromStorage() {
  const books = null;
  return books;
}

// Save
function saveAudioBooks(books) {}

// Refresh AudioBook list
function refreshAudioBookList(since) {
  // fetchAudioBooks(since)
}

export { fetchMockData };
