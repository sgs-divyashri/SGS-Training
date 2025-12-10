// endpoint 
// table name - test [id, name]
// insert into table

'use strict';
import Hapi from '@hapi/hapi'
import { DataTypes, Sequelize } from 'sequelize';

export const sequelize = new Sequelize('testdb', 'postgres', 'Divya0301', {  // db-name, username, pass, options
    host: 'localhost',
    dialect: 'postgres'  // sql
})

/*commonjs module syntax
set module.exports to any JavaScript value: an object, function, class, string, number — anything.
any other file that requires this file will get the same sequelize instance back.*/

// module.exports = sequelize 

const Test = sequelize.define("test", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "test"
})

interface UserPayload {
    name: string;
}

const init = async () => {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await Test.sync();

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    server.route(
        {
            method: 'POST',
            path: '/test',
            handler: async (request, h) => {
                const { name } = request.payload as UserPayload;
                if (!name) {
                    return h.response({ error: "name is required" }).code(400);
                }
                const user = await Test.create({ name });
                return h.response({
                    message: "Inserted successfully!",
                    user
                });

            },
            options: {
                auth: false,
            },
        }
    )

    server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err: any) => {
    console.log(err);
    process.exit(1);
});

init();