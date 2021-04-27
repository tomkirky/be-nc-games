const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const {
  categoryData,
  commentsData,
  reviewsData,
  usersData,
} = require('../db/data/test-data/index-test');
const app = require('../app');

beforeEach(() => {
  return seed(categoryData, usersData, reviewsData, commentsData);
});

afterAll(() => {
  return db.end();
});

test("Hi I'm a test", () => {
  console.log('yeyeyeye');
});

test("Hi I'm test2", () => {
  console.log('yeyeyeye');
});
