"use strict";
import apiRoutes from "./api/index";
import Jwt from "@hapi/jwt";
import Hapi, { Server } from "@hapi/hapi";
import { configureAuthStrategy } from "./authentication/auth.strategy";
import { sequelize } from "./sequelize/sequelize";
import { initModels } from "./models";
import "dotenv/config";

const env = process.env.NODE_ENV || 'development';

const init = async () => {
  let server: Server;
  server = await create();

  await server.start();
  console.log("Server running on", server.info.uri);
};

process.on("unhandledRejection", (err: any) => {
  console.log(err);
  process.exit(1);
});

const create = async (): Promise<Server> => {
  initModels(sequelize);

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  if (env === "test") {
    await sequelize.query('DROP TYPE IF EXISTS "enum_users_role" CASCADE;');
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }

  const server = Hapi.server({
    // create a new server object from Hapi
    port: 3000, // server listens on port: 3000
    host: "localhost", // accessibile from same machine - not from external networks
    routes: {
      cors: {
        origin: ["http://localhost:5173"],
        additionalHeaders: ["Authorization", "Content-Type"],
        credentials: false,
      },
    },
  });

  await server.register(Jwt);

  configureAuthStrategy(server);

  server.route(apiRoutes);

  return server;
};

export const init_test = async () => {
  let s: Server = await create();
  await s.initialize();
  return s;
};

if (env !== "test") {
  init();
}
