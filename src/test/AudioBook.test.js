/* eslint-disable no-undef */
import { fetchMockData } from '../data/AudioBook';

test('total number of mock books equals 60.', () => {
  expect(fetchMockData().length).toBe(60);
});

test('Book by the title "Ancient and Modern Celebrated Freethinkers" has 24 chapters.', () => {
  expect(
    fetchMockData().filter(book => {
      return book.title.trim() === 'Ancient and Modern Celebrated Freethinkers';
    })[0].chapters.length
  ).toBe(24);
});
