// controllers/postController.js
import { Post, User, Topic,Report } from '../models/index.js'

class PostController {
    // Lấy tất cả các bài viết
    async getAllPosts(req, res) {
        try {
            const posts = await Post.findAll({
                include: [
                    { model: Topic, as: 'topic' },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['avatar', 'firstname', 'lastname'],
                    },
                ],
            })
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getPostsByUserId(req, res) {
        try {
            const { userId } = req.params // Lấy userId từ URL

            // Tìm tất cả bài viết của user với userId
            const posts = await Post.findAll({
                where: { userId }, // Điều kiện lọc theo userId
                include: [
                    { model: Topic, as: 'topic' },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['avatar', 'firstname', 'lastname'],
                    },
                ], // Bao gồm thông tin về topic
            })
            if (!posts) {
                return res
                    .status(404)
                    .json({ message: 'No posts found for this user' })
            }

            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getPostsByTopicId(req, res) {
        try {
            const { topicId } = req.params // Lấy topicId từ URL

            // Tìm tất cả bài viết của topic với topicId
            const posts = await Post.findAll({
                where: { topicId }, // Điều kiện lọc theo topicId
                include: [
                    { model: Topic, as: 'topic' },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['avatar', 'firstname', 'lastname'],
                    },
                ], // Bao gồm thông tin topic
            })

            if (!posts) {
                return res
                    .status(404)
                    .json({ message: 'No posts found for this topic' })
            }

            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Tạo bài viết mới
    async createPost(req, res) {
        const { title, content, topicId } = req.body
        const userId = req.user.userId
        const image = req.imageUrl || null

        try {
            const newPost = await Post.create({
                title,
                content,
                image,
                topicId,
                userId,
            })
            res.status(201).json(newPost)
        } catch (error) {
            res.status(500).json({ error: error.message })
            console.log(error)
        }
    }

    // Sửa bài viết
    async updatePost(req, res) {
        const { postId } = req.params // Lấy postId từ URL
        const { title, content, image, topicId } = req.body // Lấy dữ liệu từ body

        try {
            const post = await Post.findByPk(postId)
            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            post.title = title // Cập nhật tên bài viết
            post.content = content
            post.image = image
            post.topicId = topicId

            await post.save() // Lưu thay đổi

            res.status(200).json(post)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // Xóa bài viết
    async deletePost(req, res) {
        const { postId } = req.params

        try {
            const post = await Post.findByPk(postId)
            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }
            await Report.update(
                { status: 'hidden' },
                { where: { targetId: postId, targetType: 'post' } }
            );
            await post.destroy() // Xóa bài viết
            res.status(204).send() // Trả về 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    async getPostsByState(req, res) {
        const { filter } = req.params
        try {
            if (filter === 'all') {
                const posts = await Post.findAll({
                    include: [
                        { model: Topic, as: 'topic' },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['avatar', 'firstname', 'lastname'],
                        },
                    ],
                })
                res.status(200).json(posts)
            } else {
                const posts = await Post.findAll({
                    where: { state: filter },
                    include: [
                        { model: Topic, as: 'topic' },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['avatar', 'firstname', 'lastname'],
                        },
                    ],
                })
                res.status(200).json(posts)
            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
    
}

export default new PostController()
