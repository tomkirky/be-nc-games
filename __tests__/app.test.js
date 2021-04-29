const request = require('supertest');
const db = require('../db/connection');
const { seed } = require('../db/seeds/seed');
const {
  categoryData,
  commentsData,
  reviewsData,
  usersData,
} = require('../db/data/test-data/index-test');
const app = require('../app');
const { string } = require('pg-format');

beforeEach(() => {
  return seed(categoryData, usersData, reviewsData, commentsData);
});

afterAll(() => {
  return db.end();
});

describe('GET/api/categories', () => {
  test('status: 200 responds with array of categories objects', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories.length).toBeGreaterThan(0);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe('GET /api/reviews/:review_id', () => {
  test('status: 200 responds with array of review objects', () => {
    const expectedResponse = {
      review_id: 2,
      title: 'Jenga',
      review_body: 'Fiddly fun for all the family',
      designer: 'Leslie Scott',
      review_img_url:
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
      votes: 5,
      category: 'dexterity',
      owner: 'philippaclaire9',
      created_at: '2021-01-18T10:01:41.251Z',
      comment_count: 3,
    };
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        const review = body.review;
        expect(review).toEqual(expectedResponse);
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  test('status: 200 responds with array of review objects with the review votes amended based on the patch request (positive integer)', () => {
    const testData = { inc_votes: 3 };
    return request(app)
      .patch('/api/reviews/1')
      .send(testData)
      .expect(200)
      .then(({ body }) => {
        const updatedVotesReview = body.updatedVotesReview[0];
        expect(updatedVotesReview.votes).toBe(4);
        expect(updatedVotesReview.title).toBe('Agricola');
      });
  });
  test('status: 200 responds with array of review objects with the review votes amended based on the patch request (negative integer)', () => {
    const testData = { inc_votes: -3 };
    return request(app)
      .patch('/api/reviews/1')
      .send(testData)
      .expect(200)
      .then(({ body }) => {
        const updatedVotesReview = body.updatedVotesReview[0];
        expect(updatedVotesReview.votes).toBe(-2);
        expect(updatedVotesReview.category).toBe('euro game');
      });
  });
});
