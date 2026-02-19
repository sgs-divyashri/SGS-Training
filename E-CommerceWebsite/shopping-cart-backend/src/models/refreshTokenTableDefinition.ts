import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface RefreshTokenPayload {
  token: string;
  userId: number;
  revokedAt: Date | null;
  expiresAt?: Date;
}

export type RefreshTokenCreationAttributes = RefreshTokenPayload;

export class RefreshToken
  extends Model<RefreshTokenPayload, RefreshTokenCreationAttributes>
  implements RefreshTokenPayload
{
  public token!: string;
  public userId!: number;
  public revokedAt!: Date;
  public expiresAt!: Date;
}

export default (sequelize: Sequelize) => {
  RefreshToken.init(
    {
      token: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "refreshToken",
      timestamps: false
    },
  );

  return RefreshToken;
};
