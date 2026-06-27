const Order   = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: 'No items.' });

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const p = await Product.findById(item.product);
      if (!p) return res.status(404).json({ success: false, message: `Product ${item.product} not found.` });
      const price = p.onSale && p.salePrice ? p.salePrice : p.price;
      subtotal += price * item.quantity;
      orderItems.push({ product: p._id, name: p.name,
        image: p.images[0]?.url || '', price, quantity: item.quantity,
        size: item.size, color: item.color });
    }

    const shippingCost = subtotal >= 5000 ? 0 : 150;
    const order = await Order.create({
      user: req.user._id, items: orderItems, shippingAddress,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      subtotal, shippingCost, total: subtotal + shippingCost, notes,
    });
    res.status(201).json({ success: true, message: 'Order placed!', order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user','name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page=1, limit=20, status } = req.query;
    const q = status ? { orderStatus: status } : {};
    const skip = (page-1)*limit;
    const [orders, total] = await Promise.all([
      Order.find(q).sort({ createdAt: -1 }).skip(skip).limit(+limit).populate('user','name email'),
      Order.countDocuments(q),
    ]);
    res.json({ success: true, orders, pagination: { total, page:+page, pages: Math.ceil(total/+limit) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const update = { orderStatus };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (orderStatus === 'delivered') update.deliveredAt = Date.now();
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
