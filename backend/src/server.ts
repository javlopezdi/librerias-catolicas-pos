import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (sin opciones obsoletas)
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/libreriasdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req: Request, res: Response) => {
  res.send('Backend MEAN con TypeScript y Docker funcionando!');
});

const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));