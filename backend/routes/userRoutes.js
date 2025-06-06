const express = require('express');
const { updateUser, deleteUser, getInfo } = require('../controllers/userController');
const { authMiddleware } = require("../middleware/Auth");
const router = express.Router();

router.get('/info', authMiddleware, getInfo);
router.put('/update' , authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);

module.exports = router;