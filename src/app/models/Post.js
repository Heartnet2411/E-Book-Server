import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Post = sequelize.define(
    'Post',
    {
        postId: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        topicId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: 'posts',
    }
)

export default Post
