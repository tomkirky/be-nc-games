const reviewsRouter = require('express').Router();
const {
  getReviewsById,
  patchReviewsById,
  getReviews,
} = require('../controllers/reviews-controller.js');

reviewsRouter.route('/:review_id').get(getReviewsById).patch(patchReviewsById);
reviewsRouter.route('/').get(getReviews);

module.exports = reviewsRouter;
