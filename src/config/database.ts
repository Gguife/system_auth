import { Dialect, Sequelize } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  username: string,
  password: string,
  database: string,
  host: string,
  dialect: Dialect
}

// Verifique se todas as variáveis de ambiente necessárias estão definidas
function checkEnvVariable(envVariable: string | undefined): string {
  if (!envVariable) {
    throw new Error(`Variável de ambiente não definida`);
  }
  return envVariable;
}


const dbConfig: DatabaseConfig = {
    username: checkEnvVariable(process.env.DB_USER),
    password: checkEnvVariable(process.env.DB_PASSWORD),
    database: checkEnvVariable(process.env.DB_NAME),
    host: checkEnvVariable(process.env.DB_HOST),
    dialect: checkEnvVariable(process.env.DB_DIALECT) as Dialect
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  }
);

export default sequelize;