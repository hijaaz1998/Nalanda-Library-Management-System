const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   author: {
      type: String,
      required: true
   },
   ISBN: {
      type: String,
      required: true,
      unique: true
   },
   publicationDate: {
      type: Date,
      required: true
   },
   genre: {
      type: String,
      required: true
   },
   NumberOfCopies: {
      type: Number,
      required: true
   },
   availableCopies: {
      type: Number,
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
});

module.exports = mongoose.model('Book',BookSchema);