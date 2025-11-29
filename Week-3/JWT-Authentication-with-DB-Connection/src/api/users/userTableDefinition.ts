// endpoint 
// table name - test [id, name]
// insert into table

import { DataTypes } from "sequelize";
import { sequelize } from "../../sequelize/sequelize";

/*commonjs module syntax
set module.exports to any JavaScript value: an object, function, class, string, number — anything.
any other file that requires this file will get the same sequelize instance back.*/

// module.exports = sequelize 

export const User = sequelize.define("user", {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    timestamps: true,
    tableName: 'users',
    indexes: [
        {
            unique: true,
            fields: ['email'],
        }
    ]
},
);

