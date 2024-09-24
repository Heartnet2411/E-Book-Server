import express from 'express'
import cors from 'cors'
import sequelize from './src/connection/connection.js'
import router from './src/routes/index.js'

const app = express()
const port = 8080

app.use(express.json()) // Để xử lý JSON body
app.use(express.urlencoded({ extended: true })) // Để xử lý URL-encoded body

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello Node')
})

//init route
router(app)

const startServer = async () => {
    try {
        await sequelize.authenticate()
        console.log('Database connected...')

        await sequelize.sync() // Đồng bộ mô hình với cơ sở dữ liệu

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

startServer()
