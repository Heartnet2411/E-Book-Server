import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const PostComment = sequelize.define(
    'PostComment',
    {
        commentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        replyId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    { tableName: 'post_comments', timestamps: true }
)

export default PostComment
