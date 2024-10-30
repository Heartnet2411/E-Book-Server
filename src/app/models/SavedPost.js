import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const SavedPost = sequelize.define(
    'SavedPost',
    {
        userId: {
            type: DataTypes.CHAR(100),
            allowNull: false,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        timestamps: true,
        tableName: 'saved_posts',
    }
)

export default SavedPost
