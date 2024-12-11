// controllers/topicController.js
import { Topic, User, Post } from '../models/index.js'
import { Sequelize } from 'sequelize'

class TopicController {
    // Lấy tất cả các topic
    async getAllTopics(req, res) {
        try {
            const topics = await Topic.findAll({
                attributes: {
                    include: [
                        // Đếm số bài viết đã được phê duyệt
                        [
                            Sequelize.fn(
                                'COUNT',
                                Sequelize.col('posts.postId')
                            ),
                            'approvedPostsCount',
                        ],
                        // Lấy bài viết cuối cùng dựa trên trạng thái approved
                        [
                            Sequelize.literal(`(
                            SELECT "updatedAt"
                            FROM "posts" AS "p"
                            WHERE "p"."topicId" = "Topic"."topicId"
                            AND "p"."state" = 'approved'
                            ORDER BY "p"."updatedAt" DESC
                            LIMIT 1
                        )`),
                            'lastActive',
                        ],
                    ],
                },
                include: {
                    model: Post,
                    as: 'posts',
                    attributes: [], // Không cần chi tiết bài viết trong kết quả chính
                    where: {
                        state: 'approved', // Điều kiện chỉ lấy bài viết đã phê duyệt
                    },
                    required: false, // Bao gồm cả topic không có bài viết
                },
                group: ['Topic.topicId'], // Nhóm theo topic để tính COUNT chính xác
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
