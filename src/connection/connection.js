import mysql from 'mysql'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    // connectTimeout: 10000
})
db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log('MySQL Connected...')
    }
})
export default db
