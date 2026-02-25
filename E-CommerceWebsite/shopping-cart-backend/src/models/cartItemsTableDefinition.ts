import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Category } from "./prodCategoryTableDefinition";
import { User } from "./userTableDefinition";
import { Product } from "./productTableDefinition";
import { OrderItems } from "./ordersTableDefinition";

export interface CartItemsPayload {
  cartId: string;
  items: OrderItems[];
  userId: number;
  total_quantity: number;
  totalCount?: number;
  addedAt?: Date;
}

export interface UserCreationAttributes extends Optional<
  CartItemsPayload,
  "cartId" | "addedAt"
> { }

export class CartItems
  extends Model<CartItemsPayload, UserCreationAttributes>
  implements CartItemsPayload {
  public cartId!: string;
  public items!: OrderItems[];
  public userId!: number;
  public total_quantity!: number;
  public totalCount!: number;
  public readonly addedAt!: Date;
}

export default (sequelize: Sequelize) => {
  CartItems.init(
    {
      cartId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "userId" },
      },
      items: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "carts",
      timestamps: true,
      createdAt: "addedAt",
      updatedAt: false,
    },
  );

  return {
    CartItems,
    associate: (sequelize: Sequelize) => {
      CartItems.belongsTo(User, {
        foreignKey: "userId",
        as: 'user'
      })
    },
  };
};
