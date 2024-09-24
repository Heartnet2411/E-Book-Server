import userRouter from './userRouter.js'

function router(app) {
    app.use('/api/user', userRouter)
}

export default router
