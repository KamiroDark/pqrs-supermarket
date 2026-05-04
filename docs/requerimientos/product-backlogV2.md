# Product Backlog — Sistema PQRS SuperMarket

**Proyecto:** Implementación Sistema de PQRS  
**Cliente:** SuperMarket  
**Fábrica de desarrollo:** Fábrica de Desarrollo Konrad  
**Grupo:** Grupo N-6   
**Materia:** Ingeniería de Software I  
**Profesor:** Carlos Andrés López  
**Fecha de elaboración:** 30 de abril de 2026  
**Versión:** 2.1

---

## 1. Introducción

El presente Product Backlog recoge la totalidad de las Historias de Usuario (HU) identificadas para el sistema PQRS de SuperMarket, priorizadas mediante el método MoSCoW. Este documento es la fuente única de verdad sobre lo que el sistema debe hacer y sirve como base para la planeación de cada Sprint.

El sistema cuenta con dos presentaciones: una **aplicación web** para que el gestor PQRS administre las solicitudes (prioridad principal), y una **aplicación móvil** para que los clientes radiquen y consulten sus PQRS (prioridad secundaria).

> **Criterio de priorización:** La aplicación web del gestor es el componente de mayor valor para el negocio de SuperMarket, ya que sin ella las PQRS no pueden ser atendidas. La app móvil del cliente, aunque importante, puede desarrollarse en una segunda fase una vez el core del sistema esté operativo.

---

## 2. Actores del sistema

| Actor | Descripción |
|-------|-------------|
| **Cliente** | Usuario externo que radica y consulta sus PQRS a través de la aplicación móvil. |
| **Gestor PQRS** | Usuario interno de SuperMarket que administra y gestiona las PQRS radicadas desde la aplicación web. |
| **Sistema** | Acciones automáticas ejecutadas sin intervención directa del usuario (envío de correos, generación de contraseñas, asignación de número de radicado y fecha). |

---

## 3. Supuestos del proyecto

| ID | Supuesto | Justificación |
|----|----------|---------------|
| **SUP-001** | El módulo de gestión de usuarios **no se implementará en código**. Los gestores PQRS se crearán directamente en la base de datos mediante un script seed. | Indicación del profesor dado el tiempo disponible del proyecto. La gestión de usuarios completa representaría un sobrecosto en PHU que el equipo no puede absorber. |
| **SUP-002** | Los archivos adjuntos (PDF) subidos por el cliente se almacenarán en el **servidor de archivos** (carpeta `/uploads`), no en la base de datos como BLOB. | Más sencillo con Node.js + Multer. Evita inflar la base de datos y simplifica la descarga posterior. |
| **SUP-003** | La "App Móvil" requerida en el enunciado se implementará como una **aplicación web Angular responsiva** accesible desde navegadores móviles. | Reduce complejidad de configuración. No requiere Android SDK ni emulador. El equipo tiene dominio sobre Angular. |
| **SUP-004** | La contraseña autogenerada para el cliente se enviará **una sola vez** por correo al momento de su primer registro. No hay módulo de recuperación de contraseña. | Simplificación justificada por tiempo y porque el módulo de usuarios está fuera del alcance actual (SUP-001). |
| **SUP-005** | El sistema asume que el cliente proporciona sus datos correctamente al radicar. No se realiza validación contra una base de datos externa de clientes de SuperMarket. | El enunciado menciona "validar la existencia del cliente en la BD de SuperMarket" — se interpreta como la base de datos del propio sistema PQRS, no una integración con un sistema externo. |

---

## 4. Priorización MoSCoW

| Prioridad | Descripción |
|-----------|-------------|
| **Must have** | Obligatorio. Sin esta HU el sistema no cumple los requisitos mínimos del enunciado. |
| **Should have** | Importante. Debe implementarse si el tiempo lo permite. Agrega valor significativo. |
| **Could have** | Deseable. Enriquece la solución pero su ausencia no afecta la funcionalidad core. |
| **Won't have** | Fuera del alcance de este proyecto por restricción explícita o de tiempo. |

---

## 5. Product Backlog

---

### 5.1 Épica 1 — Backend y API REST (Base de todo el sistema)

> El backend es el prerequisito de todas las demás épicas. Se desarrolla primero en el Sprint 1 para que tanto la web como la app móvil puedan consumir los mismos servicios.

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | PHU | Sprint |
|----|---------------------|------------------------|-----------|-----|--------|
| **HU-001** | Como **desarrollador**, quiero que el backend exponga una API REST con endpoints bien definidos para que los frontends se comuniquen de forma estándar. | - Todos los endpoints responden en JSON. - Códigos HTTP correctos: 200, 201, 400, 401, 403, 404, 500. - Rutas organizadas por módulo: `/api/auth`, `/api/radicados`, `/api/clientes`. - Middleware de autenticación JWT protege las rutas privadas. | Must | 3 | 1 |
| **HU-002** | Como **sistema**, quiero gestionar la persistencia de datos usando Sequelize como ORM sobre MySQL para cumplir el requisito técnico del enunciado. | - Modelos Sequelize definidos: Cliente, Radicado, Gestor. - Relación correcta: un Cliente tiene muchos Radicados. - Script SQL de creación de tablas en `/base-de-datos/schema.sql`. - Script seed con usuario gestor inicial en `/base-de-datos/seed.sql`. | Must | 2 | 1 |
| **HU-003** | Como **sistema**, quiero cifrar todas las contraseñas antes de guardarlas en la base de datos para cumplir el requisito de seguridad del enunciado. | - Se usa bcrypt con mínimo 10 rondas de salt. - Nunca se almacena contraseña en texto plano. - Aplica tanto para clientes como para el gestor PQRS. | Must | 1 | 1 |
| **HU-004** | Como **desarrollador**, quiero manejar las credenciales del sistema mediante variables de entorno para no exponer información sensible en el repositorio. | - Archivo `.env` incluido en `.gitignore`. - Archivo `.env.example` con las variables necesarias sin valores reales. - Variables: PORT, DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET, EMAIL_USER, EMAIL_PASS. | Should | 1 | 1 |

---

### 5.2 Épica 2 — Autenticación y Gestión de PQRS · App Web (Actor: Gestor PQRS)

> **Prioridad máxima del producto.** Es el componente de mayor valor para SuperMarket. Se desarrolla completo antes de pasar a la app móvil.

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | PHU | Sprint |
|----|---------------------|------------------------|-----------|-----|--------|
| **HU-005** | Como **gestor PQRS**, quiero autenticarme con mi usuario y contraseña para acceder al panel de administración de radicados. | - Login con usuario y contraseña. - El usuario gestor se crea directamente en BD (SUP-001, script seed). - Contraseña cifrada con bcrypt. - Sesión manejada con JWT (expira en 8h). - Al expirar el token redirige automáticamente al login. - Si las credenciales son incorrectas: mensaje de error claro. | Must | 2 | 2 |
| **HU-006** | Como **gestor PQRS**, quiero ver el listado completo de todas las PQRS radicadas para tener visibilidad total de las solicitudes del sistema. | - Tabla con todas las PQRS del sistema (no filtrada por cliente). - Columnas: número de radicado, fecha, tipo, comentarios, link de anexo, estado y justificación del estado. - Ordenado por fecha descendente por defecto. - Solo accesible con sesión de gestor activa. | Must | 3 | 2 |
| **HU-007** | Como **gestor PQRS**, quiero filtrar el listado de radicados por tipo de PQRS y por estado para gestionar las solicitudes de forma organizada. | - Filtro por tipo: Petición, Queja, Reclamo, Sugerencia. - Filtro por estado: Nuevo, En proceso, Resuelto, Rechazado. - Los filtros se pueden combinar. - Al aplicar filtros el listado se actualiza sin recargar la página. - El reporte PDF generado refleja el listado filtrado. | Must | 2 | 3 |
| **HU-008** | Como **gestor PQRS**, quiero cambiar el estado de una PQRS ingresando una justificación para comunicar el avance al cliente. | - Estados disponibles: Nuevo, En proceso, Resuelto, Rechazado. - La justificación es obligatoria (no se puede guardar vacía). - El cambio de estado se refleja inmediatamente en el listado. - El cliente puede ver el nuevo estado y justificación desde su app. | Must | 3 | 3 |
| **HU-009** | Como **gestor PQRS**, quiero descargar el archivo PDF adjunto de cada radicado para revisar la documentación enviada por el cliente. | - Botón de descarga visible por radicado (solo si tiene adjunto). - El archivo se descarga correctamente en el navegador. - Si el radicado no tiene adjunto: el botón no aparece o está deshabilitado. | Must | 2 | 4 |
| **HU-010** | Como **gestor PQRS**, quiero generar y descargar un reporte en formato PDF con el listado de radicados consultado para tener un informe exportable. | - El reporte refleja el listado visible con los filtros aplicados. - Columnas del PDF: número de radicado, fecha, tipo, comentarios, estado y justificación (no incluye link de anexo). - El PDF incluye encabezado con nombre del sistema, fecha de generación y filtros aplicados. - Se descarga automáticamente desde el navegador. | Must | 3 | 4 |

---

### 5.3 Épica 3 — Radicación de PQRS · App Móvil (Actor: Cliente)

> **Segunda prioridad.** Se desarrolla una vez el backend y la web gestora estén operativos. Si el tiempo no da, el sistema igual funciona con radicados creados manualmente en BD para pruebas.

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | PHU | Sprint |
|----|---------------------|------------------------|-----------|-----|--------|
| **HU-011** | Como **cliente**, quiero diligenciar un formulario con mis datos personales y la información de mi PQRS para radicarla en el sistema de SuperMarket. | - Campos obligatorios: tipo de identificación (CC, CE, Pasaporte, NIT), número de identificación, nombre completo, correo electrónico, teléfono móvil, tipo de radicado (P/Q/R/S) y comentarios. - Campo opcional: adjunto en formato PDF (máx. 5MB). - El número de radicado y la fecha se generan automáticamente. - Todos los campos obligatorios se validan antes de enviar. | Must | 1 | 5 |
| **HU-012** | Como **sistema**, quiero verificar si el cliente que radica ya existe en BD para registrarlo automáticamente si es la primera vez. | - Si el número de identificación no existe en BD: se crea el registro del cliente. - Si ya existe: se usa el registro existente sin duplicarlo. - En ambos casos se crea la PQRS asociada. | Must | 2 | 5 |
| **HU-013** | Como **sistema**, quiero enviar un correo electrónico de confirmación al cliente tras radicar su PQRS para que tenga constancia de su radicado y sus credenciales. | - El correo contiene: número de radicado y contraseña autogenerada (6 caracteres, mínimo 1 mayúscula, 1 minúscula, 1 número). - La contraseña se almacena cifrada en BD (bcrypt). - Solo se genera contraseña si el cliente es nuevo. | Must | 3 | 5 |

---

### 5.4 Épica 4 — Autenticación y Consulta · App Móvil (Actor: Cliente)

> **Tercera prioridad.** Complementa la radicación con el acceso y seguimiento del cliente.

| ID | Historia de Usuario | Criterios de aceptación | Prioridad | PHU | Sprint |
|----|---------------------|------------------------|-----------|-----|--------|
| **HU-014** | Como **cliente**, quiero autenticarme con mi número de identificación y la contraseña recibida por correo para acceder a mis radicados de forma segura. | - Login con número de identificación y contraseña (ambos obligatorios). - Contraseñas verificadas con bcrypt. - Credenciales correctas: genera JWT (8h) y redirige al listado. - Credenciales incorrectas: mensaje de error genérico. | Should | 2 | 5 |
| **HU-015** | Como **cliente autenticado**, quiero ver el listado de todas mis PQRS radicadas para hacer seguimiento a mis solicitudes. | - Lista solo los radicados del cliente autenticado. - Columnas: número de radicado, fecha, tipo, estado (con indicador visual), comentarios, justificación del estado y link de anexo. - Ordenado por fecha descendente. | Should | 2 | 5 |
| **HU-016** | Como **cliente autenticado**, quiero filtrar mi listado de radicados por número de radicado para encontrar una PQRS específica rápidamente. | - Campo de búsqueda visible en el listado. - Si no hay coincidencias: mensaje informativo. - Limpiar el campo restaura el listado completo. | Should | 1 | 5 |

---

## 6. Resumen del backlog por prioridad de entrega

| ID | Historia de Usuario (resumen) | Épica | Prioridad | PHU | Sprint |
|----|-------------------------------|-------|-----------|-----|--------|
| HU-001 | API REST con endpoints definidos | Backend | Must | 3 | 1 |
| HU-002 | ORM Sequelize + modelos + scripts SQL | Backend | Must | 2 | 1 |
| HU-003 | Cifrado de contraseñas con bcrypt | Backend | Must | 1 | 1 |
| HU-004 | Variables de entorno (.env) | Backend | Should | 1 | 1 |
| HU-005 | Login gestor en app web | App Web | Must | 2 | 2 |
| HU-006 | Listado completo de radicados | App Web | Must | 3 | 2 |
| HU-007 | Filtrar radicados por tipo y estado | App Web | Must | 2 | 3 |
| HU-008 | Cambiar estado con justificación | App Web | Must | 3 | 3 |
| HU-009 | Descargar anexo PDF por radicado | App Web | Must | 2 | 4 |
| HU-010 | Generar reporte PDF del listado | App Web | Must | 3 | 4 |
| HU-011 | Radicar PQRS con formulario | App Móvil | Must | 1 | 5 |
| HU-012 | Validar/crear cliente automáticamente | App Móvil | Must | 2 | 5 |
| HU-013 | Enviar correo confirmación con contraseña | App Móvil | Must | 3 | 5 |
| HU-014 | Login cliente en app móvil | App Móvil | Should | 2 | 5 |
| HU-015 | Listado de radicados del cliente | App Móvil | Should | 2 | 5 |
| HU-016 | Filtrar radicados por número | App Móvil | Should | 1 | 5 |
| | | | **Total** | **33 PHU** | |

---

## 7. MVPs del producto

| MVP | Contenido | Valor que entrega |
|-----|-----------|------------------|
| **MVP 1** · Sprints 1-2 | Backend completo + Web gestor: login y listado de radicados | El gestor puede ver y auditar las PQRS del sistema |
| **MVP 2** · Sprints 3-4 | Web gestor: filtros + cambio de estado + descarga PDF + reporte | El gestor puede gestionar y responder todas las PQRS |
| **MVP 3** · Sprint 5 | App móvil completa: radicación + autenticación + consulta | El cliente puede radicar y hacer seguimiento de forma autónoma |

---

## 8. Velocidad del equipo

| Dato | Valor |
|------|-------|
| Integrantes | 4 |
| Horas/día por persona | 3.5 h |
| Semanas por sprint | 2 |
| Horas disponibles por sprint | 140 h |
| Factor de productividad | 76% (0.76) |
| Horas efectivas por sprint | 106.4 h |
| Horas por PHU (PERT) | 18.9 h |
| Capacidad por sprint | ~5 PHU |
| Sprints planificados | 5 |

---

## 9. Fuera del alcance (Won't have)

- Módulo de registro y edición de gestores PQRS desde la interfaz (ver SUP-001).
- Módulo de asignación de perfiles y permisos.
- Recuperación de contraseña para clientes.
- Notificaciones automáticas al cliente cuando cambia el estado de su PQRS.
- Integración con sistema ERP o CRM externo de SuperMarket.
- Despliegue en producción (el entregable es local/localhost).

---

## 10. Control de versiones del documento

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 20/04/2026 | Camilo Prieto | Versión inicial del backlog |
| 2.0 | 30/04/2026 | Camilo Prieto | Unificación post-retroalimentación del profesor. Se eliminan HU de gestión de usuarios y permisos. Se agregan supuestos y HU técnicas de backend. |
| 2.1 | 30/04/2026 | Camilo Prieto | Reordenamiento de prioridades: App Web gestor pasa a ser prioridad 1. App Móvil cliente pasa a Sprint 5 como segunda fase. Se añade tabla de MVPs. |

---

*Documento generado como parte del Sprint 1 — Proyecto PQRS SuperMarket*