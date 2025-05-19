const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleArabic: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  subtitleArabic: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('FAQ', faqSchema);