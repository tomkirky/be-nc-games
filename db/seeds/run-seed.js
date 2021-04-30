const {
  categoryData,
  usersData,
  reviewsData,
  commentsData,
} = require('../data/development-data/index-dev');
const { seed } = require('./seed');

const runSeed = async () => {
  return seed(categoryData, usersData, reviewsData, commentsData);
};

runSeed();
