// routes/topicRoutes.js
import express from 'express'
import TopicController from '../app/controllers/topicController.js'

const router = express.Router()

router.get('/', TopicController.getAllTopics)

router.post('/', TopicController.createTopic)

router.put('/:topicId', TopicController.updateTopic)

router.delete('/:topicId', TopicController.deleteTopic)

export default router
