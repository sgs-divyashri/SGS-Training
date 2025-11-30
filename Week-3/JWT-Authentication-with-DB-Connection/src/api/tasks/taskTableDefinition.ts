import { sequelize } from "../../sequelize/sequelize"
import { DataTypes } from "sequelize"

export const Task = sequelize.define("task", {
    taskId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    taskName: { 
        type: DataTypes.STRING(20),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "To-Do"
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "tasks"
},)
