const db = require('../db/connection');

exports.getEachReview = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then((review) => {
      const reviewObj = review.rows[0];
      if (!reviewObj) {
        return Promise.reject({
          status: 404,
          msg: 'Sorry, this review does not exist',
        });
      }
      reviewObj.comment_count = parseInt(reviewObj.comment_count);
      return reviewObj;
    });
};

exports.patchReviews = (review_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request, action could not be complete',
    });
  }
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE $2 = review_id RETURNING *;`,
      [inc_votes, review_id]
    )
    .then((updatedReviewVotes) => {
      const updatedReviewObj = updatedReviewVotes.rows[0];
      if (!updatedReviewObj) {
        return Promise.reject({
          status: 404,
          msg: 'Sorry, this review does not exist',
        });
      }
      return updatedReviewObj;
    });
};

exports.getReviewsWithQuery = async (queries) => {
  const sortBy = queries.sort_by || 'created_at';
  const orderBy = queries.order_by || 'desc';
  const category = queries.category;
  const allowedSortByColumns = [
    'owner',
    'title',
    'review_id',
    'category',
    'review_img_url',
    'created_at',
    'votes',
    'comment_count',
  ];
  if (!allowedSortByColumns.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort query' });
  }
  if (!['asc', 'desc'].includes(orderBy)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }
  const categoryValue = [];
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;
  if (category) {
    categoryValue.push(category);
    queryStr += `WHERE reviews.category = $1`;
  }
  queryStr += `GROUP BY reviews.review_id
  ORDER BY ${sortBy} ${orderBy};`;
  const { rows } = await db.query(queryStr, categoryValue);
  if (rows.length === 0) {
    const result = await db.query(`SELECT * FROM categories WHERE slug = $1;`, [
      category,
    ]);
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: 'Page not found' });
    }
  }
  return rows;
};

// return db
//   .query(
//     `UPDATE reviews SET votes = votes + ${inc_votes} WHERE ${review_id} = review_id RETURNING *;`
//   )
//   .then((updatedReviewVotes) => {
//     return updatedReviewVotes.rows;
//   });
