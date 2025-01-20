// models/SkiResort.js
const mongoose = require('mongoose');

const SkiResortSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  snowfall: Number,
  temperature: Number,
  updatedAt: Date,
});

module.exports = mongoose.model('SkiResort', SkiResortSchema);
