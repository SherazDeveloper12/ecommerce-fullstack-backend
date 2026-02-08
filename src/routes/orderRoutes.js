const express = require('express');
const orderRouter = express.Router();
const { createOrder,
     getOrderById,
       getOrdersByUserId, 
      updateOrderStatus, 
getAllOrders    } = require('../controllers/orderController');

// Route to create a new order
orderRouter.post('/create', createOrder);
// Route to get an order by ID
// orderRouter.get('/:id', getOrderById);
// Route to get orders by user ID
orderRouter.get('/user/:userId', getOrdersByUserId);
// Route to update order status
orderRouter.put('/update-status/:id', updateOrderStatus);
// Route to get all orders (admin only)
orderRouter.get('/', getAllOrders);
module.exports = orderRouter;