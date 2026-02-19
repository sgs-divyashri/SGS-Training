import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";
import { Category } from "./prodCategoryTableDefinition";
import { CartItems } from "./cartItemsTableDefinition";

export interface ProductPayload {
  productId: string;
  p_name: string;
  p_description: string;
  categoryId: string;
  price: number;
  qty: number;
  inStock: string;
  isNotification: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<
  ProductPayload,
  | "productId"
  | "p_description"
  | "inStock"
  | "isNotification"
  | "createdAt"
  | "updatedAt"
> {}

export class Product
  extends Model<ProductPayload, UserCreationAttributes>
  implements ProductPayload
{
  public productId!: string;
  public p_name!: string;
  public p_description!: string;
  public categoryId!: string;
  public price!: number;
  public qty!: number;
  public inStock!: string;
  public isNotification!: boolean;
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
        type: DataTypes.TEXT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "categories", key: "categoryId" },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inStock: {
        type: DataTypes.ENUM("In Stock", "Out of Stock"),
        defaultValue: "In Stock",
        allowNull: false,
      },
      isNotification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: true,
    },
  );

  return {
    Product,
    associate: (sequelize: Sequelize) => {
      Product.belongsTo(Category, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Product.hasMany(CartItems, {
        foreignKey: "prodId",
        sourceKey: "productId",
        as: "cartItems",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    },
  };
};
