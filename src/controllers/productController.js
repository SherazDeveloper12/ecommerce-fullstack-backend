const mongoose = require('mongoose');
const productModel = require('../models/productmodel');

const createProduct = async (req, res) => {
    try {

        const product = new productModel(req.body);
        const savedProduct = await product.save();
        console.log('New product created:',);
        console.log('Total connected clients:', global.clients.length);
        try {
            global.clients.forEach(client => {
                console.log('Sending update to client');
                client.write(`data: ${JSON.stringify(savedProduct)}\n\n`);
            });
        } catch (error) {

            console.error('Error sending update to clients:', error);

        }
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}
const updateProduct = async (req, res) => {
    try {
        
        const { id } = req.params;
        console.log('Updating product with ID:', id);
        const updatedData = req.body;
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const realtimeProductStream = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');


    global.clients.push(res);
    console.log('Client connected. Total clients:', global.clients.length);

    // 30 seconds
    req.on('close', () => {

        global.clients = global.clients.filter(client => client !== res);
        console.log('❌ Client disconnected! Remaining clients:', global.clients.length);

    });
}
const getProductById = async (req, res) => {
}
module.exports = { deleteProduct, createProduct, getAllProducts, getProductById, realtimeProductStream, updateProduct };