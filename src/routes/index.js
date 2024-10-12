import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import topicRoutes from './topicRoutes.js'
import postRoutes from './postRoutes.js'
import userRoutes from './userRoutes.js'
import savedPostRoutes from './savedPostRoutes.js'
import favoritePostRoutes from './favoritePostRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import bookRoutes from './bookRoutes.js'

function router(app) {
    app.use('/api/user', authRoutes)

    app.use('/api/admin', adminRoutes)

    app.use('/api/topics', topicRoutes)

    app.use('/api/post', postRoutes)

    app.use('/api/user', userRoutes)

    app.use('/api/saved', savedPostRoutes)

    app.use('/api/favorite', favoritePostRoutes)

    app.use('/api/book', bookRoutes)

    app.use('/api/category', categoryRoutes)
}

export default router
