const express = require("express");
const { deleteConsultancy, getConsultancyUsers, updateConsultancyInfo, getConsultanacyInfo, getApplications, getAllConsultanciesController } = require("../controllers/consultancyController");
const { authMiddleware } = require("../middleware/Auth");
const router = express.Router();

router.get('/', authMiddleware, getAllConsultanciesController);
router.get('/info', authMiddleware, getConsultanacyInfo)
router.get('/users', authMiddleware, getConsultancyUsers);
router.get('/applications', authMiddleware, getApplications)
router.put('/update', authMiddleware, updateConsultancyInfo);
router.delete('/delete', authMiddleware, deleteConsultancy);

module.exports = router;
