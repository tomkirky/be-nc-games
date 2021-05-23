// extract any functions you are using to manipulate your data, into this file

// function to combine comments and review stuff to extract keys and values we need

// func to convert unix timestamp to readble SQL format

exports.unixToSQLDateFormat = (unixTS) => {
  return new Date(unixTS);
};

exports.filterResults = (reviews, comments) => {
  let output = [];
  reviews.forEach((review) => {
    comments.forEach((comment) => {
      if (review.title === comment.belongs_to) {
        output.push({ ...review, ...comment });
      }
    });
  });
  return output;
};
