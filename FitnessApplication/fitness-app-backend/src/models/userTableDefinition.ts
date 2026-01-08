import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface UserPayload {
  userId: number;
  name: string;
  email: string;
  password: string;
  age: number,
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserPayload, "userId" | "isActive" | "createdAt" | "updatedAt"> { }

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
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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

  return User
};

