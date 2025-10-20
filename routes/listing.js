const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const index = require("../controllers/listings.js");
// Index Route
router.get("/", wrapAsync(index.index));

// New Route
router.get("/new", isLoggedIn, index.newroutes);

router.route("/:id")
.get(
  wrapAsync(index.showroutes)
)
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(index.updatelist)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(index.deletelist)
);

// Show Route
// router.get(
//   "/:id",
//   wrapAsync(index.showroutes)
// );

// Create Route
router.post(
  "/newone",
  validateListing,
  wrapAsync(index.createlist)
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(index.editlist)
);

// Update Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(index.updatelist)
// );

// Delete Route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(index.deletelist)
// );

module.exports = router;
