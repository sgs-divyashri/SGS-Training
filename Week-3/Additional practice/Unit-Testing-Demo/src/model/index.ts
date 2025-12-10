
import { Sequelize } from "sequelize";
import userFactory, { User } from "./userTableDefinition";

export const initModels = (sequelize: Sequelize) => {
  const UserModel = userFactory(sequelize);

  return { User: UserModel };
};
