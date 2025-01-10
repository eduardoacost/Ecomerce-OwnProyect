import { Router, Request, Response } from 'express';
import Producto from '../models/Producto'; // Modelo de Producto de Mongoose
import mongoose from 'mongoose';
const router = Router();
// Validación de ObjectId
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Crear un nuevo producto
router.post('/', (req: Request, res: Response) => {
  const { nombre, categoria, precio, descripcion, imagen, stock } = req.body;

  // Verifica si los campos necesarios están presentes
  new Promise<void>((resolve, reject) => {
    if (!nombre || !categoria || !precio || !stock) {
      return reject(new Error('Todos los campos son obligatorios'));
    }
    resolve();
  })
    .then(() => {
      // Crear el nuevo producto
      const nuevoProducto = new Producto({
        nombre,
        categoria,
        precio,
        descripcion,
        imagen,
        stock,
      });

      // Guardar el producto en la base de datos
      return nuevoProducto.save();
    })
    .then((producto) => {
      return res.status(201).json(producto); // Retorna el producto creado
    })
    .catch((error) => {
      console.error(error);
      return res.status(400).json({ message: error.message || 'Error al crear el producto' });
    });
});


// Obtener todos los productos
router.get('/', (req: Request, res: Response) => {
  Producto.find()
    .then((productos) => {
      res.status(200).json(productos); // Retorna la lista de productos
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los productos' });
    });
});

/// Eliminar un producto por ID
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar si el ID es válido usando Promesa
  new Promise<void>((resolve, reject) => {
    if (!isValidObjectId(id)) {
      return reject(new Error('ID de producto no válido'));
    }
    resolve();
  })
    .then(() => {
      // Si el ID es válido, eliminamos el producto
      return Producto.findByIdAndDelete(id);
    })
    .then((productoEliminado) => {
      if (!productoEliminado) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      return res.status(200).json({ message: 'Producto eliminado con éxito' });
    })
    .catch((error) => {
      console.error(error);
      return res.status(400).json({ message: error.message || 'Error al eliminar el producto' });
    });
});

// Actualizar un producto por ID
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Verificar si el ID es válido usando Promesa
  new Promise<void>((resolve, reject) => {
    if (!isValidObjectId(id)) {
      return reject(new Error('ID de producto no válido'));
    }
    resolve();
  })
    .then(() => {
      // Si el ID es válido, actualizamos el producto
      return Producto.findByIdAndUpdate(id, req.body, { new: true });
    })
    .then((productoActualizado) => {
      if (!productoActualizado) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      return res.status(200).json(productoActualizado);
    })
    .catch((error) => {
      console.error(error);
      return res.status(400).json({ message: error.message || 'Error al actualizar el producto' });
    });
});

export default router;
