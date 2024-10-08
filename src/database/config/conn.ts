import { Sequelize } from 'sequelize';
import { DB_NAME, DB_PASSWORD, DB_USER } from '../../interfaces/configs';

let sequelizeConnection: Sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: 'mysql',
  dialect: 'mysql',
  port: 3306, 
});

export default sequelizeConnection;