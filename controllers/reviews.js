const Reviews = require("../models/review.js")
const Listing = require("../models/listing.js")

module.exports.createreview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    // console.log(data);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.deletereview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }
