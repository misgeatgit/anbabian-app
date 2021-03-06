/* eslint-disable no-undef */
import { fetchMockData } from '../data/AudioBook';

test('total number of mock books equals 60', () => {
  expect(fetchMockData().length).toBe(60);
});
