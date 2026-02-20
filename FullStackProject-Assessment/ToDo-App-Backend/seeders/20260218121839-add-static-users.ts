import { QueryInterface } from 'sequelize';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        userId: uuid(),
        name: 'Divya',
        email: 'admin@gmail.com.com',
        password: bcrypt.hashSync('HD0315@u', 10), 
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@gmail.com' });
  }
};
