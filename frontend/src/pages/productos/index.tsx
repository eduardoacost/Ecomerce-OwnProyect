'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button, Divider, IconButton, Typography, Box, Drawer } from '@mui/material';
import { ShoppingCart, Person, LocalShipping, CardGiftcard, ExitToApp, Home, Discount, Info, ContactMail, AccountCircle, WhatsApp, Instagram, Inventory, Group } from '@mui/icons-material';
import '../../app/globals.css';
import ProductosAdmin from '../../components/ProductosAdmin';
import UsuariosAdmin from '../../components/UsuariosAdmin';
import Perfil from '../../components/Perfil';
import MainView from '../../components/Mainview';

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [selectedPage, setSelectedPage] = useState('home');

    // Verificar si hay un token en localStorage (indicación de usuario logueado)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('rol');
        if (token && storedUserName && storedUserRole) {
            setIsLoggedIn(true);
            setUserName(storedUserName);
            setUserRole(storedUserRole); // Cargar el nombre del usuario
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('rol');
        setSelectedPage('home');
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-white text-black font-semibold p-4 flex justify-between items-center shadow-md">
                <div className="text-3xl font-bold text-red-600">Food's Snacks</div>
                <div className="flex space-x-6">
                    <Link href="/productos" passHref>
                        <div
                            className={`cursor-pointer ${activeTab === 'home' ? 'border-b-2 border-red-600 w-24' : 'border-b-2 border-transparent'}`}
                            onClick={() => {
                                setActiveTab('home');
                                setSelectedPage('home');
                            }}
                        >
                            <Home sx={{ marginRight: 1, color: 'red' }} /> Home
                        </div>
                    </Link>
                    <Link href="/promotions" passHref>
                        <div
                            className={`cursor-pointer ${activeTab === 'promotions' ? 'border-b-2 border-red-600 w-24' : 'border-b-2 border-transparent'}`}
                            onClick={() => setActiveTab('promotions')}
                        >
                            <Discount sx={{ marginRight: 1, color: 'red' }} /> Promociones
                        </div>
                    </Link>
                    <Link href="/about" passHref>
                        <div
                            className={`cursor-pointer ${activeTab === 'about' ? 'border-b-2 border-red-600 w-24' : 'border-b-2 border-transparent'}`}
                            onClick={() => setActiveTab('about')}
                        >
                            <Info sx={{ marginRight: 1, color: 'red' }} /> Acerca de Nosotros
                        </div>
                    </Link>
                    <Link href="/contact" passHref>
                        <div
                            className={`cursor-pointer ${activeTab === 'contact' ? 'border-b-2 border-red-600 w-24' : 'border-b-2 border-transparent'}`}
                            onClick={() => setActiveTab('contact')}
                        >
                            <ContactMail sx={{ marginRight: 1, color: 'red' }} /> Contáctanos
                        </div>
                    </Link>
                </div>
                <IconButton color="inherit">
                    <ShoppingCart sx={{ fontSize: 30 }} />
                </IconButton>
            </header>

            {/* Sidebar */}
            <div className="flex flex-1">
                <div className="w-64 bg-black text-white p-6 space-y-6"> {/* Añadido espacio entre las opciones */}
                    {isLoggedIn ? (
                        <>
                            <div className="flex items-center font-semibold">
                                <AccountCircle sx={{ marginRight: 1 }} />
                                <span>{userName}</span>
                            </div> {/* Mostrar el nombre del usuario */}
                            <Link href="/pedidos" passHref>
                                <div className="flex items-center space-x-2 space-y-6">
                                    <LocalShipping sx={{ marginTop: 3, marginRight: 1 }} /> <span>Mis Pedidos</span>
                                </div>
                            </Link>

                            <div className="flex items-center space-x-2 space-y-1  cursor-pointer" onClick={() => setSelectedPage('perfil')}>
                                <Person sx={{ marginRight: 1 }} /> <span>Perfil</span>
                            </div>

                            <Link href="/cupones" passHref>
                                <div className="flex items-center space-x-2 space-y-6">
                                    <CardGiftcard sx={{ marginTop: 3, marginRight: 1 }} /> <span>Cupones</span>
                                </div>
                            </Link>
                            {/* Mostrar opciones solo para admins */}
                            {userRole === 'admin' && (
                                <>

                                    <div className="flex items-center space-x-2 space-y-1 cursor-pointer" onClick={() => setSelectedPage('productosadmin')}>
                                        <Inventory sx={{ marginRight: 1 }} /> <span>Productos</span>
                                    </div>


                                    <div className="flex items-center space-x-2 space-y-1 cursor-pointer" onClick={() => setSelectedPage('usuariosadmin')}>
                                        <Group sx={{ marginRight: 1 }} /> <span>Usuarios</span>
                                    </div>

                                </>
                            )}
                            <Link href="/" passHref>
                                <div
                                    className="flex items-center space-x-2 text-red-500 cursor-pointer space-y-6"
                                    onClick={handleLogout}
                                >
                                    <ExitToApp sx={{ marginTop: 3, marginRight: 1 }} /> <span>Cerrar Sesión</span>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <Link href="/" passHref>
                            <div className="flex items-center space-x-2 text-blue-500 cursor-pointer">
                                <Person /> <span>Iniciar Sesión</span>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Main content */}
                <div className="flex-1 p-8 bg-gray-100">

                    {selectedPage === 'home' && <MainView />}
                    {/* Renderizar el componente ProductosAdmin solo cuando se seleccione "Productos" */}
                    {selectedPage === 'perfil' && <Perfil />}
                    {selectedPage === 'productosadmin' && <ProductosAdmin />}
                    {selectedPage === 'usuariosadmin' && <UsuariosAdmin />}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white text-black font-semibold p-4 flex justify-between items-center">
                <div className="flex space-x-4">
                    <IconButton color="inherit">
                        <Instagram />
                    </IconButton>
                    <IconButton color="inherit">
                        <WhatsApp />
                    </IconButton>
                </div>
                <div className="text-sm">© 2025 Food's Snacks. Todos los derechos reservados.</div>
            </footer>
        </div>
    );
}
