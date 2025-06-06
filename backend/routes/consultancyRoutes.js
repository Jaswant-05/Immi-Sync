const express = require("express");
const { deleteConsultancy, getConsultancyUsers, updateConsultancyInfo } = require("../controllers/consultancyController");
const { authMiddleware } = require("../middleware/Auth");
const router = express.Router();

router.get('/users', authMiddleware, getConsultancyUsers);
router.put('/update', authMiddleware, updateConsultancyInfo);
router.delete('/delete', authMiddleware, deleteConsultancy);

module.exports = router;
