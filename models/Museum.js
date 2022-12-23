const mongoose = require("mongoose");
const slugify = require("slugify");

const MuseumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  mid: String,
  slug: String,
  fromDate: {
    type: Date,
    required: [true, "Please add the beginning date"],
  },
  toDate: {
    type: Date,
    required: [true, "Please add the ending date"],
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must can not be more than 5"],
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  ticketSold: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  lat: Number,
  lng: Number,
  coverImage: {
    type: String,
  },
});

// Create museum slug from the name
MuseumSchema.pre("save", async function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Create custom museum id
MuseumSchema.post("save", async function (next) {
  if (this.mid != null) {
    return next();
  }

  this.mid = "m" + this._id;
  this.save();
  next();
});

module.exports = mongoose.model("Museum", MuseumSchema);
