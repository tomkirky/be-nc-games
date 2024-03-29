const db = require('../db/connection');

exports.selectCategories = () => {
  return db
    .query(
      `
    SELECT * FROM categories;
    `
    )
    .then((categories) => {
      return categories.rows;
    });
};
