const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
}

module.exports.newroutes =  (req, res) => {
  if(!req.isAuthenticated()){
    req.flash("error", "You must be Logged In to Create Listing!");
    return res.redirect("/login");
  }
  res.render("listings/new.ejs");
}

module.exports.showroutes = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {
      path: "author",
    },
    }).populate("Owner");
    if(!listing){
      req.flash("error", "Listing you requested for dose not exist!");
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  }
module.exports.createlist = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.Owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }
module.exports.editlist = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }
module.exports.updatelist = async (req, res) => {

    await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      {
        new: true,
      }
    );
    req.flash("success", "Updated your listing!");
    res.redirect(`/listings/${listing._id}`);
  }
module.exports.deletelist = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }
