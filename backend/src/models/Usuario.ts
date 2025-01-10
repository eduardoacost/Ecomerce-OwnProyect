import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  direccion: { type: String, default: '' },
  rol: { type: String, default: 'cliente' },
  telefono: { type: String, default: '' },
});

export default mongoose.model('Usuario', usuarioSchema);

