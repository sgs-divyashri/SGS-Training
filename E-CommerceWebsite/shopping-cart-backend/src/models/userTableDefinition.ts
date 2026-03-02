import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Orders } from "./ordersTableDefinition";
import { Product } from "./productTableDefinition";
import { UserPayload } from "../types/userPayload";

export interface UserCreationAttributes
  extends Optional<UserPayload, "userId" | "createdAt" | "updatedAt"> { }

export class User extends Model<UserPayload, UserCreationAttributes>
  implements UserPayload {
  public userId!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  toJSON() {
    const values = { ...this.get() } as any;
    delete values.password;
    return values;
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('Admin', 'User'),
        allowNull: false
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ['password'] }
      },
      indexes: [
        {
          unique: true,
          fields: ["email"],
          name: "unique_user_email",
        },
      ],
    }
  );

  return {
    User,
    associate: (sequelize: Sequelize) => {
      User.hasMany(Orders, { foreignKey: "orderedBy", sourceKey: 'userId', as: "orders", });
      User.hasMany(Product, {foreignKey: "addedBy", sourceKey: 'userId', as: "products"})
    }
  };
};

