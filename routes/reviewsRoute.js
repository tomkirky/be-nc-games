const reviewsRouter = require('express').Router();
const {
  getReviewsById,
  patchReviewsById,
  getReviews,
  getCommentsByReviewId,
  postCommentToReview,
} = require('../controllers/reviews-controller.js');

reviewsRouter.route('/:review_id').get(getReviewsById).patch(patchReviewsById);
reviewsRouter.route('/').get(getReviews);
reviewsRouter
  .route('/:review_id/comments')
  .get(getCommentsByReviewId)
  .post(postCommentToReview);

module.exports = reviewsRouter;
