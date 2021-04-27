const categoriesRouter = require('express').Router();
const getCategories = require('../controllers/categories-controller.js');

categoriesRouter.route('/').get(getCategories);

module.exports = categoriesRouter;
