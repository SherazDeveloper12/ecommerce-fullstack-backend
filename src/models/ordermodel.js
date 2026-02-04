const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    
    userId: { type: String, ref: 'Auth', required: true },
    items: { type: Array, required: true },
    shippingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        stateProvince: { type: String, required: true },
        postalZipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    billingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        stateProvince: { type: String, required: true },
        postalZipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    paymentMethod: { type: String, enum: ['COD', 'Pay Now', 'PayPal'], default: 'COD' },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    deliveryCharges: { type: Number, required: true },
    payableAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
},
    { timestamps: true });
orderSchema.set('collection', 'orders');

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;