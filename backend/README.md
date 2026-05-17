# Backend — PQRS SuperMarket

API REST construida con Node.js + Express + Sequelize sobre MySQL.

## Requisitos previos

- Node.js 18 o superior
- MySQL 8.0 o superior
- pnpm 11 o superior
- Una base de datos creada con el nombre `pqrs_supermarket`

## Configuración

1. Copia el archivo de variables de entorno:
   cp .env.example .env

2. Edita `.env` con tus credenciales de MySQL y correo.

## Instalación

pnpm install

## Correr el servidor

pnpm start

El servidor queda disponible en http://localhost:3000

## Verificar que funciona

GET http://localhost:3000/health
Respuesta esperada: { "status": "ok" }