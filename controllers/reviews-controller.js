const {
  getEachReview,
  patchReviews,
  getReviewsWithQuery,
  commentsByReviewId,
  insertCommentToReview,
} = require('../models/reviews-model');

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

exports.getReviews = (req, res, next) => {
  const { query } = req;
  getReviewsWithQuery(query)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  commentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentToReview = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  insertCommentToReview(review_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
