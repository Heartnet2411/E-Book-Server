import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

// Định nghĩa model BookReader
const BookReader = sequelize.define(
    'BookReader',
    {
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        readCount: {
            type: DataTypes.INTEGER,
            defaultValue: 1, // Mặc định là 1 lần đọc khi thêm bản ghi
            allowNull: false,
        },
    },
    {
        tableName: 'book_reader',
        timestamps: true,
    }
)

export default BookReader
