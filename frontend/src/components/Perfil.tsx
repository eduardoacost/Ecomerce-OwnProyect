'use client';

import { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  direccion: string;
  rol: string;
  telefono: string;
}

const Perfil = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    _id: '',
    nombre: '',
    email: '',
    direccion: '',
    telefono: '',
    password: '',
  });

  // Obtener información del usuario actual
  const fetchPerfil = async () => {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/perfil', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsuario(data);
      setFormData({ ...data, password: '' }); // Prellenar el formulario con los datos
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      alert('Error al obtener el perfil');
    }
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para actualizar el perfil
  const handleUpdateProfile = async () => {
    if (!formData.nombre || !formData.email) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/usuarios/perfil/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert('Perfil actualizado exitosamente');
      setFormData({ ...data, password: '' });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  useEffect(() => {
    fetchPerfil(); // Cargar la información al inicio
  }, []);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Perfil de Usuario
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Correo"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Nueva Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            '&:hover': { backgroundColor: 'red' },
          }}
          onClick={handleUpdateProfile}
        >
          Actualizar Perfil
        </Button>
      </Box>
    </Box>
  );
};

export default Perfil;
