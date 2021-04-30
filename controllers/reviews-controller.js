const { getEachReview, patchReviews } = require('../models/reviews-model');

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  getEachReview(review_id)
    .then((reviewById) => {
      res.status(200).send({ reviewById });
    })
    .catch(next);
};

exports.patchReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  patchReviews(review_id, inc_votes)
    .then((updatedVotesReview) => {
      res.status(200).send({ updatedVotesReview });
    })
    .catch(next);
};
