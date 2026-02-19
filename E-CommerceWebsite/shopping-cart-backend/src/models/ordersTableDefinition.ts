import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Category } from "./prodCategoryTableDefinition";
import { User } from "./userTableDefinition";

export interface OrderItems {
  productId: string;
  prodName: string;
  price: number;
  quantity: number;
}

export interface PlaceOrdersPayload {
  orderId: string;
  orderedBy: number;
  items: OrderItems[];
  totalAmount: number;
  status: string;
  adminStatus: string;
  placedAt?: Date;
}

export interface UserCreationAttributes extends Optional<
  PlaceOrdersPayload,
  "orderId" | "placedAt"
> {}

export class Orders
  extends Model<PlaceOrdersPayload, UserCreationAttributes>
  implements PlaceOrdersPayload
{
  public orderId!: string;
  public orderedBy!: number;
  public items!: OrderItems[];
  public totalAmount!: number;
  public status!: string;
  public adminStatus!: string;
  public readonly placedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Orders.init(
    {
      orderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      orderedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "userId" },
      },
      items: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("ORDERED", "CANCELLED"),
        allowNull: false,
        defaultValue: "ORDERED",
      },
      adminStatus: {
        type: DataTypes.ENUM("ACCEPTED", "REJECTED", ""),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      tableName: "orders",
      timestamps: true,
      createdAt: "placedAt",
      updatedAt: false,
    },
  );

  return {
    Orders,
    associate: (sequelize: Sequelize) => {
      Orders.belongsTo(User, {
        foreignKey: "orderedBy",
        targetKey: "userId",
        as: "user",
      });
    },
  };
};
