const express = require('express')
const authController = require('../controllers/controllers')
// const trajetController = require('../controllers/trajetController')
const Schema = require('../models/auth')
const { registerValidator, loginValidator } = require('../validator/userValidator')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/register', registerValidator, authController.register)
router.post('/login', loginValidator, authController.login)
router.get('/profile', authMiddleware, authController.profile)
router.put('/profile', authMiddleware, authController.updateProfile)

// router.post('/createTrajet', trajetController.createTrajet)

router.get('/num', async() => {
    const withRole = await Schema.find({ role: { $exists: true } });
    console.log(withRole); 
})

module.exports = router;