import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('projectdb', 'postgres', 'Divya0301', {  // db-name, username, pass, options
    host: 'localhost',
    dialect: 'postgres',  // sql   
    logging: false 
})