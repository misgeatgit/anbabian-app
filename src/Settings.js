import * as SQLite from 'expo-sqlite';

const BASE_URL = 'http://localhost:8000/api/v1.0/';

const ENDPOINTS = {
  Books: `${BASE_URL}books/`,
  JWTRegister: `${BASE_URL}register/`,
  JWTLogin: `${BASE_URL}login/`,
  JWTrefreshToken: `${BASE_URL}login/refresh/`
};

const AnbabianDB = 'anbabian.db';

const createBookDBSQLString = `
PRAGMA encoding = "UTF-8";

CREATE TABLE IF NOT EXISTS
    book (id       INTEGER PRIMARY KEY, --A hash of author and title
          author   TEXT not NULL,
          title    TEXT NOT NULL,
          synopsis TEXT);

CREATE TABLE IF NOT EXISTS
    audiofiles (id          INTEGER PRIMARY KEY,
                path        TEXT NOT NULL,
                url         TEXT NOT NULL,
                name        TEXT NOT NULL,
                paused_at   INTEGER,
                book_id     TEXT not NULL,
                FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE);
`;

const db = SQLite.openDatabase(AnbabianDB);

function setUpDB() {
  db.transaction(tx => {
    tx.executeSql(createBookDBSQLString, [], null, error => {
      throw error;
    });
  });
}

export { BASE_URL, db, ENDPOINTS, setUpDB };
