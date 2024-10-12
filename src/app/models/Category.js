import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Category = sequelize.define(
    'Category',
    {
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: 'categories',
    }
)

export default Category
