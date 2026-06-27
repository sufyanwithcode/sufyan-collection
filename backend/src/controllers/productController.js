const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort,
            featured, newArrival, onSale, page = 1, limit = 12 } = req.query;

    const q = { isActive: true };
    if (category)   q.category    = category;
    if (search)     q.$text        = { $search: search };
    if (featured === 'true')   q.isFeatured   = true;
    if (newArrival === 'true') q.isNewArrival = true;
    if (onSale === 'true')     q.onSale       = true;
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = Number(minPrice);
      if (maxPrice) q.price.$lte = Number(maxPrice);
    }

    const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 },
                      rating: { rating: -1 }, popular: { numReviews: -1 } };
    const sortOpt = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(q).populate('category', 'name slug').sort(sortOpt).skip(skip).limit(Number(limit)),
      Product.countDocuments(q),
    ]);
    res.json({ success: true, products,
      pagination: { total, page: +page, pages: Math.ceil(total / +limit), limit: +limit } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getFeatured = async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug').limit(8);
    res.json({ success: true, products });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true,
    }).populate('category', 'name slug').populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created.', product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product removed.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (product.reviews.find(r => r.user.toString() === req.user._id.toString()))
      return res.status(400).json({ success: false, message: 'Already reviewed.' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: +rating, comment });
    product.numReviews = product.reviews.length;
    product.rating     = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ success: true, message: 'Review added.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
