const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Reviews = require("../models/review.js");
const {isLoggedIn, isOwner, validateReview, isReviewAuthor} = require("../middleware.js")
const reviewsrouter = express.Router();
const index = require("../controllers/reviews.js");


// Reviews
reviewsrouter.post(
  "/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(index.createreview)
);

// Default Route

reviewsrouter.delete(
  "/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(index.deletereview)
);

module.exports = reviewsrouter;
