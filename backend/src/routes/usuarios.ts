import { Router, Request, Response } from 'express';
import Usuario from '../models/Usuario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = Router();

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
interface DecodedToken {
  id: string;
}

// Registro de usuario
router.post('/register', (req: Request, res: Response) => {
  const { nombre, email, password, direccion,telefono, rol } = req.body;

  // Verifica si el usuario ya existe
  Usuario.findOne({ email })
    .then((usuarioExistente) => {
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }

      // Hashear la contraseña
      bcrypt.hash(password, 10) // 10 es el número de rondas de sal
        .then((hashedPassword) => {
          // Crear un nuevo usuario
          const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: hashedPassword,
            direccion,
            telefono,
            rol: rol || 'cliente',
          });

          // Guardar en la base de datos
          nuevoUsuario.save()
            .then(() => {
              return res.status(201).json({ message: 'Usuario registrado exitosamente' });
            })
            .catch((error) => {
              console.error(error);
              return res.status(500).json({ message: 'Error al guardar el usuario' });
            });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ message: 'Error al hashear la contraseña' });
        });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'Error al verificar si el usuario existe' });
    });
});

// Inicio de sesión
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Buscar al usuario por su email
  Usuario.findOne({ email })
    .then((usuario) => {
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Comparar contraseñas
      bcrypt.compare(password, usuario.password)
        .then((esValido) => {
          if (!esValido) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
          }

          // Generar un token JWT
          const token = jwt.sign(
            { id: usuario._id.toString(), email: usuario.email, rol: usuario.rol, userName: usuario.nombre },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '1h' }
          );

          return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ message: 'Error al comparar las contraseñas' });
        });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'Error al buscar el usuario' });
    });
});

// Obtener todos los usuarios
router.get('/', (req: Request, res: Response) => {
  Usuario.find()
    .then((usuarios) => {
      res.status(200).json(usuarios); // Retorna todos los usuarios
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    });
});

// Actualizar un usuario (sin permitir cambiar la contraseña)
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, direccion, telefono, rol } = req.body;

  new Promise<void>((resolve, reject) => {
    if (!isValidObjectId(id)) {
      return reject(new Error('ID de producto no válido'));
    }
    resolve();
  })
    .then(() => {
      // Si el ID es válido, actualizamos el producto
      return Usuario.findByIdAndUpdate(id, req.body, { new: true });
    })
  // Crear un objeto con los campos que pueden ser modificados (sin contraseña)
  const updatedData = { nombre, email, direccion, telefono, rol };

  Usuario.findByIdAndUpdate(id, updatedData, { new: true })
    .then((usuarioActualizado) => {
      if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(usuarioActualizado);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    });
});

// Eliminar un usuario
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
      return Usuario.findByIdAndDelete(id);
    })
    .then((usuarioEliminado) => {
      if (!usuarioEliminado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado con éxito' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el usuario' });
    });
});

router.get('/perfil', (req: Request, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extraemos el token del encabezado

  // Verificar si el token existe dentro de una promesa
  new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('No autorizado'));
    } else {
      jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, decoded: any) => {
        if (err) {
          reject(new Error('Token inválido'));
        } else {
          resolve(decoded); // Si el token es válido, resolvemos con los datos decodificados
        }
      });
    }
  })
    .then((decoded: any) => {
      // Realizamos una verificación del tipo de 'decoded' utilizando un type assertion
      const decodedToken = decoded as { id: string }; // Aquí aseguramos que 'decoded' tiene el campo 'id'

      new Promise<void>((resolve, reject) => {
        if (!isValidObjectId(decodedToken.id)) {
          return reject(new Error('ID de producto no válido'));
        }
        resolve();
      })
        .then(() => {
          // Si el ID es válido, eliminamos el producto
          return Usuario.findById(decodedToken.id);
        })
        .then((usuario) => {
          if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
          }
          return res.status(200).json(usuario); // Retorna la información del usuario
        })
        .catch((error) => {
          console.error(error);
          if (error.message === 'No autorizado') {
            return res.status(401).json({ message: 'No autorizado' });
          }
          if (error.message === 'Token inválido') {
            return res.status(403).json({ message: 'Token inválido' });
          }
          return res.status(500).json({ message: 'Error al obtener el usuario' });
        });
    })
    .catch((error) => {
      console.error(error);
      if (error.message === 'No autorizado') {
        return res.status(401).json({ message: 'No autorizado' });
      }
      if (error.message === 'Token inválido') {
        return res.status(403).json({ message: 'Token inválido' });
      }
      return res.status(500).json({ message: 'Error al obtener el usuario' });
    });
});

router.put('/perfil/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, direccion, telefono, rol, password } = req.body;

  new Promise<void>((resolve, reject) => {
    if (!isValidObjectId(id)) {
      return reject(new Error('ID de producto no válido'));
    }
    resolve();
  })
    .then(() => {
      // Crear un objeto con los campos que pueden ser modificados
      const updatedData: any = { nombre, email, direccion, telefono, rol };

      // Si se incluye una nueva contraseña, la hasheamos antes de actualizar
      if (password) {
        return bcrypt.hash(password, 10).then((hashedPassword) => {
          updatedData.password = hashedPassword;
          return Usuario.findByIdAndUpdate(id, updatedData, { new: true });
        });
      }

      // Si no hay contraseña, solo actualizamos los demás campos
      return Usuario.findByIdAndUpdate(id, updatedData, { new: true });
    })
    .then((usuarioActualizado) => {
      if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(usuarioActualizado);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    });
});









export default router;
