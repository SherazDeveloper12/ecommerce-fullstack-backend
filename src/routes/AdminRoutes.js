const express = require('express');
const adminRouter = express.Router();
const { 
    getpendingRevenue,
    // getAllUsers,
    // getUserById,
    // updateUserRole,
    // deleteUser
 } = require('../controllers/adminController');
adminRouter.get('/revenue/pending', getpendingRevenue);
// adminRouter.get('/users', getAllUsers);
// adminRouter.get('/users/:id', getUserById);
// adminRouter.put('/users/:id/role', updateUserRole);
// adminRouter.delete('/users/:id', deleteUser);
module.exports = adminRouter;