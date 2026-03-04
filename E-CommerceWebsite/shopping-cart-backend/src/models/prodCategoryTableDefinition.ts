import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { CategoryPayload } from "../types/categoryPayload";
import { Product } from "./productTableDefinition";

export interface CategoryCreationAttributes
  extends Optional<CategoryPayload, "categoryId" | "createdAt" | "updatedAt"> { }

export class Category extends Model<CategoryPayload, CategoryCreationAttributes>
  implements CategoryPayload {
  public categoryId!: string;
  public prod_category!: string;
  public addedBy!: number;
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
      },
      addedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "userId" },
      },
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

