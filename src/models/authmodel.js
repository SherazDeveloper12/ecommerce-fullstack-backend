const mongoose = require('mongoose');
const authSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
},
    { timestamps: true });
authSchema.set('collection', 'users');
const authModel = mongoose.model('Auth', authSchema);
module.exports = authModel;