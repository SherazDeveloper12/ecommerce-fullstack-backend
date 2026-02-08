const authModel = require('../models/authmodel');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await authModel.find({});
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}
const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const users = await authModel.find();
        const existingUser = users.find(user => user.email === email);
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already in use',
                error: 'Regisertation Failed: Error registering user with this email'
            }
            );
        }
        const newUser = await authModel.create({ username, password, email });
        const token = jwt.sign({ _id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, );
        res.status(200).json({ status: 'success', message: 'User registered successfully', user: { _id: newUser._id, username: newUser.username, email: newUser.email }, token });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error registering user', error: error.message });

    }
}
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await authModel.find();
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'user not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ status: 'error', message: 'Wrong password' });
        }
        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, );
        res.status(200).json({ status: 'success', message: 'Login successful', user: { _id: user._id, username: user.username, email: user.email } , token});
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error logging in', error: error.message });
    }
}
const getUserProfile = async (req, res) => {
    try {
        token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
    
        res.status(200).json({ status: 'success', user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching user profile', error: error.message });
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const userToBeUpdate = await authModel.findById(userId);
        if (!userToBeUpdate) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        const updatingUser = await userToBeUpdate.set(updates);
        const updatedUser = await updatingUser.save();
        console.log("Updated User:", updatedUser);
        res.status(200).json({ status: 'success', message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error updating user profile', error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers
};