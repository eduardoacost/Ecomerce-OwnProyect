import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: String,
  imagen: String,
  stock: { type: Number, required: true },
});

export default mongoose.model('Producto', productoSchema);
