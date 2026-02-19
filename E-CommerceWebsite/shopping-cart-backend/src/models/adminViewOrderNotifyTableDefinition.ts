import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";
import { Orders } from "./ordersTableDefinition";

export interface OrderItems {
  productId: string;
  prodName: string;
  price: number;
  quantity: number;
}

export interface ViewOrdersPayload {
  viewOrderId: string;
  orderId: string;
  orderedBy: number;
  items: OrderItems[];
  totalAmount: number;
  status?: string;
  userStatus: string;
  receivedAt?: Date;
}

export interface UserCreationAttributes extends Optional<
  ViewOrdersPayload,
  "viewOrderId" | "receivedAt"
> {}

export class ViewOrders
  extends Model<ViewOrdersPayload, UserCreationAttributes>
  implements ViewOrdersPayload
{
  public viewOrderId!: string;
  public orderedBy!: number;
  public orderId!: string;
  public items!: OrderItems[];
  public status!: string;
  public userStatus!: string;
  public totalAmount!: number;
  public readonly receivedAt!: Date;
}

export default (sequelize: Sequelize) => {
  ViewOrders.init(
    {
      viewOrderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "orders", key: "orderId" },
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
      status: {
        type: DataTypes.ENUM("ACCEPTED", "REJECTED", ""),
        allowNull: true,
        defaultValue: ""
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      userStatus: {
        type: DataTypes.ENUM("ORDERED", "CANCELLED"),
        allowNull: false,
        defaultValue: "ORDERED"
      }
    },
    {
      sequelize,
      tableName: "view_orders",
      timestamps: true,
      createdAt: "receivedAt",
      updatedAt: false,
    },
  );

  return {
    ViewOrders,
    associate: (sequelize: Sequelize) => {
      ViewOrders.belongsTo(User, {
        foreignKey: "orderedBy",
        targetKey: "userId",
        as: "user",
      });
      ViewOrders.belongsTo(Orders, {
        foreignKey: 'orderId' 
      })
    },
  };
};
