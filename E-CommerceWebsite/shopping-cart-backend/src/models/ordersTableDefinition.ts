import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";
import { ProductItems } from "../types/productItems";
import { PlaceOrdersPayload } from "../types/placeOrdersPayload";

export interface OrderCreationAttributes extends Optional<
  PlaceOrdersPayload,
  "orderId" | "placedAt"
> {}

export class Orders
  extends Model<PlaceOrdersPayload, OrderCreationAttributes>
  implements PlaceOrdersPayload
{
  public orderId!: string;
  public orderedBy!: number;
  public items!: ProductItems[];
  public totalAmount!: number;
  public status!: string;
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
