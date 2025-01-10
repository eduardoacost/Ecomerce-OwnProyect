'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface Producto {
  _id: string;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imagen: string;
  stock: number;
}

const ProductosAdmin = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formData, setFormData] = useState({
    _id: '',
    nombre: '',
    categoria: '',
    precio: 0,
    descripcion: '',
    imagen: '',
    stock: 0,
  });
  const [editing, setEditing] = useState(false);

  const fetchProductos = async () => {
    const response = await fetch('http://localhost:5000/api/productos');
    const data = await response.json();
    setProductos(data);
  };

  const handleAddProduct = async () => {
    if (!formData.nombre || !formData.categoria || !formData.precio || !formData.stock) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      alert('Producto agregado exitosamente');
      setFormData({
        _id: '',
        nombre: '',
        categoria: '',
        precio: 0,
        descripcion: '',
        imagen: '',
        stock: 0,
      });
      fetchProductos();
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Error al agregar el producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' });
      alert('Producto eliminado');
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleEditProduct = (producto: Producto) => {
    setFormData(producto);
    setEditing(true);
  };

  const handleUpdateProduct = async () => {
    if (!formData.nombre || !formData.categoria || !formData.precio || !formData.stock) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/productos/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      alert('Producto actualizado exitosamente');
      setFormData({
        _id: '',
        nombre: '',
        categoria: '',
        precio: 0,
        descripcion: '',
        imagen: '',
        stock: 0,
      });
      setEditing(false);
      fetchProductos();
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      {/* Sección para añadir o editar un producto */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {editing ? 'Editar Producto' : 'Añadir Producto'}
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
          label="Categoría"
          name="categoria"
          value={formData.categoria}
          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Imagen URL"
          name="imagen"
          value={formData.imagen}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            '&:hover': { backgroundColor: 'red' },
          }}
          onClick={editing ? handleUpdateProduct : handleAddProduct}
        >
          {editing ? 'Actualizar Producto' : 'Añadir Producto'}
        </Button>
      </Box>

      {/* Tabla de productos con scroll horizontal */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Lista de Productos
      </Typography>
      <TableContainer sx={{ maxHeight: '400px', overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto._id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{ width: '100px', height: 'auto' }}
                  />
                </TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>
                  <IconButton
                    sx={{
                      color: 'black',
                      '&:hover': { color: 'red' },
                    }}
                    onClick={() => handleEditProduct(producto)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: 'black',
                      '&:hover': { color: 'red' },
                    }}
                    onClick={() => handleDeleteProduct(producto._id)}
                  >
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

export default ProductosAdmin;
