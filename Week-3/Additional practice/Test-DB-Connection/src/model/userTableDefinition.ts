import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface UserPayload {
  userId?: number;
  name: string;
  email: string;
  password: string;
  age: number,
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserPayload, "userId" | "isActive" | "createdAt" | "updatedAt"> {}

export class User extends Model<UserPayload, UserCreationAttributes>
  implements UserPayload {
  public userId!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public age!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        // field: "user_id",
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
        // field: "is_active",
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      // underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
          name: "unique_user_email",
        },
      ],
    }
  );

  return User;
};

