import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";
import { CartItemsPayload } from "../types/cartItemsPayload";
import { ProductItems } from "../types/productItems";
import { Product } from "./productTableDefinition";

export interface UserCreationAttributes extends Optional<
  CartItemsPayload,
  "cartId" | "addedAt"
> { }

export class CartItems
  extends Model<CartItemsPayload, UserCreationAttributes>
  implements CartItemsPayload {
  public cartId!: string;
  public userId!: number;
  public productId!: string;
  public quantity!: number;
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
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "products", key: "productId"}
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
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
      CartItems.belongsTo(Product, {
        foreignKey: "productId",
        as: "products"
      })
    },
  };
};
