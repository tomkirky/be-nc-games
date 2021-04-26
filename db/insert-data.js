const format = require("pg-format");
const db = require("../db/connection.js");
const {
  unixToSQLDateFormat,
  filterResults,
} = require("./utils/data-manipulation.js");

const insertCategoriesData = (categoriesData) => {
  const categoriesDataArray = categoriesData.map((category) => {
    return [category.slug, category.description];
  });

  const categoriesInsertQuery = format(
    `
    INSERT INTO categories
        (slug, description)
        VALUES
        %L
        RETURNING *;
    `,
    categoriesDataArray,
  );

  return db.query(categoriesInsertQuery);
};

const insertUsersData = (usersData) => {
  const usersDataArray = usersData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });
  const usersInsertQuery = format(
    `
    INSERT INTO users
        (username, name, avatar_url)
        VALUES
        %L
        RETURNING *;
    `,
    usersDataArray,
  );
  return db.query(usersInsertQuery);
};

const insertReviewsAndCommentsData = (reviewsData, commentsData) => {
  const reviewsDataArray = reviewsData.map((review) => {
    return [
      review.title,
      review.review_body,
      review.designer,
      review.review_img_url,
      review.votes,
      review.category,
      review.owner,
      unixToSQLDateFormat(review.created_at),
    ];
  });

  const reviewsInsertQuery = format(
    `
    INSERT INTO reviews
            (title, review_body,designer,review_img_url, votes, category, owner, created_at)
            VALUES
            %L
            RETURNING *;
    `,
    reviewsDataArray,
  );
  return db.query(reviewsInsertQuery).then((reviews) => {
    const combinedResults = filterResults(reviews.rows, commentsData);
    const commentDataArray = combinedResults.map((comment) => {
      return [
        comment.created_by,
        comment.review_id,
        comment.votes,
        comment.body,
        unixToSQLDateFormat(comment.created_at),
      ];
    });
    const commentsInsertQuery = format(
      `
      INSERT INTO comments
          (author, review_id, votes, body, created_at)
          VALUES
          %L
          RETURNING *;
      `,
      commentDataArray,
    );
    return db.query(commentsInsertQuery);
  });
};

exports.insertData = (categoriesData, usersData, reviewsData, commentsData) => {
  insertCategoriesData(categoriesData).then(() => {
    insertUsersData(usersData).then(() => {
      insertReviewsAndCommentsData(reviewsData, commentsData);
    });
  });
};
