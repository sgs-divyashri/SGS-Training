import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Category } from "./prodCategoryTableDefinition";
import { User } from "./userTableDefinition";
import { Product } from "./productTableDefinition";

export interface CartItemsPayload {
  cartId: string;
  prodId: string;
  prodName: string;
  prodDescription: string;
  userId: number;
  userEmail: string;
  price: number;
  qty?: number;
  total_quantity: number;
  totalCount?: number;
  addedAt?: Date;
}

export interface UserCreationAttributes extends Optional<
  CartItemsPayload,
  "cartId" | "addedAt"
> {}

export class CartItems
  extends Model<CartItemsPayload, UserCreationAttributes>
  implements CartItemsPayload
{
  public cartId!: string;
  public prodId!: string;
  public prodName!: string;
  public prodDescription!: string;
  public userId!: number;
  public userEmail!: string;
  public price!: number;
  public total_quantity!: number;
  public qty!: number;
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
      userEmail: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      prodId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "products", key: "productId" },
      },
      prodName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      prodDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      CartItems.belongsTo(Product, {
        foreignKey: "prodId",
        targetKey: "productId",
        as: "products",
      });
    },
  };
};
