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
        const review = body.reviewById;
        expect(review).toEqual(expectedResponse);
      });
  });
  test('status: 404 responds with custom error when review is not found', () => {
    return request(app)
      .get('/api/reviews/2000')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Sorry, this review does not exist');
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
        const updatedVotesReview = body.updatedVotesReview;
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
        const updatedVotesReview = body.updatedVotesReview;
        expect(updatedVotesReview.votes).toBe(-2);
        expect(updatedVotesReview.category).toBe('euro game');
      });
  });
});

describe('GET/api/reviews', () => {
  test('status: 200 responds with array of review objects sorted by created_at in desc order', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toBeSortedBy(reviews.created_at);
        expect(reviews.length).toBeGreaterThan(0);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test('status: 200, responds with array of review objects sorted by review_id (using query) in desc order', () => {
    return request(app)
      .get('/api/reviews?sort_by=review_id')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toBeSortedBy(reviews.review_id);
        expect(reviews.length).toBeGreaterThan(0);
        expect(reviews[0]).toEqual({
          review_id: 13,
          title: "Settlers of Catan: Don't Settle For Less",
          review_body:
            'You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.',
          designer: 'Klaus Teuber',
          review_img_url:
            'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes: 16,
          category: 'social deduction',
          owner: 'mallionaire',
          created_at: '1970-01-10T02:08:38.400Z',
          comment_count: '0',
        });
      });
  });
  test('status: 200, responds with array of review objects sorted by created_at in asc order (using query)', () => {
    return request(app)
      .get('/api/reviews?order_by=asc')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toBeSortedBy(reviews.created_at, { ascending: true });
        expect(reviews[0]).toEqual(
          expect.objectContaining({
            created_at: '1970-01-10T02:08:38.400Z',
          })
        );
      });
  });
  test('status: 200, responds with array of review objects sorted by votes (using query) in asc order (using query)', () => {
    return request(app)
      .get('/api/reviews?sort_by=votes&order_by=asc')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toBeSortedBy(reviews.created_at, { ascending: true });
        expect(reviews[0]).toEqual(
          expect.objectContaining({
            votes: 1,
          })
        );
      });
  });
  test("status: 200, responds with an empty array when passed a valid category which doesn't have reviews", () => {
    return request(app)
      .get('/api/reviews?category=children%27s%20games')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(0);
      });
  });
  test('status: 200, responds with an array of review objects which are filtered by category', () => {
    return request(app)
      .get('/api/reviews?category=euro%20game')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBeGreaterThan(0);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              category: 'euro game',
            })
          );
        });
      });
  });
  test('status: 400, responds with invalid sort query when passed invalid sort_by query', () => {
    return request(app)
      .get('/api/reviews?sort_by=yoda')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort query');
      });
  });
  test('status: 400, responds with invalid order query when passed invalid order_by query', () => {
    return request(app)
      .get('/api/reviews?order_by=vader')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid order query');
      });
  });
  test('status: 404, responds with page not found when passed non-existent category', () => {
    return request(app)
      .get('/api/reviews?category=parks')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Page not found');
      });
  });
});
