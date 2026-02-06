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
        const notification = {
            recipientid: "69843421d30a0ace506d9172",
            message: `New Order Placed by ${orderdetails.shippingAddress.fullName}`,
            type: 'Order Update'
        }
        const notificationCreated = new notificationModel(notification);
        await notificationCreated.save();
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
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
}
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};
