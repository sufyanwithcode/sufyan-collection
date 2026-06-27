const express = require('express');
const r = express.Router();
const c = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

r.get ('/',           c.getProducts);
r.get ('/featured',   c.getFeatured);
r.get ('/:id',        c.getProduct);
r.post('/',           protect, adminOnly, c.createProduct);
r.put ('/:id',        protect, adminOnly, c.updateProduct);
r.delete('/:id',      protect, adminOnly, c.deleteProduct);
r.post('/:id/reviews',protect, c.addReview);

module.exports = r;
