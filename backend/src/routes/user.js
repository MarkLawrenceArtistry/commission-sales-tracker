const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.post('/register', userController.registerUser)
// router.post('/login', authController.login)

// router.get('/', authController.getAllUsers);
// router.get('/:id', authController.getUser);

// router.put('/:id', authController.updateUser);
// router.put('/password/:id', authController.adminChangePassword);
// router.delete('/:id', authController.deleteUser);

module.exports = router