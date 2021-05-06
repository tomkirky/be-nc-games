const db = require('./connection');

exports.createTables = () => {
  return db
    .query(
      `CREATE TABLE categories (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR NOT NULL
    );`
    )
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        avatar_url VARCHAR(500) NOT NULL,
        name VARCHAR NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          review_body VARCHAR(1000) NOT NULL,
          designer VARCHAR NOT NULL,
          review_img_url VARCHAR(500) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
          votes INT DEFAULT 0,
          category VARCHAR REFERENCES categories(slug) NOT NULL,
          owner VARCHAR REFERENCES users(username) NOT NULL,
          created_at TIMESTAMP DEFAULT now()
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR REFERENCES users(username) NOT NULL,
          review_id INT REFERENCES reviews(review_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT now(),
          body VARCHAR NOT NULL
      );`);
    });
};

exports.dropTables = () => {
  return db
    .query(
      `
    DROP TABLE IF EXISTS comments;
    `
    )
    .then(() => {
      return db.query(`
    DROP TABLE IF EXISTS reviews;
    `);
    })
    .then(() => {
      return db.query(`
    DROP TABLE IF EXISTS users;
    `);
    })
    .then(() => {
      return db.query(`
    DROP TABLE IF EXISTS categories;
    `);
    });
};
