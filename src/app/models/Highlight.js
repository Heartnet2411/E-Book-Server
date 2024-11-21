import { DataTypes } from 'sequelize'
import sequelize from '../../connection/connection.js'

const Highlight= sequelize.define('Highlight',{
    highlightId:{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue : DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.CHAR(100),
        allowNull: false,
    },
    bookId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    text:{
        type:DataTypes.TEXT,
        allowNull: false
    },
    cfiRange:{
        type: DataTypes.STRING,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},{ timestamps: true, tableName: 'highlights' }
)
export default Highlight