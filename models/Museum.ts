const mongoose = require("mongoose");
const slugify = require("slugify");

const MuseumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create museum slug from the name
MuseumSchema.pre("save", async function (next) {
  if (!this.isModified("title")) {
    next();
  }
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Create custom museum id
MuseumSchema.post("save", async function () {
  if (this.mid) return;

  this.mid = "m" + this._id;
  this.save();
});

module.exports = mongoose.model("Museum", MuseumSchema);
