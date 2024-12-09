// controllers/topicController.js
import { Topic } from '../models/index.js'

class TopicController {
    // Lấy tất cả các topic
    async getAllTopics(req, res) {
        try {
            const topics = await Topic.findAll()
            res.status(200).json(topics)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Tạo topic mới
    async createTopic(req, res) {
        const { name,userId } = req.body
        try {
            const newTopic = await Topic.create({ name,userId })
            res.status(201).json(newTopic)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Sửa topic
    async updateTopic(req, res) {
        const { topicId } = req.params
        const { name } = req.body

        try {
            const topic = await Topic.findByPk(topicId)
            if (!topic) {
                return res.status(404).json({ message: 'Topic not found' })
            }

            topic.name = name
            await topic.save()

            res.status(200).json(topic)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa topic
    async deleteTopic(req, res) {
        const { topicId } = req.params

        try {
            const topic = await Topic.findByPk(topicId)
            if (!topic) {
                return res.status(404).json({ message: 'Topic not found' })
            }

            await topic.destroy()
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new TopicController()
