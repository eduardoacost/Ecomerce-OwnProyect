"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/usuarios.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
// Aquí puedes definir las rutas que manejarán la funcionalidad de los usuarios
// Ejemplo de ruta para obtener todos los usuarios
router.get('/', (req, res) => {
    res.send('Aquí van los usuarios');
});
// Más rutas según sea necesario, por ejemplo, para registrar o iniciar sesión
exports.default = router;
