const { insertData } = require('../insert-data');
const { dropTables, createTables } = require('../manage-tables');
const {
  categoryData,
  usersData,
  reviewsData,
  commentsData,
} = require('../data/development-data/index-dev');

function seed(categoriesData, usersData, reviewsData, commentsData) {
  // add seeding functionality here
  // this function should take as argument(s) all the data it needs to seed
  // it should insert this data into the relevant tables in your database
  console.log('Dropping');
  return dropTables().then(() => {
    console.log('Creating');
    return createTables().then(() => {
      console.log('Inserting');
      return insertData(categoriesData, usersData, reviewsData, commentsData);
    });
  });
}
seed(categoryData, usersData, reviewsData, commentsData);
module.exports = { seed };
