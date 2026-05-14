# Documento de Arquitectura del Sistema — PQRS SuperMarket

**Proyecto:** Sistema de PQRS SuperMarket  
**Fábrica de Desarrollo:** Konrad  
**Materia:** Ingeniería de Software I  
**Profesor:** Carlos Andrés López  
**Versión:** 1.0  
**Fecha:** Mayo 2026  

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | Mayo 2026 | Juan Camilo Prieto Mestizo | Versión inicial |

---

## 1. Introducción

### 1.1 Propósito

Este documento describe la arquitectura del sistema PQRS de SuperMarket, detallando las decisiones de diseño, la organización en capas, los componentes tecnológicos y la infraestructura de comunicación. Está dirigido al equipo de desarrollo de la Fábrica de Desarrollo Konrad y al cliente SuperMarket como referencia técnica del sistema.

### 1.2 Alcance

El sistema PQRS de SuperMarket contempla dos aplicaciones cliente y un backend compartido:

- **App Móvil** (`app/`): aplicación web responsiva desarrollada con Ionic + Angular, orientada al cliente de SuperMarket para radicar y consultar sus PQRS.
- **Aplicación Web** (`frontend/`): interfaz desarrollada con Angular, orientada al gestor interno de SuperMarket para administrar, filtrar y gestionar todos los radicados.
- **Backend** (`backend/`): API REST desarrollada con Node.js + Express, compartida por ambas aplicaciones cliente.
- **Base de datos** (`base-de-datos/`): motor MySQL gestionado mediante el ORM Sequelize.

### 1.3 Definiciones y acrónimos

| Término | Definición |
|---|---|
| PQRS | Petición, Queja, Reclamo o Sugerencia |
| API REST | Interfaz de programación de aplicaciones bajo el estilo arquitectónico REST |
| ORM | Object-Relational Mapping — mapeo entre objetos del código y tablas de la base de datos |
| JWT | JSON Web Token — mecanismo de autenticación sin estado basado en tokens firmados |
| SMTP | Simple Mail Transfer Protocol — protocolo para el envío de correos electrónicos |
| SPA | Single Page Application — aplicación de una sola página que actualiza el contenido dinámicamente |

---

## 2. Representación Arquitectónica

El sistema sigue una **arquitectura de tres capas** (presentación, lógica de negocio y persistencia), implementada sobre un modelo **cliente-servidor** donde las dos aplicaciones frontend consumen los servicios del backend mediante una API REST con JSON.

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                    │
│                                                             │
│   ┌──────────────────────┐   ┌──────────────────────────┐  │
│   │    App Móvil (app/)  │   │  Aplicación Web           │  │
│   │    Ionic + Angular   │   │  (frontend/) Angular      │  │
│   │    Cliente PQRS      │   │  Gestor PQRS              │  │
│   │    localhost:8100    │   │  localhost:4200            │  │
│   └──────────┬───────────┘   └────────────┬─────────────┘  │
└──────────────│─────────────────────────────│────────────────┘
               │   HTTP/REST + JSON          │
               │   JWT en Authorization      │
               ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE LÓGICA DE NEGOCIO                 │
│                                                             │
│              ┌────────────────────────────┐                 │
│              │   Backend (backend/)        │                 │
│              │   Node.js + Express        │                 │
│              │   localhost:3000           │                 │
│              │                            │                 │
│              │  ┌──────────┐ ┌─────────┐ │                 │
│              │  │ /api/auth│ │/api/pqrs│ │                 │
│              │  └──────────┘ └─────────┘ │                 │
│              │  ┌─────────────────────┐  │                 │
│              │  │  /api/clientes      │  │                 │
│              │  └─────────────────────┘  │                 │
│              │                            │                 │
│              │  Middlewares: JWT, CORS,   │                 │
│              │  Multer (PDF upload)       │                 │
│              │                            │                 │
│              │  Servicio SMTP             │                 │
│              │  (Nodemailer)  ──────────────────► Correo   │
│              └──────────────┬─────────────┘                 │
└─────────────────────────────│───────────────────────────────┘
                              │   Sequelize ORM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PERSISTENCIA                    │
│                                                             │
│              ┌────────────────────────────┐                 │
│              │   Base de Datos            │                 │
│              │   MySQL 8.0               │                 │
│              │                            │                 │
│              │   Tablas: clientes,        │                 │
│              │   pqrs, gestores           │                 │
│              │                            │                 │
│              │   Archivos PDF: /uploads   │                 │
│              └────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Objetivos y Restricciones Arquitectónicas

### 3.1 Objetivos

| Objetivo | Decisión arquitectónica |
|---|---|
| Soportar dos tipos de usuario con interfaces distintas | Dos proyectos frontend independientes (`app/` y `frontend/`) con un backend compartido |
| Seguridad en autenticación | JWT para gestión de sesiones; bcryptjs para cifrado de contraseñas |
| Cero papel y proceso digital | Toda interacción ocurre vía interfaz web; notificaciones por correo electrónico (Nodemailer) |
| Portabilidad entre equipos de desarrollo | Variables de entorno en `.env`; script SQL reproducible en `base-de-datos/` |
| Responsividad móvil | App Móvil construida con Ionic para comportamiento nativo en navegadores móviles |

### 3.2 Restricciones

| ID | Restricción |
|---|---|
| RES-01 | El sistema se despliega en entorno local (localhost). No se contempla despliegue en producción para esta entrega. |
| RES-02 | La base de datos debe ser de licencia libre. Se usa MySQL 8.0. |
| RES-03 | El módulo de gestión de usuarios (crear/editar gestores) no se implementa en la interfaz. Los gestores se crean directamente en BD (SUP-001 del Product Backlog). |
| RES-04 | La "App Móvil" es una aplicación web Angular responsiva con Ionic, no una app nativa (SUP-003 del Product Backlog). |
| RES-05 | Los archivos PDF adjuntos se almacenan en el servidor de archivos (`/uploads`), no en la base de datos como BLOB. |

---

## 4. Vista de Casos de Uso Arquitectónicamente Significativos

Los siguientes casos de uso tienen mayor impacto sobre las decisiones arquitectónicas:

| Caso de uso | Impacto arquitectónico |
|---|---|
| HU-01: Radicar PQRS | Define el flujo principal App Móvil → Backend → BD + envío SMTP |
| HU-03: Envío de correo de confirmación | Requiere integración con servicio SMTP (Nodemailer) en el backend |
| HU-04 / HU-08: Autenticación cliente y gestor | Define la necesidad de JWT y middleware de autorización por rol |
| HU-12: Generación de reporte PDF | Requiere librería de generación PDF en el backend (pdfkit o similar) |
| HU-07: Adjunto de archivo PDF | Define el uso de Multer para manejo de archivos en el backend |

---

## 5. Vista Lógica

### 5.1 Estructura de paquetes del backend

```
backend/
├── config/         ← Configuración de conexión a MySQL (Sequelize)
├── controllers/    ← Lógica de cada endpoint (recibe req, llama al modelo, retorna res)
├── models/         ← Modelos Sequelize: Cliente, PQRS, Gestor
├── routes/         ← Definición de rutas Express (/api/auth, /api/pqrs, /api/clientes)
├── middlewares/    ← Verificación JWT, manejo de errores globales
├── services/       ← Lógica de negocio reutilizable (envío de correo, generación PDF)
├── uploads/        ← Archivos PDF subidos por los clientes
├── .env.example    ← Variables de entorno requeridas (sin valores reales)
└── index.js        ← Punto de entrada: configura Express y arranca el servidor
```

### 5.2 Estructura de paquetes del frontend Angular Web

```
frontend/src/app/
├── auth/           ← Módulo de autenticación del gestor (login)
├── radicados/      ← Módulo de gestión: listado, filtros, cambio de estado, reporte PDF
└── app.routes.ts   ← Definición de rutas de la aplicación
```

### 5.3 Estructura de paquetes de la App Móvil Ionic

```
app/src/app/
├── pages/
│   ├── login/      ← Pantalla de autenticación del cliente (HU-04)
│   ├── radicacion/ ← Formulario de radicación de PQRS (HU-01)
│   └── listado/    ← Consulta y filtrado de radicados propios (HU-05, HU-06)
└── app.routes.ts   ← Definición de rutas de la aplicación Ionic
```

### 5.4 Modelos de datos principales

```
Cliente
├── id (PK)
├── tipo_identificacion
├── numero_identificacion (UNIQUE)
├── nombre_completo
├── correo_electronico
├── telefono_movil
└── password (bcrypt)

PQRS
├── id (PK)
├── numero_radicado (UNIQUE, autogenerado)
├── fecha_radicado (autogenerada)
├── tipo (P/Q/R/S)
├── comentarios
├── ruta_anexo (nullable)
├── estado (Nuevo/En proceso/Resuelto/Rechazado)
├── justificacion_estado (nullable)
└── cliente_id (FK → Cliente)

Gestor
├── id (PK)
├── usuario (UNIQUE)
└── password (bcrypt)
```

---

## 6. Vista de Procesos

### Flujo principal: Radicación de PQRS por cliente nuevo

```
Cliente (App Móvil)          Backend (Node.js)           Base de Datos (MySQL)
        │                           │                             │
        │── POST /api/pqrs ────────►│                             │
        │   {datos + PDF opcional}  │                             │
        │                           │── ¿Existe cliente? ────────►│
        │                           │◄── No existe ───────────────│
        │                           │── INSERT cliente ──────────►│
        │                           │── INSERT pqrs ─────────────►│
        │                           │◄── OK ──────────────────────│
        │                           │                             │
        │                           │── Enviar correo (SMTP) ────►│ Nodemailer
        │◄── 201 Created ───────────│                             │
        │    {numero_radicado}      │                             │
```

### Flujo de autenticación y consulta

```
Usuario (App/Web)            Backend (Node.js)           Base de Datos (MySQL)
        │                           │                             │
        │── POST /api/auth/login ──►│                             │
        │   {id, password}          │── SELECT usuario ──────────►│
        │                           │◄── Registro ────────────────│
        │                           │── bcrypt.compare()          │
        │◄── 200 OK ────────────────│                             │
        │    {token JWT}            │                             │
        │                           │                             │
        │── GET /api/pqrs ─────────►│                             │
        │   Authorization: Bearer   │── Middleware verifyJWT      │
        │                           │── SELECT pqrs ─────────────►│
        │◄── 200 OK ────────────────│◄── Resultados ──────────────│
        │    {listado PQRS}         │                             │
```

---

## 7. Vista de Despliegue (Infraestructura local)

```
┌─────────────────────────────────────────────────────┐
│              Máquina de Desarrollo (localhost)       │
│                                                      │
│  ┌─────────────────┐    ┌────────────────────────┐  │
│  │  Navegador Web  │    │  Navegador Móvil        │  │
│  │  (Chrome/Edge)  │    │  (Chrome Android /      │  │
│  │                 │    │   Safari iOS)            │  │
│  │  Angular Web    │    │  Ionic App               │  │
│  │  :4200          │    │  :8100                   │  │
│  └────────┬────────┘    └───────────┬─────────────┘  │
│           │                         │                 │
│           └──────────┬──────────────┘                 │
│                      │ HTTP REST / JSON               │
│                      ▼                                │
│           ┌──────────────────────┐                   │
│           │  Node.js + Express   │                   │
│           │  :3000               │                   │
│           │                      │                   │
│           │  Multer (PDF)        │                   │
│           │  Nodemailer (SMTP)──────────► Gmail/SMTP │
│           │  JWT Auth            │                   │
│           └──────────┬───────────┘                   │
│                      │ Sequelize ORM                 │
│                      ▼                                │
│           ┌──────────────────────┐                   │
│           │  MySQL 8.0           │                   │
│           │  :3306               │                   │
│           │                      │                   │
│           │  DB: pqrs_supermarket│                   │
│           └──────────────────────┘                   │
│                                                      │
│  /backend/uploads/   ← PDFs adjuntos                 │
└─────────────────────────────────────────────────────┘
```

---

## 8. Vista de Implementación

### 8.1 Stack tecnológico completo

| Capa | Tecnología | Versión | Rol |
|---|---|---|---|
| App Móvil | Ionic + Angular | Ionic 7 / Angular 17+ | Interfaz responsiva para el cliente |
| Aplicación Web | Angular | 17+ | Interfaz de gestión para el gestor PQRS |
| Backend | Node.js + Express | Node 18+ | Servidor API REST |
| ORM | Sequelize | 6.x | Mapeo objeto-relacional sobre MySQL |
| Base de datos | MySQL | 8.0 | Persistencia de clientes, PQRS y gestores |
| Autenticación | jsonwebtoken + bcryptjs | — | JWT para sesiones, bcrypt para contraseñas |
| Correo | Nodemailer | — | Envío de confirmación y credenciales |
| Archivos | Multer | — | Recepción y almacenamiento de PDF adjuntos |
| Variables de entorno | dotenv | — | Configuración sin exponer credenciales |
| CORS | cors | — | Permite peticiones desde :4200 y :8100 hacia :3000 |

### 8.2 Comunicación entre capas

Todas las peticiones entre los frontends y el backend se realizan mediante **HTTP REST con JSON**. La autenticación se maneja con **JWT** enviado en el header `Authorization: Bearer <token>`. Los endpoints siguen la siguiente estructura:

| Grupo | Ruta base | Responsabilidad |
|---|---|---|
| Autenticación | `/api/auth` | Login de clientes y gestores |
| PQRS | `/api/pqrs` | Radicación, consulta, filtrado y cambio de estado |
| Clientes | `/api/clientes` | Registro y verificación de existencia |

---

## 9. Tamaño y Rendimiento

| Criterio | Meta |
|---|---|
| Tiempo de respuesta de la API en operaciones normales | < 5 segundos (RNF-13) |
| Tiempo de autenticación | < 3 segundos (RNF-13) |
| Generación de reporte PDF (hasta 500 radicados) | < 10 segundos (RNF-15) |
| Tamaño máximo de archivo PDF adjunto | 5 MB (RNF-22) |

---

## 10. Calidad

| Atributo | Mecanismo implementado |
|---|---|
| Seguridad | JWT para autenticación, bcryptjs para contraseñas, validación de roles por middleware |
| Mantenibilidad | Arquitectura en capas, separación de responsabilidades por carpetas, variables de entorno |
| Portabilidad | Script SQL reproducible, `.env.example` documentado, `npm install` por componente |
| Disponibilidad | Manejo de errores en todos los endpoints con códigos HTTP apropiados |
| Trazabilidad | Número de radicado autogenerado, fecha inmutable, historial de cambios de estado con justificación y responsable |

---

## 11. Control de versiones del documento

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | Mayo 2026 | Juan Camilo Prieto Mestizo | Versión inicial del documento de arquitectura |