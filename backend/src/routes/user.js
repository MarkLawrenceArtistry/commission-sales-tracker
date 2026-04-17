const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/auth')
const userController = require('../controllers/userController')

router.get('/me', verifyToken, userController.checkSession);

router.post('/register', userController.register)
router.post('/login', userController.login)

router.get('/', verifyToken, userController.getAllUsers)

module.exports = router