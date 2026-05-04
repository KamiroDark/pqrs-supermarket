# Product Backlog — Sistema PQRS SuperMarket

**Proyecto:** Implementación Sistema de PQRS  
**Cliente:** SuperMarket  
**Fábrica de desarrollo:** Fábrica de Desarrollo Konrad *(nombre por definir con el equipo)*  
**Materia:** Ingeniería de Software I  
**Profesor:** Carlos Andrés López  
**Fecha de elaboración:** 20 de abril de 2026  
**Versión:** 1.0

---

## 1. Introducción

El presente Product Backlog recoge la totalidad de las Historias de Usuario (HU) identificadas para el sistema PQRS de SuperMarket, priorizadas mediante el método MoSCoW. Este documento es la fuente única de verdad sobre lo que el sistema debe hacer y sirve como base para la planeación de cada Sprint.

---

## 2. Actores del sistema

| Actor | Descripción |
|---|---|
| **Cliente** | Usuario externo que radica y consulta sus PQRS a través de la aplicación. |
| **Gestor PQRS** | Usuario interno de SuperMarket que administra y gestiona las PQRS radicadas. |
| **Sistema** | Acciones automáticas ejecutadas sin intervención directa del usuario (envío de correos, generación de contraseñas, validaciones). |

---

## 3. Supuestos del proyecto

Dado que el enunciado no especifica ciertos aspectos técnicos, el equipo define los siguientes supuestos. Cada supuesto está justificado con base en el stack tecnológico elegido y las restricciones de tiempo del proyecto.

| ID | Supuesto | Justificación |
|---|---|---|
| **SUP-001** | El módulo de gestión de usuarios **no se implementará en código**. Los gestores PQRS se crearán directamente en la base de datos. | Indicación sugerida por el Scrum Owner dado el tiempo disponible del proyecto. Puede catalogarse como un MVP de ultimo nivel. |
| **SUP-002** | Los archivos adjuntos (PDF) subidos por el cliente se almacenarán en el **servidor de archivos** (carpeta `/uploads`), no en la base de datos como BLOB. | Más sencillo con Node.js. Evita inflar la BD y simplifica la descarga. |
| **SUP-003** | La "App Móvil" requerida en el enunciado se implementará como una **aplicación web Angular responsiva**, funcional en navegadores móviles, en lugar de una app nativa o híbrida (Ionic/React Native). | Reduce complejidad de configuración. No requiere Android SDK ni emulador. El equipo tiene dominio sobre Angular. |
| **SUP-004** | La contraseña autogenerada para el cliente se enviará **una sola vez** por correo al momento de su primer registro. Si el cliente olvida su contraseña, deberá contactar a SuperMarket (no hay módulo de recuperación de contraseña). | Simplificación justificada por tiempo y porque el módulo de usuarios está fuera del alcance actual. |
| **SUP-005** | El sistema asume que el cliente que radica una PQRS proporciona sus datos correctamente. No se realiza validación contra una base de datos externa de clientes de SuperMarket (la BD del sistema PQRS es la fuente de verdad). | El enunciado menciona "validar la existencia del cliente en la base de datos de SuperMarket" — se interpreta como la base de datos del propio sistema PQRS, no una integración con un sistema externo. |

---

## 4. Priorización MoSCoW

| Prioridad | Descripción |
|---|---|
| **Must have** | Obligatorio. Sin esta HU el sistema no cumple los requisitos mínimos del enunciado. |
| **Should have** | Importante. Debe implementarse si el tiempo lo permite. Agrega valor significativo. |
| **Could have** | Deseable. Enriquece la solución pero su ausencia no afecta la funcionalidad core. |
| **Won't have** | Fuera del alcance de este proyecto por restricción explícita o tiempo. |

---

## 5. Product Backlog

### 5.1 Módulo: App Cliente — Radicación de PQRS

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | Estimación |
|---|---|---|---|---|
| **HU-001** | Como **cliente**, quiero diligenciar un formulario con mis datos personales y la información de mi PQRS, para radicarla en el sistema de SuperMarket. | - Campos obligatorios: tipo de identificación, número de identificación, nombre completo, correo electrónico, teléfono móvil, tipo de radicado (P/Q/R/S), comentarios. - Campo opcional: adjunto en formato PDF. - El número de radicado y la fecha se generan automáticamente. - El formulario valida que todos los campos obligatorios estén diligenciados antes de enviar. | Must | 3 pts |
| **HU-002** | Como **sistema**, quiero verificar si el cliente que radica ya existe en la base de datos, para registrarlo automáticamente si es la primera vez. | - Si el número de identificación no existe en BD: se crea el registro del cliente. - Si ya existe: se usa el registro existente sin duplicarlo. - En ambos casos se procede a crear la PQRS. | Must | 2 pts |
| **HU-003** | Como **sistema**, quiero enviar un correo electrónico de confirmación al cliente tras radicar su PQRS, para que tenga constancia de su radicado y sus credenciales de acceso. | - El correo contiene: número de radicado y contraseña autogenerada. - La contraseña cumple: 6 caracteres, mínimo 1 mayúscula, 1 minúscula, 1 número. - La contraseña se almacena cifrada en BD (bcrypt). - El correo se envía al correo ingresado en el formulario. | Must | 3 pts |

### 5.2 Módulo: App Cliente — Autenticación y Consulta

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | Estimación |
|---|---|---|---|---|
| **HU-004** | Como **cliente**, quiero autenticarme con mi número de identificación y la contraseña recibida por correo, para acceder a mis radicados de forma segura. | - Login con: número de identificación + contraseña. - Las contraseñas se verifican con bcrypt. - Si las credenciales son correctas: se genera un token JWT y se redirige al listado de radicados. - Si son incorrectas: mensaje de error claro. | Must | 2 pts |
| **HU-005** | Como **cliente autenticado**, quiero ver el listado de todas las PQRS que he radicado, para hacer seguimiento a mis solicitudes. | - La lista muestra solo los radicados del cliente autenticado. - Columnas: número de radicado, fecha, tipo (P/Q/R/S), comentarios, anexo (link de descarga), estado y justificación del estado. - Ordenado por fecha descendente (más reciente primero). | Must | 2 pts |
| **HU-006** | Como **cliente autenticado**, quiero filtrar mi listado de radicados por número de radicado, para encontrar una PQRS específica rápidamente. | - Campo de búsqueda visible en el listado. - El filtro se aplica sobre los radicados del cliente autenticado. - Si no hay coincidencias: mensaje informativo. | Must | 1 pt |

### 5.3 Módulo: App Web Gestor — Autenticación

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | Estimación |
|---|---|---|---|---|
| **HU-007** | Como **gestor PQRS**, quiero autenticarme con mi usuario y contraseña, para acceder al panel de administración de radicados. | - Login con usuario y contraseña. - El usuario gestor se crea directamente en BD (supuesto SUP-001). - Contraseña cifrada con bcrypt. - Sesión manejada con JWT. - Acceso denegado con mensaje claro si las credenciales son incorrectas. | Must | 2 pts |

### 5.4 Módulo: App Web Gestor — Gestión de PQRS

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | Estimación |
|---|---|---|---|---|
| **HU-008** | Como **gestor PQRS**, quiero ver el listado completo de todas las PQRS radicadas por todos los clientes, para tener visibilidad total de las solicitudes pendientes. | - Tabla con todas las PQRS del sistema. - Columnas: número de radicado, fecha, tipo, comentarios, link de anexo, estado y justificación del estado. - Ordenado por fecha descendente. | Must | 2 pts |
| **HU-009** | Como **gestor PQRS**, quiero filtrar el listado de radicados por tipo de PQRS y por estado, para gestionar las solicitudes de forma organizada. | - Filtro por tipo: Petición, Queja, Reclamo, Sugerencia. - Filtro por estado: Nuevo, En proceso, Resuelto, Rechazado. - Los filtros se pueden combinar. - Al aplicar un filtro el reporte PDF debe reflejar el listado filtrado. | Must | 2 pts |
| **HU-010** | Como **gestor PQRS**, quiero cambiar el estado de una PQRS ingresando una justificación, para comunicar el avance al cliente. | - Estados disponibles: Nuevo, En proceso, Resuelto, Rechazado. - La justificación es obligatoria al cambiar estado. - El cambio de estado se refleja inmediatamente en la vista del cliente. - No se puede dejar la justificación vacía. | Must | 3 pts |
| **HU-011** | Como **gestor PQRS**, quiero descargar el archivo adjunto (PDF) de cada radicado, para revisar la documentación enviada por el cliente. | - Botón de descarga visible por radicado (solo si tiene adjunto). - El archivo se descarga correctamente en el navegador. - Si el radicado no tiene adjunto: el botón no aparece o está deshabilitado. | Must | 1 pt |
| **HU-012** | Como **gestor PQRS**, quiero generar y descargar un reporte en formato PDF con el listado de radicados consultado, para tener un informe exportable del estado de las PQRS. | - El reporte refleja el listado visible (con los filtros aplicados). - Incluye las columnas: número de radicado, fecha, tipo, comentarios, estado y justificación. - No incluye la columna de link de anexo. - El PDF se genera y descarga desde el navegador. | Must | 3 pts |

### 5.5 Módulo: Backend y Sistema General

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | Estimación |
|---|---|---|---|---|
| **HU-013** | Como **desarrollador**, quiero que el backend exponga una API REST con endpoints bien definidos, para que el frontend Angular se comunique de forma estándar. | - Todos los endpoints responden en JSON. - Códigos HTTP correctos: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error. - Rutas organizadas por módulo: `/api/pqrs`, `/api/auth`, `/api/clientes`. | Must | 3 pts |
| **HU-014** | Como **sistema**, quiero cifrar todas las contraseñas antes de guardarlas en la base de datos, para cumplir con el requisito de seguridad del enunciado. | - Se usa bcrypt con un salt de mínimo 10 rondas. - Nunca se almacena la contraseña en texto plano. - Aplica tanto para clientes como para el gestor PQRS. | Must | 1 pt |
| **HU-015** | Como **sistema**, quiero gestionar la persistencia de datos usando Sequelize como ORM sobre MySQL, para cumplir el requisito técnico del enunciado. | - Modelos Sequelize definidos: Cliente, PQRS, Gestor. - Relaciones correctas entre modelos (un cliente tiene muchas PQRS). - Script SQL de creación de tablas disponible en `/base-de-datos/`. | Must | 3 pts |
| **HU-016** | Como **desarrollador**, quiero manejar las credenciales del sistema mediante variables de entorno, para no exponer información sensible en el repositorio. | - Archivo `.env` incluido en `.gitignore`. - Archivo `.env.example` en el repo con las variables necesarias (sin valores reales). - Variables: puerto, credenciales BD, secreto JWT, configuración SMTP. | Should | 1 pt |
| **HU-017** | Como **cliente**, quiero que la aplicación web funcione correctamente en la pantalla de mi celular, para poder radicar y consultar mis PQRS desde cualquier dispositivo. | - Diseño responsivo en Angular (probado en viewport de 375px de ancho). - Formularios usables en pantalla pequeña (campos legibles, botones accesibles). - Sin scroll horizontal. | Should | 2 pts |
| **HU-018** | Como **gestor PQRS**, quiero que mi sesión expire automáticamente después de un tiempo de inactividad, para que nadie acceda al panel si olvidé cerrar sesión. | - Token JWT con expiración de 8 horas. - Al expirar el token, el sistema redirige automáticamente al login. - Mensaje informativo al usuario sobre la expiración. | Could | 1 pt |

---

## 6. Resumen del backlog

| Prioridad | Cantidad de HU | Puntos estimados |
|---|---|---|
| Must have | 15 | 31 pts |
| Should have | 2 | 3 pts |
| Could have | 1 | 1 pt |
| **Total** | **18** | **35 pts** |

---

## 7. Fuera del alcance (Won't have)

Las siguientes funcionalidades quedan explícitamente fuera del alcance de este proyecto:

- Módulo de registro/creación de gestores PQRS desde la interfaz (SUP-001).
- Recuperación de contraseña para clientes.
- Notificaciones automáticas al cliente cuando cambia el estado de su PQRS.
- Integración con sistema ERP o CRM externo de SuperMarket.
- Despliegue en producción (el entregable es local/localhost).

---

## 8. Control de versiones del documento

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 20/04/2026 | Camilo Prieto (Líder) | Versión inicial del backlog |

---

*Documento generado como parte del Sprint 0 — Proyecto PQRS SuperMarket*