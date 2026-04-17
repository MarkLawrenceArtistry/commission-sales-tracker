const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/auth')
const salesController = require('../controllers/salesController')

router.get('/:id', verifyToken, salesController.getAllSales);

module.exports = router