const apiRouter = require('express').Router();
const categoriesRouter = require('./categoriesRoute');
const reviewsRouter = require('./reviewsRoute');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;
