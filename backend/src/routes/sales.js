const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/auth')
const salesController = require('../controllers/salesController')

router.get('/:id', verifyToken, salesController.getAllSales);
router.delete('/:id', verifyToken, salesController.deleteSale);
router.post('/', verifyToken, salesController.createSale);

module.exports = router