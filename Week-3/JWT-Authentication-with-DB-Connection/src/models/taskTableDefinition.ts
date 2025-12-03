
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface TaskPayload {
  taskId: string;
  taskName: string;
  description?: string;
  status?: string;
  createdBy: number; // Foreign key
  isActive: boolean,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes
  extends Optional<TaskPayload, "taskId" | "status" | "isActive" | "createdAt" | "updatedAt"> {}

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
        // autoIncrement: true,
        allowNull: false,
        // field: "task_id",
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
        field: "user_id",
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
      // underscored: true,
    }
  );

  return Task;
};

