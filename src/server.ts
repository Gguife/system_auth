import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/router';
import database from '../src/database/config/conn';
import redisClient from './redisClient';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(routes);

redisClient.connect().then(() => {
  console.log('Connected to Redis');
});

database.sync().then(() => {
  console.log(`Database is connected: ${process.env.DB_NAME}`);
}).catch(error =>{
  console.error('Unable to connect to the database:', error)
})

app.listen(8080, () => {
  console.log('Server running on port 8080');
});