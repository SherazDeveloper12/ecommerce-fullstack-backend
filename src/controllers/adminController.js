const orderModel = require('../models/ordermodel');
const productModel = require('../models/productmodel');
const authModel = require('../models/authmodel');

const getAllUsers = async (req, res) => {}
const getUserById = async (req, res) => {}
const updateUserRole = async (req, res) => {}
const deleteUser = async (req, res) => {}
const getpendingOrders = async (req, res) => {};
const updateOrderStatus = async (req, res) => {};
const deleteOrder = async (req, res) => {};
const getpendingRevenue = async (req, res) => {
    try {
        const orders = await orderModel.find();
        const pendingOrders = orders.filter(order => order.status === 'Pending');
        const pendingRevenue = pendingOrders.reduce((total, order) => total + order.payableAmount, 0);
        console.log('Pending Revenue:', pendingRevenue);
        res.status(200).json({status:"Successful", message:'Pending revenue calculated successfully', pendingRevenue });
    } catch (error) {
        res.status(500).json({status:"Error", message: 'Server Error', error: error.message });
    }
};
module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getpendingOrders,
    updateOrderStatus,
    deleteOrder,
    getpendingRevenue
};