
import { Sequelize } from "sequelize";
import userFactory, { User } from "./userTableDefinition";
import taskFactory, { Task } from "./taskTableDefinition";

export const initModels = (sequelize: Sequelize) => {
  const UserModel = userFactory(sequelize);
  const TaskModel = taskFactory(sequelize);

  // Associations
  UserModel.hasMany(TaskModel, { foreignKey: "userId", sourceKey: 'userId' });
  TaskModel.belongsTo(UserModel, { foreignKey: "userId", targetKey: 'userId' });

  return { User: UserModel, Task: TaskModel };
};
