import express from 'express'
import morgan from 'morgan'
import methodOverride from 'method-override'

const app = express()
const port = 4000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(methodOverride('_method'))

// HTTP logger
app.use(morgan('combined'))

// Routes init
app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
