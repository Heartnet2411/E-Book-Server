import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const BookComment = sequelize.define(
    'BookComment',
    {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        commentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        timestamps: true, // Để có createdAt và updatedAt tự động
        tableName: 'book_comments',
    }
)

export default BookComment
