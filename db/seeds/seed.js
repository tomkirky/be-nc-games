const { insertData } = require('../insert-data');
const { dropTables, createTables } = require('../manage-tables');

function seed(categoriesData, usersData, reviewsData, commentsData) {
  return dropTables().then(() => {
    return createTables().then(() => {
      return insertData(categoriesData, usersData, reviewsData, commentsData);
    });
  });
}

module.exports = { seed };
