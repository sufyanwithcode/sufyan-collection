const express = require('express');
const r = express.Router();
const c = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

r.get ('/',       c.getCategories);
r.get ('/:id',    c.getCategory);
r.post('/',       protect, adminOnly, c.createCategory);
r.put ('/:id',    protect, adminOnly, c.updateCategory);
r.delete('/:id',  protect, adminOnly, c.deleteCategory);

module.exports = r;
