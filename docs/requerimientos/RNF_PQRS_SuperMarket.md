# Requisitos No Funcionales — PQRS SuperMarket

---

## 1. Seguridad

### RNF-01 · Cifrado de contraseñas · Prioridad: ALTA

**Descripción:**
El sistema debe garantizar que ninguna contraseña sea almacenada en texto plano en la base de datos, tanto para los clientes que acceden desde la App Móvil como para los gestores que acceden desde la Aplicación Web. Se debe aplicar un algoritmo de cifrado robusto antes de persistir cualquier credencial.

**Criterios de Aceptación:**
- **CA-01** — Todas las contraseñas (clientes de la App Móvil y gestores de la Aplicación Web) deben cifrarse mediante BCrypt, SHA-256 o algoritmo equivalente antes de ser almacenadas.
- **CA-02** — Ningún registro en la base de datos debe contener contraseñas en texto legible bajo ninguna circunstancia.
- **CA-03** — El algoritmo de cifrado utilizado debe ser configurable sin requerir cambios en el código fuente principal.

---

### RNF-02 · Control de acceso por roles y perfiles · Prioridad: ALTA

**Descripción:**
El sistema debe implementar un módulo de seguridad que administre usuarios, perfiles, opciones y permisos de forma granular para ambas plataformas. Los clientes (App Móvil) solo podrán acceder a sus propios radicados; los gestores (Aplicación Web) tendrán acceso al conjunto completo de PQRS.

**Criterios de Aceptación:**
- **CA-01** — El módulo de seguridad debe permitir crear, editar, activar e inactivar usuarios y perfiles tanto para el rol Cliente (App Móvil) como para el rol Gestor (Aplicación Web).
- **CA-02** — Un cliente autenticado en la App Móvil únicamente puede visualizar y filtrar los radicados asociados a su número de identificación.
- **CA-03** — El gestor autenticado en la Aplicación Web tiene acceso irrestricto a todos los radicados del sistema para consultarlos, filtrarlos y gestionarlos.
- **CA-04** — Cualquier intento de acceder a recursos de un perfil diferente al asignado debe ser rechazado con un mensaje de error apropiado.

---

### RNF-03 · Generación segura de contraseñas temporales · Prioridad: ALTA

**Descripción:**
Cuando un nuevo cliente radique su primera PQRS a través de la App Móvil y el sistema lo registre automáticamente, debe generarse una contraseña temporal y enviársela por correo electrónico. Esta contraseña debe cumplir criterios mínimos de complejidad para garantizar la seguridad inicial de la cuenta.

**Criterios de Aceptación:**
- **CA-01** — La contraseña temporal generada para el acceso del cliente a la App Móvil debe tener exactamente 6 caracteres.
- **CA-02** — Debe contener al menos una letra mayúscula, una letra minúscula y un dígito numérico.
- **CA-03** — La generación debe ser aleatoria e impredecible; no debe basarse en datos personales del cliente.
- **CA-04** — La contraseña temporal debe transmitirse únicamente al correo electrónico registrado por el cliente al momento de la radicación.

---

### RNF-04 · Autenticación obligatoria en ambas plataformas · Prioridad: ALTA

**Descripción:**
El acceso a cualquier funcionalidad sensible del sistema debe requerir autenticación previa con credenciales válidas, tanto en la App Móvil (cliente) como en la Aplicación Web (gestor). No deben existir rutas, pantallas o endpoints que expongan información sin inicio de sesión.

**Criterios de Aceptación:**
- **CA-01** — La App Móvil debe solicitar número de identificación y contraseña antes de permitir la consulta de radicados o cualquier operación del cliente.
- **CA-02** — La Aplicación Web debe solicitar usuario y contraseña al gestor antes de mostrar el listado de radicados o permitir cualquier acción de gestión.
- **CA-03** — Las sesiones en ambas plataformas deben expirar tras un período de inactividad configurable (recomendado: 30 minutos).
- **CA-04** — Tras varios intentos fallidos de autenticación, el sistema debe bloquear temporalmente el acceso a la cuenta correspondiente.

---

### RNF-05 · Transmisión segura de datos · Prioridad: ALTA

**Descripción:**
Todas las comunicaciones entre las plataformas cliente (App Móvil y Aplicación Web) y el servidor deben realizarse sobre un canal cifrado, protegiendo los datos en tránsito: credenciales, información personal de los clientes, contenido de PQRS y documentos PDF adjuntos.

**Criterios de Aceptación:**
- **CA-01** — Todas las peticiones HTTP originadas desde la App Móvil y desde la Aplicación Web deben realizarse exclusivamente sobre HTTPS con TLS 1.2 o superior.
- **CA-02** — Los certificados SSL/TLS deben ser válidos y emitidos por una autoridad certificadora reconocida.
- **CA-03** — Los archivos PDF adjuntos cargados desde la App Móvil y descargados desde la Aplicación Web deben transmitirse de forma cifrada, sin exposición de URLs directas no autenticadas.

---

## 2. Integración e Interoperabilidad

### RNF-06 · Integración mediante servicios web SOAP o REST · Prioridad: ALTA

**Descripción:**
La comunicación entre la App Móvil, la Aplicación Web y el backend del sistema debe implementarse a través de servicios web bajo el protocolo SOAP o REST. Esto garantiza la interoperabilidad entre ambas plataformas de cara al cliente y facilita futuras integraciones con otros sistemas de SuperMarket.

**Criterios de Aceptación:**
- **CA-01** — Todas las operaciones funcionales (radicación desde la App Móvil, consulta desde ambas plataformas y cambio de estado desde la Aplicación Web) deben exponerse como servicios web SOAP o REST.
- **CA-02** — Los servicios REST deben utilizar formato JSON como mecanismo estándar de intercambio de datos entre el cliente y el servidor.
- **CA-03** — Cada servicio debe retornar códigos de estado HTTP apropiados (200, 201, 400, 401, 403, 404, 500) para facilitar el manejo de errores en ambas plataformas.
- **CA-04** — Los servicios deben estar documentados mediante Swagger/OpenAPI (REST) o WSDL (SOAP) según el protocolo elegido.

---

### RNF-07 · Mapeo Objeto-Relacional (ORM) · Prioridad: MEDIA

**Descripción:**
La capa de acceso a datos del backend debe implementarse a través de un mecanismo ORM reconocido (Hibernate, iBatis o equivalente). Este ORM será compartido por ambas plataformas a través del backend, garantizando consistencia en el acceso a la información.

**Criterios de Aceptación:**
- **CA-01** — El ORM debe gestionar todas las operaciones CRUD sobre las entidades del sistema: clientes, PQRS, estados, usuarios gestores y adjuntos.
- **CA-02** — El esquema de base de datos debe poder generarse o validarse a partir del modelo de entidades definido en el ORM.
- **CA-03** — Las consultas de filtrado (por tipo de PQRS, estado, número de radicado) requeridas tanto por la App Móvil como por la Aplicación Web deben implementarse mediante HQL, JPQL o el lenguaje nativo del ORM elegido.

---

### RNF-08 · Integración con servicio de correo electrónico · Prioridad: ALTA

**Descripción:**
El sistema backend debe integrarse con un servidor o servicio SMTP para el envío automático de notificaciones al cliente. Esta integración es desencadenada desde la App Móvil cuando el cliente radica su primera PQRS, y su resultado es visible para el gestor en la Aplicación Web como confirmación del registro.

**Criterios de Aceptación:**
- **CA-01** — Al registrar un nuevo cliente desde la App Móvil, el sistema debe enviar automáticamente un correo con el número de radicado asignado y la contraseña temporal generada.
- **CA-02** — El envío del correo no debe bloquear el flujo principal de radicación en la App Móvil; debe ejecutarse de forma asíncrona.
- **CA-03** — En caso de fallo en el envío, el sistema debe registrar el error y reintentar al menos una vez, sin afectar la experiencia del usuario en ninguna de las dos plataformas.

---

## 3. Stack Tecnológico

### RNF-09 · Base de datos de licencia libre · Prioridad: ALTA

**Descripción:**
El motor de base de datos que respalda tanto la App Móvil como la Aplicación Web debe ser de licencia libre o edición gratuita, reduciendo los costos operativos de SuperMarket. Ambas plataformas comparten la misma base de datos a través del backend.

**Criterios de Aceptación:**
- **CA-01** — El motor de base de datos debe ser uno de los siguientes: PostgreSQL, MySQL, SQL Server Express u Oracle Express.
- **CA-02** — La versión utilizada debe ser estable y contar con soporte activo de la comunidad o del fabricante.
- **CA-03** — El esquema debe entregarse como un script SQL ejecutable que permita recrear la estructura completa y los datos iniciales en cualquier entorno de despliegue.

---

### RNF-10 · Servidor web o de aplicaciones reconocido · Prioridad: ALTA

**Descripción:**
El backend del sistema y la Aplicación Web deben desplegarse sobre un servidor web o de aplicaciones ampliamente reconocido. La App Móvil consumirá los servicios expuestos por este servidor. Esto garantiza estabilidad, soporte y facilidad de administración para el área de TI de SuperMarket.

**Criterios de Aceptación:**
- **CA-01** — El servidor debe ser uno de los aprobados: Apache Tomcat, JBoss/WildFly, GlassFish, Apache HTTP Server o IIS.
- **CA-02** — La configuración del servidor debe documentarse para facilitar su replicación en entornos de desarrollo, pruebas y producción.
- **CA-03** — El servidor debe gestionar conexiones concurrentes provenientes tanto de la App Móvil como de la Aplicación Web sin configuraciones adicionales de pago.

---

### RNF-11 · Framework aprobado para la Aplicación Web · Prioridad: MEDIA

**Descripción:**
La Aplicación Web de gestión de PQRS debe desarrollarse con alguno de los frameworks o tecnologías aprobadas por SuperMarket. La App Móvil puede desarrollarse con frameworks nativos o multiplataforma, siempre que consuma los servicios del backend mediante SOAP o REST.

**Criterios de Aceptación:**
- **CA-01** — La Aplicación Web debe desarrollarse con alguno de los siguientes frameworks: JSF, Spring MVC, Vaadin, GWT, ZK, PHP, .NET o Angular.
- **CA-02** — La elección del framework tanto para la Aplicación Web como para la App Móvil debe justificarse técnicamente en el documento de arquitectura de la solución.
- **CA-03** — La Aplicación Web debe ser compatible con los navegadores más utilizados (Chrome, Firefox, Edge) en sus versiones actuales.

---

### RNF-12 · Compatibilidad móvil multiplataforma · Prioridad: ALTA

**Descripción:**
La App Móvil debe funcionar correctamente en los sistemas operativos móviles más utilizados del mercado colombiano. La Aplicación Web, al estar orientada al gestor de PQRS en un entorno de escritorio, debe ser responsiva para su uso en computadores y no requiere versión nativa móvil.

**Criterios de Aceptación:**
- **CA-01** — La App Móvil debe ejecutarse correctamente en Android (versión 8.0 o superior) e iOS (versión 13 o superior).
- **CA-02** — Si la App Móvil se desarrolla con un framework multiplataforma (Flutter, React Native, Ionic), su elección debe justificarse en la documentación técnica.
- **CA-03** — La Aplicación Web debe ser responsiva y adaptarse correctamente a pantallas de escritorio y portátiles (resoluciones desde 1024px de ancho).

---

## 4. Rendimiento y Disponibilidad

### RNF-13 · Tiempo de respuesta aceptable en ambas plataformas · Prioridad: ALTA

**Descripción:**
Las operaciones principales del sistema deben completarse en tiempos que garanticen una experiencia fluida tanto para el cliente en la App Móvil (radicación, consulta y filtrado de sus PQRS) como para el gestor en la Aplicación Web (consulta, filtrado, cambio de estado y descarga de adjuntos).

**Criterios de Aceptación:**
- **CA-01** — La radicación de una PQRS desde la App Móvil y la consulta del listado de radicados desde la Aplicación Web deben completarse en menos de 5 segundos en condiciones normales de red.
- **CA-02** — La autenticación debe completarse en menos de 3 segundos en ambas plataformas.
- **CA-03** — Los listados extensos de radicados en la Aplicación Web y en la App Móvil deben implementar paginación para no degradar el rendimiento con grandes volúmenes de datos.

---

### RNF-14 · Disponibilidad del sistema · Prioridad: ALTA

**Descripción:**
El sistema debe estar disponible continuamente para los clientes que radican PQRS desde la App Móvil y para los gestores que administran radicados desde la Aplicación Web. Los mantenimientos deben planificarse en horarios de baja demanda.

**Criterios de Aceptación:**
- **CA-01** — El sistema debe garantizar una disponibilidad mínima del 95% del tiempo mensual para ambas plataformas.
- **CA-02** — Los tiempos de mantenimiento programado deben realizarse en horarios fuera de pico y comunicarse con antelación a los usuarios.
- **CA-03** — Ante caídas imprevistas, el tiempo máximo de restauración del servicio no debe superar las 4 horas.

---

### RNF-15 · Generación eficiente de reportes PDF en la Aplicación Web · Prioridad: MEDIA

**Descripción:**
La funcionalidad de generación de reportes PDF, disponible exclusivamente en la Aplicación Web para el gestor, debe ejecutarse de forma eficiente y sin bloquear la interfaz, independientemente del volumen de radicados filtrados previamente.

**Criterios de Aceptación:**
- **CA-01** — La generación del reporte PDF debe completarse en menos de 10 segundos para conjuntos de hasta 500 radicados filtrados.
- **CA-02** — Durante la generación del PDF, la Aplicación Web debe mostrar un indicador de progreso visible sin bloquear la navegación del gestor.
- **CA-03** — El PDF generado debe reflejar exactamente la información del listado filtrado o consultado en la Aplicación Web, con paginación interna y encabezado identificativo de SuperMarket.

---

## 5. Mantenibilidad y Escalabilidad

### RNF-16 · Arquitectura en capas · Prioridad: ALTA

**Descripción:**
El sistema completo (backend compartido, App Móvil y Aplicación Web) debe construirse bajo una arquitectura en capas claramente definidas: presentación, lógica de negocio y persistencia. Esto permite el mantenimiento independiente de cada plataforma sin afectar las demás.

**Criterios de Aceptación:**
- **CA-01** — La capa de presentación de la App Móvil y de la Aplicación Web no debe contener lógica de negocio; esta debe residir exclusivamente en los servicios del backend.
- **CA-02** — La capa de persistencia debe ser intercambiable sin afectar la lógica de negocio, permitiendo cambiar el motor de base de datos con el mínimo impacto.
- **CA-03** — El proyecto debe estructurarse en módulos claramente diferenciados: módulo de App Móvil, módulo de Aplicación Web y módulo de backend/servicios.

---

### RNF-17 · Script de base de datos ejecutable · Prioridad: ALTA

**Descripción:**
Debe entregarse un script SQL completo que permita recrear el esquema de base de datos compartido por la App Móvil y la Aplicación Web, incluyendo los datos de configuración inicial, en cualquier entorno sin intervención manual.

**Criterios de Aceptación:**
- **CA-01** — El script debe crear todas las tablas, relaciones, llaves primarias, foráneas e índices necesarios para soportar las operaciones de ambas plataformas.
- **CA-02** — El script debe incluir los datos iniciales: tipos de PQRS, estados posibles (Nuevo, En proceso, Resuelto, Rechazado) y al menos un usuario gestor con acceso a la Aplicación Web.
- **CA-03** — El script debe ser idempotente: ejecutarse múltiples veces sin generar errores ni datos duplicados.

---

### RNF-18 · Código fuente documentado y entregable · Prioridad: MEDIA

**Descripción:**
El código fuente de las tres componentes del sistema (App Móvil, Aplicación Web y backend) debe estar debidamente comentado y organizado, permitiendo que cualquier desarrollador pueda comprender, desplegar y mantener la solución de forma independiente.

**Criterios de Aceptación:**
- **CA-01** — Las clases y métodos principales de cada componente deben contar con comentarios que describan su propósito, parámetros y valor de retorno.
- **CA-02** — Cada componente (App Móvil, Aplicación Web, backend) debe entregarse con un archivo README que incluya instrucciones claras de configuración y despliegue.
- **CA-03** — Los archivos desplegables de cada plataforma (.apk/.ipa para la App Móvil, .war/.jar o equivalente para la Aplicación Web y backend) deben entregarse junto al código fuente.

---

## 6. Usabilidad

### RNF-19 · Interfaz intuitiva en la App Móvil para el cliente · Prioridad: ALTA

**Descripción:**
La App Móvil debe diseñarse de forma que cualquier cliente de SuperMarket pueda registrar su PQRS, autenticarse y consultar el historial de sus radicados sin necesidad de capacitación previa, siguiendo convenciones de diseño móvil ampliamente aceptadas.

**Criterios de Aceptación:**
- **CA-01** — El flujo completo de radicación de una PQRS en la App Móvil debe completarse en 5 pasos o menos desde el inicio de la aplicación.
- **CA-02** — Los campos del formulario de radicación deben estar claramente etiquetados e indicar el formato esperado (tipo de identificación, correo electrónico, etc.).
- **CA-03** — Los mensajes de error de validación deben mostrarse en línea, junto al campo que los origina, en lenguaje comprensible para el usuario final sin tecnicismos.

---

### RNF-20 · Interfaz funcional en la Aplicación Web para el gestor · Prioridad: MEDIA

**Descripción:**
La Aplicación Web debe ofrecer al gestor de PQRS una interfaz clara y eficiente que facilite la consulta, el filtrado por tipo y estado, el cambio de estado con justificación, la descarga de adjuntos y la generación de reportes PDF, sin requerir conocimientos técnicos avanzados.

**Criterios de Aceptación:**
- **CA-01** — El listado de radicados en la Aplicación Web debe mostrar toda la información requerida en una vista tabular con opciones de filtrado visibles y accesibles.
- **CA-02** — El cambio de estado de una PQRS debe realizarse en la misma vista del listado, sin necesidad de navegar a pantallas adicionales o complejas.
- **CA-03** — Las acciones de descarga de adjunto y generación de PDF deben ser accesibles mediante botones claramente etiquetados en la interfaz del gestor.

---

### RNF-21 · Retroalimentación visual de acciones en ambas plataformas · Prioridad: MEDIA

**Descripción:**
Tanto la App Móvil como la Aplicación Web deben informar al usuario el resultado de cada acción ejecutada mediante mensajes claros, evitando estados de incertidumbre o pantallas en blanco.

**Criterios de Aceptación:**
- **CA-01** — Al radicar exitosamente una PQRS desde la App Móvil, el sistema debe mostrar el número de radicado asignado e indicar que se envió un correo de confirmación.
- **CA-02** — Al cambiar el estado de una PQRS desde la Aplicación Web, el gestor debe recibir una confirmación visual inmediata de que la acción fue guardada.
- **CA-03** — Los errores (fallo de red, validación, sesión expirada) deben presentarse con mensajes descriptivos y sugerencias de acción en ambas plataformas.
- **CA-04** — Las operaciones que tomen más de 2 segundos en cualquiera de las dos plataformas deben mostrar un indicador de progreso visible.

---

### RNF-22 · Soporte exclusivo de adjuntos en formato PDF · Prioridad: MEDIA

**Descripción:**
La App Móvil debe permitir adjuntar únicamente archivos PDF al momento de radicar una PQRS. La Aplicación Web debe permitir al gestor descargar dichos adjuntos. Ambas plataformas deben validar la integridad del archivo.

**Criterios de Aceptación:**
- **CA-01** — El selector de archivos de la App Móvil debe filtrar y mostrar únicamente archivos con extensión `.pdf`.
- **CA-02** — Si el cliente intenta adjuntar un archivo con otro formato desde la App Móvil, el sistema debe rechazarlo con un mensaje explicativo.
- **CA-03** — El tamaño máximo del archivo adjunto debe estar limitado a 5 MB; ambas plataformas deben notificar al usuario si se excede este límite.
- **CA-04** — La Aplicación Web debe permitir al gestor descargar el adjunto de cualquier radicado de forma directa desde el listado de PQRS.

---

## 7. Legales y Cumplimiento

### RNF-23 · Protección de datos personales (Ley 1581 de 2012) · Prioridad: ALTA

**Descripción:**
El sistema debe cumplir con la Ley Estatutaria 1581 de 2012 de Colombia (Habeas Data) en todas sus plataformas. La App Móvil recoge datos personales del cliente al registrarlo; la Aplicación Web los administra. Ambas deben garantizar el uso apropiado de dicha información.

**Criterios de Aceptación:**
- **CA-01** — La App Móvil debe mostrar la política de tratamiento de datos personales al momento del primer registro del cliente, requiriendo su aceptación explícita antes de continuar.
- **CA-02** — Los datos personales (nombre, correo, teléfono, identificación) gestionados en la Aplicación Web solo deben usarse para las finalidades declaradas en la política.
- **CA-03** — Debe existir un mecanismo documentado para que el cliente solicite la consulta, corrección o eliminación de sus datos personales del sistema.

---

### RNF-24 · Trazabilidad completa de radicados · Prioridad: ALTA

**Descripción:**
Cada PQRS registrada desde la App Móvil debe contar con un identificador único e irrepetible y una fecha de radicación inmutable. El historial de cambios de estado efectuados desde la Aplicación Web debe quedar igualmente registrado, garantizando trazabilidad completa del ciclo de vida.

**Criterios de Aceptación:**
- **CA-01** — El número de radicado debe generarse automáticamente por el sistema al recibir la solicitud desde la App Móvil, sin intervención del cliente ni del gestor.
- **CA-02** — La fecha y hora de radicación deben registrarse automáticamente en el momento de la creación y no pueden ser modificadas por ningún usuario en ninguna de las dos plataformas.
- **CA-03** — Cada cambio de estado realizado desde la Aplicación Web debe quedar registrado con la justificación ingresada por el gestor, la fecha del cambio y el identificador del gestor responsable.

---

### RNF-25 · Estrategia Cero Papel · Prioridad: ALTA

**Descripción:**
Todo el ciclo de vida de las PQRS debe ser completamente digital, en línea con la iniciativa ecológica y antitrámites de SuperMarket. La App Móvil y la Aplicación Web deben ser los únicos canales de interacción; no se debe requerir impresión, firma física ni entrega presencial.

**Criterios de Aceptación:**
- **CA-01** — La radicación de PQRS debe realizarse exclusivamente a través de la App Móvil; no se admiten canales presenciales ni físicos.
- **CA-02** — El seguimiento y la resolución de PQRS deben gestionarse exclusivamente desde la Aplicación Web por parte del gestor.
- **CA-03** — Las notificaciones al cliente deben realizarse por correo electrónico, sin generación ni envío de documentos físicos.
- **CA-04** — Los reportes generados por el gestor en la Aplicación Web deben descargarse en formato PDF digital sin requerir impresión obligatoria.
