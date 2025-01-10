'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';


export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLogin, setIsLogin] = useState(true); // Alternar entre login y registro
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [userName, setUserName] = useState(''); // Para almacenar el nombre del usuario
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si está logueado
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  const images = [
    '/images/chicken-fajita-chicken-fillet-fried-with-bell-pepper-lavash-with-bread-slices-white-plate.jpg',
    '/images/meat-burger-with-french-fries-side-view.jpg',
    '/images/delicious-goulash-stew-table.jpg',
    '/images/side-view-spaghetti-with-pieces-meat-tomato-wooden-board.jpg',
  ];

  // Cambiar la imagen de fondo cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Verificar si el usuario está logueado en el localStorage

  const handleToggle = () => setIsLogin(!isLogin);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(''); // Limpiar mensaje de error cuando se hace un cambio
  };

  const validateInputs = () => {
    // Validación de campos vacíos
    if (!formData.email || !formData.password || (isLogin && !formData.email)) {
      setErrorMessage('Por favor, complete todos los campos.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return; // Si los inputs no son válidos, no continuar

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Registro exitoso, Por favor inicia sesión');
        setIsLogin(true); // Cambiar a la vista de login
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error al registrarse');
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) return; // Si los inputs no son válidos, no continuar

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Almacenar el token

        // Decodificar el token para obtener el userName
        const token = data.token;
        const userData = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del JWT

        // Almacenar el userName en el localStorage
        localStorage.setItem('userName', userData.userName);
        localStorage.setItem('rol', userData.rol);
        setUserRole(userData.rol);
        setUserName(userData.userName); // Cargar el nombre del usuario
        setIsLoggedIn(true); // Marcar al usuario como logueado
        alert('Inicio de sesión exitoso');
        router.push('/productos');
      } else {
        setErrorMessage(data.message); // Mostrar el mensaje de error
      }
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div
        className="relative w-full max-w-6xl flex rounded-lg shadow-2xl"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex-1 bg-black opacity-75 flex items-center justify-center text-white p-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Bienvenido a Food`s Snacks</h1>
            <p className="text-xl mb-8">Explora nuestra selección de productos deliciosos.</p>
          </div>
        </div>

        <div className="flex-1 bg-white p-12 rounded-lg shadow-lg">
          <div className="space-y-6">
            {isLogin ? (
              <div>
                <h2 className="text-3xl font-bold mb-6">Iniciar Sesión</h2>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-6 py-3 border rounded-lg shadow-md"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-lg font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-6 py-3 border rounded-lg shadow-md"
                  />
                </div>
                {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                <button
                  onClick={handleLogin}
                  className="w-full py-4 bg-black text-white rounded-lg text-lg border-2 border-black shadow-md hover:bg-red-600 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Iniciar Sesión
                </button>
                <p className="mt-6 text-lg">
                  ¿No tienes cuenta?{' '}
                  <span
                    onClick={handleToggle}
                    className="text-blue-500 cursor-pointer"
                  >
                    Regístrate aquí
                  </span>
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-6">Crear Cuenta</h2>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-lg font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-6 py-3 border rounded-lg shadow-md"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-6 py-3 border rounded-lg shadow-md"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-lg font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-2 block w-full px-6 py-3 border rounded-lg shadow-md"
                  />
                </div>
                {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                <button
                  onClick={handleRegister}
                  className="w-full py-4 bg-black text-white rounded-lg text-lg border-2 border-black shadow-md hover:bg-red-600 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Registrarse
                </button>
                <p className="mt-6 text-lg">
                  ¿Ya tienes cuenta?{' '}
                  <span
                    onClick={handleToggle}
                    className="text-blue-500 cursor-pointer"
                  >
                    Inicia sesión aquí
                  </span>
                </p>
              </div>
            )}
            <div className="space-y-6 mt-8">
              <Link href="/productos">
                <div className="block w-full py-4 bg-black text-white rounded-lg text-lg text-center border-2 border-black shadow-lg hover:bg-red-600 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                  Seguir sin Iniciar Sesión
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
