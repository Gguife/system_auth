import { Model, DataTypes, Optional } from "sequelize";
import { UserInterface } from "../../interfaces/global";
import connection from "../config/conn";

// Interface que define os atributos do modelo durante a criacao
interface UserCreationAttributes extends Optional<UserInterface, 'id' | 'createdAt' | 'updatedAt'>{}

//Definicao do modelo de usuário
class UserModel extends Model<UserInterface, UserCreationAttributes> implements UserInterface{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  //Timestamps 
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}


UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email:{
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password:{
      type: DataTypes.STRING(100),
      allowNull: false
    },
    createdAt:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'users',
    sequelize: connection,
    timestamps: true
  }
);

export default UserModel;