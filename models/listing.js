const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    type: String,
    set: (v) => (v === "" ? "https://via.placeholder.com/150" : v),
    required: true,
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
  Owner: {type: Schema.Types.ObjectId, ref:"User"},
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("Reviews").deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;
