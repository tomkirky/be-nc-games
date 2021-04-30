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
  return db
    .query(
      `UPDATE reviews SET votes = votes + ${inc_votes} WHERE ${review_id} = review_id RETURNING *;`
    )
    .then((updatedReviewVotes) => {
      return updatedReviewVotes.rows;
    });
};
