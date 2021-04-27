const request = require("supertest");
const db = require("../db/connection");
const { seed } = require("../db/seeds/seed");
const {
  categoryData,
  commentsData,
  reviewsData,
  usersData,
} = require("../db/data/test-data/index-test");
const app = require("../app");
const { string } = require("pg-format");

beforeEach(() => {
  return seed(categoryData, usersData, reviewsData, commentsData);
});

afterAll(() => {
  return db.end();
});

describe("GET/api/categories", () => {
  test("status: 200 responds with array of categories objects", () => {
    return request(app)
      .get("/api/categories")
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
            }),
          );
        });
      });
  });
});
