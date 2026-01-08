import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('fitness_database', 'postgres', 'Divya0301', {  // db-name, username, pass, options
    host: 'localhost',
    dialect: 'postgres',    
    logging: false 
})