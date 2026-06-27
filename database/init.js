// MongoDB initialization script
// Runs automatically when the mongo container starts for the first time

db = db.getSiblingDB('sufyan_collection');

// Create collections with validation
db.createCollection('users');
db.createCollection('categories');
db.createCollection('products');
db.createCollection('orders');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ name: 'text', description: 'text', tags: 'text' });
db.products.createIndex({ category: 1, isActive: 1 });
db.products.createIndex({ price: 1 });
db.orders.createIndex({ user: 1, createdAt: -1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });

print('✅  sufyan_collection database initialized with indexes');
