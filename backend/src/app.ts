import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Importar las rutas
import productosRoutes from './routes/productos';
import usuariosRoutes from "./routes/usuarios";

// Usar las rutas en la app
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

