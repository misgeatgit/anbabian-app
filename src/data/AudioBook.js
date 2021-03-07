import * as FileSystem from 'expo-file-system';
import db from '../Settings';

const crypto = require('crypto');

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

async function persistChapter(chapter, bookId) {
  const path = await download(chapter.audio_file);
  const insertQuery = `INSERT INTO audiofiles (path, url, name, book_id) values (?. ?, ?, ?)`;
  db.transaction(
    tx => {
      tx.executeSql(insertQuery, [
        path,
        chapter.url,
        chapter.audio_file,
        bookId
      ]);
    },
    error => {
      throw error;
    },
    null
  );
  return path;
}

function generateBookId(book) {
  const hash = crypto.createHash('MD5');
  hash.update(`${book.author}${book.title}`);
  const fkey = hash.digest('hex');
  return fkey;
}
/*
     @param chapter {audio_file:'', chapter:''}
     @returns local url
    */
async function getLocalURL(book, chapter) {
  let url = '';
  const fkey = generateBookId(book);
  const query = `SELECT * FROM audiofiles WHERE book_id=${fkey}`;
  // See resultsetObject here https://docs.expo.io/versions/latest/sdk/sqlite/#transaction--objects
  db.transaction(tx => {
    tx.executeSql(
      query,
      [],
      (_, { rows }) => {
        if (rows.length < 1) {
          let r = '';
          persistChapter(chapter, fkey)
            .then(path => {
              r = path;
            })
            .catch(error => {
              throw error;
            });
          url = r;
        } else {
          url = rows.item(0).path;
        }
      },
      error => {
        throw error;
      }
    );
  });

  return url;
}

export class AudioBook {
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
    const params = { sample, chapters: bookChapters };
    const book = new AudioBook(
      b.title,
      b.author,
      b.front_cover,
      b.synopsis,
      params
    );
    books.push(book);
  });

  return books;
}

function fetchMockData() {
  // eslint-disable-next-line global-require
  // TODO donot bundle mockdata in production.
  const data = __DEV__ ? require('../mockdata/books.json') : [];
  return createAudioBooks(data);
}

export { download, fetchMockData, getLocalURL };
