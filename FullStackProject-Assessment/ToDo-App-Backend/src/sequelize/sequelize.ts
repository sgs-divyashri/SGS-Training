import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';

export const sequelize = new Sequelize(
    (env === 'test' ? 'ToDo_db_test' : 'ToDo_db'), 'postgres', 'Divya0301',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);
