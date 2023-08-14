const mongoose = require("mongoose");

const schema = {
  shortUrlCode: {
    type: Number,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
    unique: true,
  },
};

// Schema
const shortUrlSchema = new mongoose.Schema(schema, {
  collection: "URLShortner",
  timestamps: true,
});

// Model
let URLShortner = mongoose.model("URLShortner", shortUrlSchema);

module.exports = { URLShortner };
