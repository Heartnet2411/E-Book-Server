import express from 'express'
import userController from '../app/controllers/userController.js'

const router = express.Router()

router.get('/:id', userController.getUserByID)

router.put('/users/:id', userController.updateUserInfo)

export default router
