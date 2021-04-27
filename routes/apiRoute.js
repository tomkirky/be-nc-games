const apiRouter = require('express').Router();
const categoriesRouter = require('./categoriesRoute');

apiRouter.use('/categories', categoriesRouter);

module.exports = apiRouter;
