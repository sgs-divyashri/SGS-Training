
import { Sequelize } from "sequelize";
import userFactory, { User } from "./userTableDefinition";
// import taskFactory, { Task } from "./taskTableDefinition";

export const initModels = (sequelize: Sequelize) => {
  const UserModel = userFactory(sequelize);

  return { User: UserModel };
};
