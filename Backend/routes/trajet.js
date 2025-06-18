const express = require('express')
const trajetController = require('../controllers/trajetController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/createTrajet', authMiddleware, trajetController.createTrajet)
router.get('/getAllTrajets', trajetController.getAllTrajets) 
router.get('/:id', trajetController.getTrajetById) 
router.get('/driver/me', authMiddleware, trajetController.getMyTrajets);
// router.put('/:id', authMiddleware, trajetController.updateTrajet)
router.delete('/:id', authMiddleware, trajetController.deleteTrajet)


module.exports = router