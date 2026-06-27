const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, unique: true, lowercase: true },
  description:      { type: String, required: true },
  shortDescription: String,
  price:            { type: Number, required: true, min: 0 },
  salePrice:        { type: Number, min: 0 },
  onSale:           { type: Boolean, default: false },
  category:         { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory:      String,
  fabric:           String,
  care:             [String],
  images: [{
    url:       String,
    alt:       String,
    isPrimary: { type: Boolean, default: false },
  }],
  colors: [{ name: String, hex: String, stock: { type: Number, default: 0 } }],
  sizes:  [{ label: String, stock: { type: Number, default: 0 } }],
  stock:        { type: Number, default: 0 },
  sku:          { type: String, sparse: true },
  tags:         [String],
  reviews:      [reviewSchema],
  rating:       { type: Number, default: 0 },
  numReviews:   { type: Number, default: 0 },
  isFeatured:   { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug)
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (this.reviews.length) {
    this.rating     = this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
