import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import topicRoutes from './topicRoutes.js'
import postRoutes from './postRoutes.js'
import userRoutes from './userRoutes.js'
import savedPostRoutes from './savedPostRoutes.js'
import favoritePostRoutes from './favoritePostRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import bookRoutes from './bookRoutes.js'
import bookComment from './bookCommentRoutes.js'
import savedBook from './savedBookRoutes.js'
import postComment from './postCommentRoutes.js'

function router(app) {
    app.use('/api/user', authRoutes)

    app.use('/api/admin', adminRoutes)

    app.use('/api/topics', topicRoutes)

    app.use('/api/post', postRoutes)

    app.use('/api/user', userRoutes)

    app.use('/api/post/saved', savedPostRoutes)

    app.use('/api/post/favorite', favoritePostRoutes)

    app.use('/api/post/comment', postComment)

    app.use('/api/book', bookRoutes)

    app.use('/api/category', categoryRoutes)

    app.use('/api/book/comments', bookComment)

    app.use('/api/book/saved', savedBook)
}

export default router
