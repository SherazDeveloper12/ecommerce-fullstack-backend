const notificationModel = require('../models/notifcationmodel');
const orderModel = require('../models/ordermodel');
const productModel = require('../models/productmodel');

const createOrder = async (req, res) => {
    try {
        const orderdetails = req.body;
        const products = await productModel.find()
        const totalProductsCost = orderdetails.items.reduce((total, item) => (total + (products.find(product => product._id.toString() === item.product._id).price ) * item.quantity), 0);
        const deliveryCharges = 200; 
        const order = {
            username: orderdetails.username,
            userId: orderdetails.userid,
            items: orderdetails.items,
            shippingAddress: orderdetails.shippingAddress,
            billingAddress: orderdetails.billingAddress,
            phoneNumber: orderdetails.phoneNumber,
            email: orderdetails.email,
            paymentMethod: orderdetails.paymentMethod,
            status: orderdetails.status,
            deliveryCharges: deliveryCharges,
            payableAmount: totalProductsCost + deliveryCharges,
            orderDate: orderdetails.orderDate
        }
        
        const orderCreated = new orderModel(order);
        const savedOrder = await orderCreated.save();
        const adminNotification = {
            recipientid: "69843421d30a0ace506d9172",
            message: `New Order Placed by ${orderdetails.shippingAddress.fullName}`,
            type: 'Order Creation',
            data: {
                orderId: savedOrder._id,
            }
        }
        const adminNotificationCreated = new notificationModel(adminNotification);
        await adminNotificationCreated.save();
        global.io.to(global.userSockets.get('69843421d30a0ace506d9172')).emit('newOrderCreated', { notification: adminNotificationCreated, order: savedOrder });
        const notification = {
            recipientid: orderdetails.userid,
            message: `Your order has been placed successfully. Order ID: ${savedOrder._id}`,
            type: 'Order Creation',
            data: {
                orderId: savedOrder._id,
            }
        }
        const notificationCreated = new notificationModel(notification);
        await notificationCreated.save();
        global.io.to(global.userSockets.get(orderdetails.userid)).emit('newOrderCreated', { notification: notificationCreated, order: savedOrder });
        res.status(200).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            status: "Failed",
            message: "Order creation failed",
          error: error.message,
         });
    }
}
 
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
}
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = status;
        const updatedOrder = await order.save();
        const usersocketid = global.userSockets.get(order.userId);
        global.io.to(usersocketid).emit('orderStatusUpdated', { updatedOrder });
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
}

const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await orderModel.find({ userId: userId });
      
        res.status(200).json({ status: "Success", orders, message: "Orders fetched successfully" });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Failed to fetch orders", error: error.message });
    }
}
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByUserId
};
