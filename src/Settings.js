const BASE_URL = 'http://localhost:8000/api/v1.0/';

const ENDPOINTS = {
  Books: `${BASE_URL}books/`,
  JWTRegister: `${BASE_URL}register/`,
  JWTLogin: `${BASE_URL}login/`,
  JWTrefreshToken: `${BASE_URL}login/refresh/`
};

const AnbabianDB = 'anbabian.db';

export { AnbabianDB, BASE_URL, ENDPOINTS };
