\c nc_games_test

-- SELECT * FROM comments WHERE review_id = 2;

SELECT reviews.*, COUNT(comments.review_id) AS comment_count 
FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id 
WHERE reviews.review_id = 7 GROUP BY reviews.review_id;