// controllers/topicController.js
import { Topic, User } from '../models/index.js'

class TopicController {
    // Lấy tất cả các topic
    async getAllTopics(req, res) {
        try {
            const topics = await Topic.findAll({
                where: { state: 'approved' },
            })
            res.status(200).json(topics)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }
    }

    // Tạo topic mới
    async createTopic(req, res) {
        const { name, userId } = req.body

        try {
            // Kiểm tra nếu chủ đề đã tồn tại
            const existingTopic = await Topic.findOne({ where: { name } })

            if (existingTopic) {
                // Nếu chủ đề đã tồn tại, trả về lỗi
                return res.status(202).json({
                    error: 'Tên chủ đề đã tồn tại. Vui lòng chọn một tên khác.',
                })
            }

            // Tạo chủ đề mới nếu không trùng lặp
            const newTopic = await Topic.create({ name, userId })
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
            res.status(200).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    async getTopicByState(req, res) {
        const { filter } = req.params
        try {
            const topics = await Topic.findAll({
                where: { state: filter },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['avatar', 'firstname', 'lastname'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            })
            res.status(200).json(topics)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default new TopicController()
