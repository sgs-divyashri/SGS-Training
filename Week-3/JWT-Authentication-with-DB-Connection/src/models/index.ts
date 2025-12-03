
import { Sequelize } from "sequelize";
import userFactory, { User } from "./userTableDefinition";
import taskFactory, { Task } from "./taskTableDefinition";

export const initModels = (sequelize: Sequelize) => {
  const UserModel = userFactory(sequelize);
  const TaskModel = taskFactory(sequelize);

  // Run Associations
  UserModel.associate?.(sequelize);
  TaskModel.associate?.(sequelize)

  return { User: UserModel, Task: TaskModel };
};
