const mongoose = require('mongoose');
const productModel = require('../models/productmodel');

const createProduct = async (req, res) => {
    try {
        console.log(req.body);
        const product = new productModel(req.body);
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error});
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json(products);
        console.log(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProductById = async (req, res) => {
}
module.exports = { createProduct, getAllProducts, getProductById };