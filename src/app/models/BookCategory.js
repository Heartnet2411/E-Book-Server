import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const BookCategory = sequelize.define(
    'BookCategory',
    {
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: 'BookCategory',
    }
)

export default BookCategory
