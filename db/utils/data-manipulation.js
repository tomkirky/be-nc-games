// extract any functions you are using to manipulate your data, into this file

// function to combine comments and review stuff to extract keys and values we need

// func to convert unix timestamp to readble SQL format

exports.unixToSQLDateFormat = (unixTS) => {
  // const dateObject = new Date(unixTS);
  // const humanDateFormat = dateObject
  //   .toISOString()
  //   .slice(0, 19)
  //   .replace("T", " ");
  // return humanDateFormat;
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
