// // endpoint 
// // table name - test [id, name]
// // insert into table

// import { DataTypes, Sequelize } from 'sequelize';

// export const sequelize = new Sequelize('testdb', 'postgres', 'Divya0301', {  // db-name, username, pass, options
//     host: 'localhost',
//     dialect: 'postgres',  // sql    
// })

// /*commonjs module syntax
// set module.exports to any JavaScript value: an object, function, class, string, number — anything.
// any other file that requires this file will get the same sequelize instance back.*/

// // module.exports = sequelize 

// export const Test = sequelize.define("test", {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: {
//         type: DataTypes.STRING(20),
//         allowNull: false
//     }
// }, {
//     tableName: "test"
// })

