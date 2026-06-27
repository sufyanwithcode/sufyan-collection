const express = require('express');
const r = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

/* Admin: list all users */
r.get('/', protect, adminOnly, async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users, total: users.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* Toggle wishlist */
r.put('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid  = req.params.productId;
    const idx  = user.wishlist.indexOf(pid);
    idx > -1 ? user.wishlist.splice(idx, 1) : user.wishlist.push(pid);
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* Admin: deactivate user */
r.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = r;
