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
      console.log(review.rows[0]);
      review.rows[0].comment_count = parseInt(review.rows[0].comment_count);
      return review.rows;
    });
};

exports.patchReviews = (review_id, inc_votes) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + ${inc_votes} WHERE ${review_id} = review_id RETURNING *;`
    )
    .then((updatedReviewVotes) => {
      return updatedReviewVotes.rows;
    });
};
