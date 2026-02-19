
import { Sequelize } from "sequelize";
import userFactory from "./userTableDefinition";
import taskFactory from "./taskTableDefinition";

export const initModels = (sequelize: Sequelize) => {
  const UserModel = userFactory(sequelize);
  const TaskModel = taskFactory(sequelize);

  UserModel.associate?.(sequelize);
  TaskModel.associate?.(sequelize)

  return { User: UserModel, Task: TaskModel };
};
