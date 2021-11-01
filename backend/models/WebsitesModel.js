const mongoose = require('./mongodb');

const websiteScheme = new mongoose.Schema(
  {
    html: {
      type: String,
      required: [true, 'HTML is required!'],
    },
    previewElements: {
      type: String,
      required: [true, 'preview elements is required!'],
    },
    email: {
      type: String,
      required: [true, 'Website must be associated to an E-mail!'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      min: 100,
      required: [true, 'Website must have height!'],
      default: 100,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
websiteScheme.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Websites = mongoose.model('Websites', websiteScheme);
module.exports = Websites;
