import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/router';
import database from '../src/database/config/conn';

dotenv.config();

const app = express();
app.use(routes);
app.use(cors);

database.sync().then(() => {
  console.log(`Database is connected: ${process.env.DB_NAME}`);
}).catch(error =>{
  console.error('Unable to connect to the database:', error)
})

app.listen(8080, () => 'Server running on port 8080');