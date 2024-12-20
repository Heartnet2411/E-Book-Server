import {
    Report,
    Post,
    Topic,
    User,
    Book,
    BookComment,
    PostComment,
} from '../models/index.js' // Đường dẫn đến file model của bạn
import sequelize from '../../connection/connection.js'
class reportController {
    // Tạo báo cáo mới
    async createReport(req, res) {
        try {
            const { targetType, targetId, userId, reason } = req.body
            // check exist
            const existingReport = await Report.findOne({
                where: {
                    targetType,
                    targetId,
                    userId,
                },
            })
            if (existingReport) {
                return res
                    .status(202)
                    .json({ message: 'Bạn đã báo cáo bài viết này trước đó.' })
            }
            const report = await Report.create({
                targetType,
                targetId,
                userId,
                reason,
            })
            res.status(201).json(report)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // Lấy tất cả báo cáo
    async getReports(req, res) {
        try {
            const reports = await Report.findAll()
            res.status(200).json(reports)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // Cập nhật trạng thái báo cáo
    async updateReport(req, res) {
        const { reportId } = req.params
        const { state } = req.body

        try {
            const report = await Report.findByPk(reportId)
            if (!report) {
                return res.status(404).json({ message: 'Report not found' })
            }

            report.state = state
            await report.save()
            res.status(200).json(report)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // Xóa báo cáo
    async deleteReport(req, res) {
        const { reportId } = req.params

        try {
            const report = await Report.findByPk(reportId)
            if (!report) {
                return res.status(404).json({ message: 'Report not found' })
            }

            await report.destroy()
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    async getReportedPosts(req, res) {
        try {
            // Truy vấn nhóm theo targetId và đếm số lượng báo cáo
            const reports = await Report.findAll({
                attributes: [
                    'targetId',
                    'status',
                    [sequelize.fn('COUNT', sequelize.col('reportId')), 'count'], // Đếm số lượng báo cáo
                ],
                where: { targetType: 'post', status: 'pending' },

                group: ['targetId', 'status'],
                include: [
                    {
                        model: Post,
                        as: 'Post',
                        include: [
                            { model: Topic, as: 'topic' },
                            {
                                model: User,
                                as: 'user',
                                attributes: ['avatar', 'firstname', 'lastname'],
                            },
                        ],
                    },
                ],
            })

            // Chuyển đổi dữ liệu để trả về dưới dạng mong muốn
            const reportedPosts = reports.map((report) => {
                const post = report.Post // Lấy bài viết từ báo cáo
                return {
                    count: report.dataValues.count, // Lấy số lượng báo cáo từ cột đếm
                    status: report.status,
                    // Tách các trường từ Post ra ngoài
                    postId: post?.postId,
                    topicId: post?.topicId,
                    postUserId: post?.userId,
                    title: post?.title,
                    content: post?.content,
                    image: post?.image,
                    // state: post?.state,
                    postCreatedAt: post?.createdAt,
                    postUpdatedAt: post?.updatedAt,
                    topic: post?.topic,
                    user: post?.user,
                    // Giữ nguyên topic
                }
            })

            // Trả về dữ liệu đã xử lý
            res.status(200).json(reportedPosts)
        } catch (error) {
            res.status(500).json({
                message: error.message,
            })
        }
    }
    async hideReportPost(req, res) {
        const transaction = await sequelize.transaction()
        try {
            const { postId } = req.params

            // Kiểm tra xem bài viết có tồn tại không
            const post = await Post.findByPk(postId, { transaction })
            if (!post) {
                return res.status(404).json({ message: 'Post not found' })
            }

            // Cập nhật trạng thái bài viết thành 'hidden'
            post.state = 'hidden'
            await post.save({ transaction })

            // Cập nhật trạng thái 'hidden' cho các báo cáo liên quan
            const [updatedReports] = await Report.update(
                { status: 'hidden' },
                { where: { targetId: postId, targetType: 'post' }, transaction }
            )

            // Kiểm tra xem có báo cáo nào được cập nhật không
            if (updatedReports === 0) {
                return res
                    .status(404)
                    .json({ message: 'No reports found for this post' })
            }

            // Commit giao dịch
            await transaction.commit()
            return res
                .status(200)
                .json({ message: 'Post and related reports have been hidden' })
        } catch (error) {
            // Rollback giao dịch khi có lỗi
            await transaction.rollback()
            console.error('Error hiding post and reports:', error)
            return res.status(500).json({
                message: 'An error occurred while hiding the post and reports.',
            })
        }
    }
    async declineHideReportPost(req, res) {
        try {
            const { postId } = req.params
            // Cập nhật trạng thái 'hidden' cho các báo cáo liên quan
            await Report.update(
                { status: 'hidden' },
                { where: { targetId: postId, targetType: 'post' } }
            )
            return res
                .status(200)
                .json({ message: 'Post and related reports have been hidden' })
        } catch (error) {
            // Rollback giao dịch khi có lỗi
            console.error('Error hiding post and reports:', error)
            return res.status(500).json({
                message: 'An error occurred while hiding the post and reports.',
            })
        }
    }
    async getReasonReportPost(req, res) {
        try {
            const { postId } = req.params

            if (!postId) {
                return res.status(400).json({ message: 'postId is required' })
            }

            // Truy vấn lấy lý do báo cáo kèm thông tin user
            const reasons = await Report.findAll({
                where: { targetId: postId },
                attributes: ['reason', 'createdAt'], // Chỉ lấy các cột cần thiết
                include: [
                    {
                        model: User,
                        as: 'user', // Alias được định nghĩa trong mô hình
                        attributes: [
                            'userId',
                            'avatar',
                            'firstname',
                            'lastname',
                        ], // Các cột của User
                    },
                ],
            })

            // Trả về dữ liệu đã truy vấn
            res.status(200).json(reasons)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: error.message })
        }
    }
    async getReportedComments(req, res) {
        try {
            const { filter } = req.query // Lấy filter từ query params
            let bookCommentReports = []
            let postCommentReports = []

            // Lấy báo cáo liên quan đến BookComment nếu filter là 'all' hoặc 'book'
            if (filter === 'all' || filter === 'book-cmt') {
                bookCommentReports = await Report.findAll({
                    attributes: [
                        'targetId',
                        'status',
                        'targetType',
                        [
                            sequelize.fn('COUNT', sequelize.col('reportId')),
                            'count',
                        ], // Đếm số lượng báo cáo
                    ],
                    where: {
                        targetType: 'book_comment', // Chỉ báo cáo liên quan đến BookComment
                        status: 'pending', // Trạng thái báo cáo
                    },
                    group: ['targetId', 'status'],
                    include: [
                        {
                            model: BookComment,
                            as: 'BookComment', // Alias được định nghĩa trong mô hình
                            include: [
                                {
                                    model: User,
                                    as: 'user',
                                    attributes: [
                                        'avatar',
                                        'firstname',
                                        'lastname',
                                    ], // Lấy thông tin người dùng
                                },
                            ],
                        },
                    ],
                })
            }

            // Lấy báo cáo liên quan đến PostComment nếu filter là 'all' hoặc 'post'
            if (filter === 'all' || filter === 'post-cmt') {
                postCommentReports = await Report.findAll({
                    attributes: [
                        'targetId',
                        'status',
                        'targetType',
                        [
                            sequelize.fn('COUNT', sequelize.col('reportId')),
                            'count',
                        ], // Đếm số lượng báo cáo
                    ],
                    where: {
                        targetType: 'post_comment', // Chỉ báo cáo liên quan đến PostComment
                        status: 'pending', // Trạng thái báo cáo
                    },
                    group: ['targetId', 'status'],
                    include: [
                        {
                            model: PostComment,
                            as: 'PostComment',
                            include: [
                                {
                                    model: User,
                                    as: 'user',
                                    attributes: [
                                        'avatar',
                                        'firstname',
                                        'lastname',
                                    ], // Lấy thông tin người dùng
                                },
                            ],
                        },
                    ],
                })
            }

            // Xử lý dữ liệu BookComment
            const bookReports = bookCommentReports.map((report) => {
                const comment = report.BookComment // Liên kết với BookComment
                return {
                    count: report.dataValues.count, // Số lượng báo cáo
                    status: report.status,
                    type: report.targetType,
                    commentId: report?.targetId,
                    comment: comment?.comment,
                    commentCreatedAt: comment?.createdAt,
                    commentUpdatedAt: comment?.updatedAt,
                    user: comment?.user,
                }
            })

            // Xử lý dữ liệu PostComment
            const postReports = postCommentReports.map((report) => {
                const comment = report.PostComment // Liên kết với PostComment
                return {
                    count: report.dataValues.count, // Số lượng báo cáo
                    status: report.status,
                    type: report.targetType,
                    commentId: report?.targetId,
                    content: comment?.content,
                    commentCreatedAt: comment?.createdAt,
                    commentUpdatedAt: comment?.updatedAt,
                    user: comment?.user,
                }
            })

            // Gộp dữ liệu từ hai loại bình luận nếu filter là 'all'
            let reportedComments = []
            if (filter === 'all') {
                reportedComments = [...bookReports, ...postReports]
            } else if (filter === 'book-cmt') {
                reportedComments = bookReports
            } else if (filter === 'post-cmt') {
                reportedComments = postReports
            }

            // Trả về dữ liệu đã xử lý
            res.status(200).json(reportedComments)
        } catch (error) {
            res.status(500).json({
                message: error.message,
            })
        }
    }

    async hideReportComment(req, res) {
        const transaction = await sequelize.transaction()
        const { commentId } = req.params
        try {
            let comment = await BookComment.findOne({ where: { commentId } })
            let table = 'BookComment' // Đặt bảng mặc định

            if (!comment) {
                // Nếu không tìm thấy, tìm trong bảng PostComment
                comment = await PostComment.findOne({ where: { commentId } })
                table = 'PostComment'
            }

            // Cập nhật trạng thái ẩn (ví dụ: `status = 'hidden'`)
            await comment.update({ status: false }, { transaction })
            const [updatedReports] = await Report.update(
                { status: 'hidden' },
                { where: { targetId: commentId}, transaction }
            )

            // Lưu thay đổi và trả về kết quả
            await transaction.commit()
            res.status(200).json({
                message: `Comment hidden successfully in ${table}`,
                commentId,
            })
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await transaction.rollback()
            console.error(error)
            res.status(500).json({ message: 'Failed to hide comment', error })
        }
    }
    async declineHideReportComment(req, res) {
        try {
            const { commentId } = req.params
            // Cập nhật trạng thái 'hidden' cho các báo cáo liên quan
            await Report.update(
                { status: 'hidden' },
                { where: { targetId: commentId } }
            )
            return res
                .status(200)
                .json({ message: 'Comment and related reports have been hidden' })
        } catch (error) {
            // Rollback giao dịch khi có lỗi
            console.error('Error hiding comment and reports:', error)
            return res.status(500).json({
                message: 'An error occurred while hiding the comment and reports.',
            })
        }
    }
}
export default new reportController()
