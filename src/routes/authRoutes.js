const express = require('express');
const authRouter = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile , getAllUsers} = require('../controllers/authController');
// Route to register a new user
authRouter.post('/register', registerUser);
// Route to login a user
authRouter.post('/login', loginUser);
// Route to get user profile
authRouter.get('/profile', getUserProfile);
// Route to update user profile
authRouter.put('/update/:id', updateUserProfile);
authRouter.get('/users', getAllUsers); 
module.exports = authRouter;