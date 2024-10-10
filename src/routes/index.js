import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import topicRoutes from './topicRoutes.js'
import postRoutes from './postRoutes.js'
import userRoutes from './userRoutes.js'

function router(app) {
    app.use('/api/user', authRoutes)

    app.use('/api/admin', adminRoutes)

    app.use('/api/topics', topicRoutes)

    app.use('/api/post', postRoutes)

    app.use('/api/user', userRoutes)
}

export default router
