// 'use strict';

// module.exports = {
//   async up(queryInterface: any, Sequelize: any) {
//     await queryInterface.createTable('users', {
//       userId: {
//         type: Sequelize.UUID,
//         primaryKey: true, 
//         allowNull: false,
//       },
//       name: {
//         type: Sequelize.STRING(100),
//         allowNull: false,
//       },
//       email: {
//         type: Sequelize.STRING(150),
//         allowNull: false,
//         unique: true,
//       },
//       password: {
//         type: Sequelize.STRING(255),
//         allowNull: false,
//       },
//       role: {
//         type: Sequelize.STRING(5), 
//         allowNull: false,
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.fn('NOW'),
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.fn('NOW'),
//       },
//     });
//   },

//   async down(queryInterface: any, Sequelize: any) {
//     await queryInterface.dropTable('users');
//   }
// };