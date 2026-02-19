
import { Sequelize } from "sequelize";
import userFactory from "./userTableDefinition";
import productFactory from "./productTableDefinition";
import categoryFactory from "./prodCategoryTableDefinition"
import orderFactory from './ordersTableDefinition'
import cartFactory from './cartItemsTableDefinition'
import viewOrderFactory from './adminViewOrderNotifyTableDefinition'
import refreshTokenFactory from './refreshTokenTableDefinition'

export const initModels = (sequelize: Sequelize) => {
  const UserModel = userFactory(sequelize);
  const ProductModel = productFactory(sequelize);
  const CategoryModel = categoryFactory(sequelize)
  const OrdersModel = orderFactory(sequelize)
  const CartItemsModel = cartFactory(sequelize)
  const ViewOrdersModel = viewOrderFactory(sequelize)
  const RefreshTokenModel = refreshTokenFactory(sequelize)

  CategoryModel.associate?.(sequelize)
  ProductModel.associate?.(sequelize);
  UserModel.associate?.(sequelize);
  OrdersModel.associate?.(sequelize)
  CartItemsModel.associate?.(sequelize)
  ViewOrdersModel.associate?.(sequelize)

  return { User: UserModel, Product: ProductModel, Category: CategoryModel, Orders: OrdersModel, CartItem: CartItemsModel, ViewOrder: ViewOrdersModel, RefreshTokens: RefreshTokenModel};
};
