const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de salud del servidor
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Arranque del servidor
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });