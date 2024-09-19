import express from 'express'
import cors from 'cors'
import db from './src/connection/connection.js'

const app = express()
const port = 8080
//connection();
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello Node')
})
// app.get('/create-table', (req, res) => {
// var createTB = `CREATE TABLE User (userId CHAR(100) PRIMARY KEY,gender BOOLEAN,roleId CHAR(100),firstName NVARCHAR(100),lastName NVARCHAR(100),dateOfBirth DATE,email NVARCHAR(255),password VARCHAR(255),phoneNumber VARCHAR(50),avatar VARCHAR(255),background VARCHAR(255),salt VARCHAR(100));`
    // db.query(createTB, (err, result) => {
        // if (err) {
            // res.send(err)
        // }
        // res.send('Table created')
    // })
// })
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
