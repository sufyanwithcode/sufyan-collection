const express = require('express');
const r = express.Router();
const c = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

r.post('/',            protect, c.createOrder);
r.get ('/my-orders',   protect, c.getMyOrders);
r.get ('/all',         protect, adminOnly, c.getAllOrders);
r.get ('/:id',         protect, c.getOrder);
r.put ('/:id/status',  protect, adminOnly, c.updateOrderStatus);

module.exports = r;
