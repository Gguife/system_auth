import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/router';
import database from '../src/database/config/conn';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

database.sync().then(() => {
  console.log(`Database is connected: ${process.env.DB_NAME}`);
}).catch(error =>{
  console.error('Unable to connect to the database:', error)
})

app.listen(8080, () => {
  console.log('Server running on port 8080');
});