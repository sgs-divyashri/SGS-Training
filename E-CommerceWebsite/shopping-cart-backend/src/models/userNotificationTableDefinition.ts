import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";
import { Orders } from "./ordersTableDefinition";

export interface OrderItems {
  productId: string;
  prodName: string;
  price: number;
  quantity: number;
}

export interface NotifyOrdersPayload {
  notifyId: string;
  orderId: string;
  items: OrderItems[];
  adminStatus: string;
  receivedAt?: Date;
}

export interface UserCreationAttributes extends Optional<
  NotifyOrdersPayload,
  "notifyId" | "receivedAt"
> {}

export class NotifyUserOrders
  extends Model<NotifyOrdersPayload, UserCreationAttributes>
  implements NotifyOrdersPayload
{
  public notifyId!: string;
  public orderId!: string;
  public items!: OrderItems[];
  public adminStatus!: string;
  public readonly receivedAt!: Date;
}

export default (sequelize: Sequelize) => {
  NotifyUserOrders.init(
    {
      notifyId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "orders", key: "orderId" },
      },
      items: {
        type: DataTypes.JSONB, 
        allowNull: false,
        defaultValue: [],
      },
      adminStatus: {
        type: DataTypes.ENUM("ACCEPTED", "REJECTED", ""),
        allowNull: true,
        defaultValue: ""
      },
    },
    {
      sequelize,
      tableName: "user_order_notifications",
      timestamps: true,
      createdAt: "receivedAt",
      updatedAt: false,
    },
  );

  return {
    NotifyUserOrders,
    associate: (sequelize: Sequelize) => {
      NotifyUserOrders.belongsTo(Orders, {
        foreignKey: 'orderId' 
      })
    },
  };
};
