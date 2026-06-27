const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size:     String,
  color:    String,
});

const orderSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items:       [itemSchema],
  shippingAddress: {
    fullName:   { type: String, required: true },
    phone:      { type: String, required: true },
    street:     { type: String, required: true },
    city:       { type: String, required: true },
    province:   { type: String, required: true },
    postalCode: String,
    country:    { type: String, default: 'Pakistan' },
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bank_transfer', 'easypaisa', 'jazzcash'],
    default: 'cash_on_delivery',
  },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  orderStatus:   {
    type: String,
    enum: ['pending','confirmed','processing','shipped','delivered','cancelled','returned'],
    default: 'pending',
  },
  subtotal:       { type: Number, required: true },
  shippingCost:   { type: Number, default: 150 },
  discount:       { type: Number, default: 0 },
  total:          { type: Number, required: true },
  notes:          String,
  trackingNumber: String,
  deliveredAt:    Date,
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber)
    this.orderNumber = 'SC' + Date.now().toString().slice(-8) +
      Math.random().toString(36).substr(2, 4).toUpperCase();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
