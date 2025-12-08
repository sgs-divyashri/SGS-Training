
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";

export interface TaskPayload {
  taskId: string;
  taskName: string;
  description?: string;
  status?: string;
  createdBy: number; 
  isActive: boolean,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes
  extends Optional<TaskPayload, "taskId" | "status" | "isActive" | "createdAt" | "updatedAt"> { }

export class Task extends Model<TaskPayload, TaskCreationAttributes>
  implements TaskPayload {
  public taskId!: string;
  public taskName!: string;
  public description!: string;
  public status!: string;
  public createdBy!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Task.init(
    {
      taskId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      taskName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM("To-Do", "In-Progress", "Review", "Completed"),
        defaultValue: "To-Do",
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: "tasks",
      timestamps: true,
    }
  );

  return {
    Task,
    associate: (sequelize: Sequelize) => {
      Task.belongsTo(User, { foreignKey: "createdBy", targetKey: 'userId' });
    }
  };
};

