import { Model, DataTypes, Optional } from "sequelize";
import connection from "../config/conn";

class SessionModel extends Model {
  public id!: string;
  public data!: string;
  public expires!: Date;
}

SessionModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    date: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize: connection,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: false
  }
)

export default SessionModel;