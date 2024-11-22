import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Post = sequelize.define(
    'Post',
    {
        postId: {
            type: DataTypes.UUID,
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
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        state: {
            type: DataTypes.ENUM('pending', 'approved', 'hidden', 'userhidden'),
            allowNull: false,
            defaultValue: 'pending', // Trạng thái mặc định là "đang chờ kiểm duyệt"
        },
        hiddenReason:{
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue:''
        }
    },
    {
        timestamps: true,
        tableName: 'posts',
    }
)

export default Post
