const joi = require("joi");
const review = require("./models/review");

const listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      image: joi.string().allow("", null),
      price: joi.number().required().min(0),
      location: joi.string().required(),
      country: joi.string().required(),
    })
    .required(),
});

const reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required(),
      comment: joi.string().required(),
    })
    .required(),
});

module.exports = { listingSchema, reviewSchema };
