import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";

export interface ProductPayload {
  productId: string;
  p_name: string;
  p_description: string;
  orderedBy: number;
  price: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<ProductPayload, "productId" | "p_description"| "isActive" | "createdAt" | "updatedAt"> { }

export class Product extends Model<ProductPayload, UserCreationAttributes>
  implements ProductPayload {
  public productId!: string;
  public p_name!: string;
  public p_description!: string;
  public orderedBy!: number;
  public price!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Product.init(
    {
      productId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      p_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      p_description: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      orderedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: true
    }
  );

  return {
    Product,
    associate: (sequelize: Sequelize) => {
      Product.belongsTo(User, { foreignKey: "orderedBy", targetKey: 'userId' });
    }
  };
};

