import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface Producto {
  _id: string;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

const MainView: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState<string>(''); // Categoría seleccionada
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null); // Producto seleccionado para modal

  // Fetch de productos desde el backend
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Productos con la categoría "Descuentos"
  const productosConDescuento = productos.filter(
    (producto) => producto.categoria === 'Descuentos'
  );

  // Productos excluyendo los que tienen la categoría "Descuentos"
  const productosSinDescuento = productos.filter(
    (producto) => producto.categoria !== 'Descuentos'
  );

  // Manejar cambio de categoría
  const handleCategoriaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(event.target.value);
  };

  // Filtrar productos por categoría seleccionada
  const productosFiltrados = categoria
    ? productosSinDescuento.filter((producto) => producto.categoria === categoria)
    : productosSinDescuento;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Carrusel independiente */}
      <div className="mb-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Productos en Descuento
        </h2>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={4}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          className="rounded-lg shadow-md"
        >
          {productosConDescuento.map((producto) => {
            const precioDescuento = (producto.precio * 0.75); // 25% del precio original
            return (
              <SwiperSlide key={producto._id}>
                <div
                  className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-60 h-auto"
                  onClick={() => setSelectedProducto(producto)}
                >
                  <img
                    src={producto.imagen || 'https://via.placeholder.com/300'}
                    alt={producto.nombre}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                    <p className="text-red-500 font-bold">
                      Descuento: ${precioDescuento}
                    </p>
                    <p className="text-gray-600 line-through">${producto.precio}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Filtro de categorías */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Filtrar por Categoría</h2>
        <select
          value={categoria}
          onChange={handleCategoriaChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Todas las Categorías</option>
          <option value="Comida Rapida">Comida Rápida</option>
          <option value="Arroces">Arroces</option>
          <option value="Postres">Postres</option>
        </select>
      </div>

      {/* Tarjetas de productos filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productosFiltrados.map((producto) => (
          <div
            key={producto._id}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-60 mx-auto"
            onClick={() => setSelectedProducto(producto)}
          >
            <img
              src={producto.imagen || 'https://via.placeholder.com/300'}
              alt={producto.nombre}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{producto.nombre}</h3>
              <p className="text-gray-600">${producto.precio}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para mostrar detalles del producto */}
      {selectedProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <img
              src={selectedProducto.imagen || 'https://via.placeholder.com/300'}
              alt={selectedProducto.nombre}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{selectedProducto.nombre}</h3>
            <p className="text-gray-700 mb-4">{selectedProducto.descripcion}</p>
            {selectedProducto.categoria === 'Descuentos' ? (
              <>
                <p className="text-red-500 font-bold mb-2">
                  Precio con descuento: ${(selectedProducto.precio * 0.25).toFixed(2)}
                </p>
                <p className="text-gray-600 line-through">
                  Precio original: ${selectedProducto.precio}
                </p>
              </>
            ) : (
              <p className="text-gray-900 font-bold mb-4">
                Precio: ${selectedProducto.precio}
              </p>
            )}
            <button
              onClick={() => setSelectedProducto(null)}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainView;
