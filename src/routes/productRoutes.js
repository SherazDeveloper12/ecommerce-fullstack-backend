const express = require('express');
const productRouter = express.Router();
const { getAllProducts, getProductById, createProduct, } = require('../controllers/productController');

// Route to get all products
productRouter.get('/', getAllProducts);
// Route to get a product by ID
productRouter.get('/products/:id', getProductById);
// Route to create a new product
productRouter.post('/create', createProduct);
// Route to update a product by ID

module.exports = productRouter;