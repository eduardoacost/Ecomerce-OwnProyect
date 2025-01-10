'use client';

import { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
  rol: string;
}

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState({
    _id: '',
    nombre: '',
    email: '',
    direccion: '',
    telefono: '',
    rol: 'cliente',
    password: '', // Añadido campo para la contraseña
  });
  const [editing, setEditing] = useState(false);

  // Obtener usuarios desde el backend
  const fetchUsuarios = async () => {
    const response = await fetch('http://localhost:5000/api/usuarios');
    const data = await response.json();
    setUsuarios(data);
  };

  // Llamar a la API para crear un usuario
  const handleAddUser = async () => {
    if (!formData.nombre || !formData.email || !formData.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert('Usuario agregado exitosamente');
      setFormData({ _id: '', nombre: '', email: '', direccion: '', telefono: '', rol: 'cliente', password: '' });
      fetchUsuarios();
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      alert('Error al agregar el usuario');
    }
  };

  // Función para editar un usuario
  const handleEditUser = (usuario: Usuario) => {
    setFormData({ ...usuario, password: '' }); // No permitimos editar la contraseña
    setEditing(true);
  };

  // Función para actualizar un usuario
  const handleUpdateUser = async () => {
    if (!formData.nombre || !formData.email) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert('Usuario actualizado exitosamente');
      setFormData({ _id: '', nombre: '', email: '', direccion: '', telefono: '', rol: 'cliente', password: '' });
      setEditing(false);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Error al actualizar el usuario');
    }
  };

  // Eliminar un usuario
  const handleDeleteUser = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
      alert('Usuario eliminado');
      fetchUsuarios();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {editing ? 'Editar Usuario' : 'Añadir Usuario'}
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Correo"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {!editing && (
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        )}
        <TextField
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Telefono"
          name="telefono"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Rol"
          name="rol"
          value={formData.rol}
          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            '&:hover': { backgroundColor: 'red' },
          }}
          onClick={editing ? handleUpdateUser : handleAddUser}
        >
          {editing ? 'Actualizar Usuario' : 'Añadir Usuario'}
        </Button>
      </Box>

      {/* Lista de usuarios */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Lista de Usuarios
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario._id}>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.direccion}</TableCell>
                <TableCell>{usuario.telefono}</TableCell>
                <TableCell>{usuario.rol}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditUser(usuario)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteUser(usuario._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsuariosAdmin;
