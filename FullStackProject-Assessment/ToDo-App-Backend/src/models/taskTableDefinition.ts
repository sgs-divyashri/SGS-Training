import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./userTableDefinition";

export interface TaskPayload {
  taskId: string;
  taskName: string;
  description?: string;
  status?: string;
  assignedTo: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes extends Optional<
  TaskPayload,
  "taskId" | "status" | "isActive" | "createdAt" | "updatedAt"
> {}

export class Task
  extends Model<TaskPayload, TaskCreationAttributes>
  implements TaskPayload
{
  public taskId!: string;
  public taskName!: string;
  public description!: string;
  public status!: string;
  public assignedTo!: string;
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
        type: DataTypes.ENUM("To-Do", "In-Progress", "Done"),
        defaultValue: "To-Do",
      },
      assignedTo: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "userId",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "tasks",
      timestamps: true,
    },
  );

  return {
    Task,
    associate: (sequelize: Sequelize) => {
      Task.belongsTo(User, { foreignKey: "assignedTo", targetKey: "userId" });
    },
  };
};
