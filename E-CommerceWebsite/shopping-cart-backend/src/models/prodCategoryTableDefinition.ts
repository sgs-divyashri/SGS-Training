import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";
import { Product } from "./productTableDefinition";

export interface CategoryPayload {
  categoryId: string;
  prod_category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryPayload, "categoryId" | "createdAt" | "updatedAt"> { }

export class Category extends Model<CategoryPayload, CategoryCreationAttributes>
  implements CategoryPayload {
  public categoryId!: string;
  public prod_category!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Category.init(
    {
      categoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      prod_category: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: true,
    }
  );

  return {
    Category,
    associate: (sequelize: Sequelize) => {
      Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
    }
  };
};

