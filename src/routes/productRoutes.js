const express = require('express');
const productRouter = express.Router();
const { getAllProducts, getProductById, createProduct, realtimeProductStream,deleteProduct,updateProduct} = require('../controllers/productController');

// Route to get all products
productRouter.get('/', getAllProducts);
// Route to get a product by ID
productRouter.get('/products/:id', getProductById);
// Route to create a new product
productRouter.post('/create', createProduct);
productRouter.put('/update/:id', updateProduct);
productRouter.delete('/delete/:id', deleteProduct);
// Route to update a product by ID
productRouter.get('/stream', realtimeProductStream);
module.exports = productRouter;