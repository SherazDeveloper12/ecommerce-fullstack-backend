const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number,  },
   
    img: { type: Array, required: true },
    freeShipping: { type: Boolean, required: true },
    orders: { type: Number,  },
    condition: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },

});
const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;