import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";
import { CartItemsPayload } from "../types/cartItemsPayload";
import { ProductItems } from "../types/productItems";

export interface UserCreationAttributes extends Optional<
  CartItemsPayload,
  "cartId" | "addedAt"
> { }

export class CartItems
  extends Model<CartItemsPayload, UserCreationAttributes>
  implements CartItemsPayload {
  public cartId!: string;
  public items!: ProductItems[];
  public userId!: number;
  // public total_quantity!: number;
  // public totalCount!: number;
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
      // total_quantity: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      // totalCount: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
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
