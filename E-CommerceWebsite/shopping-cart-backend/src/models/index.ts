
import { Sequelize } from "sequelize";
import userFactory from "./userTableDefinition";
import productFactory from "./productTableDefinition";

export const initModels = (sequelize: Sequelize) => {
  const UserModel = userFactory(sequelize);
  const ProductModel = productFactory(sequelize);

  // Run Associations
  UserModel.associate?.(sequelize);
  ProductModel.associate?.(sequelize);
//   TaskModel.associate?.(sequelize)

  return { User: UserModel, Product: ProductModel};
};
