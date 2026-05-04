# Requerimientos Funcionales — PQRS SuperMarket

**HU-01** Radicar PQRS

**Historia de Usuario:**  
> *Como **cliente**, quiero diligenciar y enviar una PQRS desde la página web, para registrar formalmente mi petición, queja, reclamo o sugerencia ante SuperMarket.*

**Descripción:**  
El sistema debe permitir a los clientes registrar peticiones, quejas, reclamos o sugerencias mediante un formulario disponible en la página web.

**Prioridad:** Alta  

**Actor principal:** Cliente

**Precondiciones:**
  
PRE-1: El sistema debe tener conexión a internet.  
PRE-2: El módulo PQRS debe estar disponible.

**Criterios de aceptación:**
- El formulario solicita todos los campos obligatorios: tipo y número de identificación, nombre, correo, teléfono, tipo de radicado y comentarios.
- El sistema permite adjuntar un archivo PDF opcional.
- El sistema genera automáticamente número de radicado y fecha al enviar.
- Si algún campo obligatorio está vacío, el sistema muestra un mensaje de error descriptivo y no permite el envío.

**Flujo principal:**  
1. El cliente ingresa al módulo PQRS.  
2. El sistema muestra el formulario.  
3. El cliente diligencia los campos obligatorios.  
4. El cliente selecciona el tipo de solicitud.  
5. El cliente escribe el detalle del caso.  
6. El cliente adjunta un PDF opcional.  
7. El cliente presiona enviar.  
8. El sistema valida la información.  
9. El sistema registra la solicitud.  
10. El sistema genera número de radicado y fecha.  
11. El sistema muestra mensaje de confirmación.

**Salida esperada:**  
Número de radicado, fecha de registro y confirmación exitosa.

**Excepciones:**  
E-1: Campos obligatorios vacíos.  
E-2: Archivo no permitido.  
E-3: Fallo de conexión.  
E-4: Error al registrar la PQRS.

---

**HU-02** Registro automático de cliente nuevo

**Historia de Usuario:**  
> *Como **visitante**, quiero que el sistema me registre automáticamente al radicar mi primera PQRS, para no tener que crear una cuenta por separado antes de usar el servicio.*

**Descripción:**  
El sistema permitirá registrar nuevos clientes mediante un formulario digital y almacenará la información en la base de datos.

**Prioridad:** Alta  

**Actor principal:** Visitante

**Precondiciones:**  
PRE-1: El usuario no debe estar registrado.  
PRE-2: El sistema debe tener conexión a internet.

**Criterios de aceptación:**
- El sistema verifica el número de identificación antes de crear el registro.
- Si el cliente ya existe, se usa el registro existente sin duplicarlo.
- Si el cliente no existe, se crea el registro con los datos del formulario de radicación.

**Flujo principal:**  
1. El usuario accede al formulario de registro.  
2. Ingresa sus datos personales.  
3. El sistema valida la información.  
4. El sistema registra al usuario.  
5. El sistema confirma el registro exitoso.

**Salida esperada:**  
Cuenta creada correctamente.

**Excepciones:**  
E-1: Correo ya registrado.  
E-2: Campos incompletos.

---

**HU-03** Recepción de correo de confirmación

**Historia de Usuario:**  
Como cliente nuevo, quiero recibir un correo de confirmación, para validar mi registro.

**Descripción:**  
El sistema enviará automáticamente un correo de bienvenida o confirmación después del registro.

**Prioridad:** Media

**Actor principal:** Cliente

**Precondiciones:**  
PRE-1: Registro exitoso.  
PRE-2: Correo válido.

**Criterios de aceptación:**
- El correo se envía al email ingresado en el formulario inmediatamente después del registro exitoso.
- Si el correo no puede enviarse, el sistema notifica el error sin cancelar el radicado.

**Flujo principal:**  
1. El sistema detecta nuevo registro.  
2. Genera correo automático.  
3. Envía mensaje al correo registrado.

**Salida esperada:**  
Correo de confirmación recibido.

**Excepciones:**  
E-1: Error en servidor de correo.

---

**HU-04** Inicio de sesión en el sistema

**Historia de Usuario:**  
> *Como **cliente**, quiero autenticarme en la página web con mis credenciales, para acceder de forma segura a mis PQRS radicados.*

**Descripción:**  
El sistema permitirá autenticación mediante número de identificación y contraseña.

**Prioridad:** Alta

**Actor principal:** Cliente

**Precondiciones:**  
PRE-1: Usuario registrado. 

**Criterios de aceptación:**
- El sistema valida las credenciales contra los datos almacenados (contraseña cifrada).
- Si las credenciales son incorrectas, se muestra un mensaje de error sin revelar cuál campo falló.
- El acceso se concede únicamente con credenciales válidas.

**Flujo principal:**  
1. El usuario ingresa credenciales.  
2. El sistema valida datos.  
3. Permite acceso.

**Salida esperada:**  
Acceso al panel principal.

**Excepciones:**  
E-1: Datos incorrectos.

---

**HU-05** Consulta del listado de radicados propios

**Historia de Usuario:**  
> *Como **cliente**, quiero consultar el listado de todas mis PQRS radicadas, para hacer seguimiento al estado de cada una.*

**Descripción:**  
El sistema mostrará únicamente las PQRS asociadas al cliente autenticado.

**Prioridad:** Media

**Actor principal:** Cliente

**Precondiciones:**  
PRE-1: Sesión iniciada.

**Criterios de aceptación:**
- El listado muestra únicamente los radicados del cliente autenticado.
- Cada fila incluye: número de radicado, fecha, tipo, comentarios, anexo, estado y justificación.
- El listado se ordena por fecha descendente (más reciente primero).

**Flujo principal:**  
1. El cliente ingresa al módulo Mis Radicados.  
2. El sistema consulta registros asociados.  
3. Muestra listado.

**Salida esperada:**  
Listado personal de radicados.

**Excepciones:**  
E-1: Cliente no ha realizado radicados

---

**HU-06** Filtrado de radicados por número de radicado

**Historia de Usuario:**  
> *Como **cliente**, quiero filtrar mis radicados por número de radicado, para encontrar rápidamente una PQRS específica.*

**Descripción:**  
El sistema permitirá búsqueda exacta por número de radicado.

**Prioridad:** Media

**Actor principal:** Cliente

**Precondiciones:**  
PRE-1: Sesión iniciada.

**Criterios de aceptación:**
- El campo de filtro acepta búsqueda parcial o exacta del número de radicado.
- El listado se actualiza en tiempo real al ingresar el criterio.
- Si no hay resultados, se muestra un mensaje indicándolo.

**Flujo principal:**  
1. El usuario escribe número de radicado.  
2. El sistema consulta coincidencia.  
3. Muestra resultado.

**Salida esperada:**  
Radicado encontrado.

**Excepciones:**  
E-1: No existe radicado.

---

**HU-07** Adjunto de archivo PDF en la radicación

**Historia de Usuario:**  
> *Como **cliente**, quiero adjuntar un archivo PDF a mi PQRS, para respaldar mi solicitud con documentación de soporte.*

**Descripción:**  
El sistema permitirá cargar archivos PDF durante la radicación.

**Prioridad:** Alta

**Actor principal:** Cliente

**Precondiciones:**  
PRE-1: Sesión iniciada

**Criterios de aceptación:**
- Solo se permite adjuntar archivos en formato PDF.
- El sistema valida el tipo de archivo antes de enviar; rechaza cualquier otro formato con un mensaje claro.
- El archivo queda asociado al radicado y disponible para descarga posterior.

**Flujo principal:**  
1. El usuario selecciona archivo.  
2. El sistema valida formato PDF.  
3. Adjunta documento.

**Salida esperada:**  
Archivo cargado correctamente.

**Excepciones:**  
E-1: Formato no permitido.

---

**HU-08** Inicio de sesión del gestor de PQRS

**Historia de Usuario:**  
> *Como **gestor**, quiero autenticarme en la aplicación web con usuario y contraseña, para acceder al panel de administración de radicados.*

**Descripción:**  
El sistema permitirá acceso administrativo.

**Prioridad:** Alta

**Actor principal:** Gestor PQRS

**Precondiciones:**  
PRE-1: El gestor debe haber iniciado sesión en el sistema.

**Criterios de aceptación:**
- El acceso se concede solo con credenciales válidas de un usuario con perfil Gestor.
- Las credenciales incorrectas generan un mensaje de error sin dar pistas sobre cuál campo falló.
- La sesión expira tras un periodo de inactividad definido.

**Flujo principal:**  
1. El gestor ingresa credenciales.  
2. Sistema valida rol.  
3. Acceso al panel administrativo.

**Salida esperada:**  
Ingreso exitoso.

**Excepciones:**  
E-1: Sesión expirada o no autorizada.

---

**HU-09** Consulta del listado completo de radicados

**Historia de Usuario:**  
> *Como **gestor**, quiero consultar el listado de todos los radicados del sistema, para tener visibilidad global de las solicitudes de los clientes.*

**Descripción:**  
El sistema mostrará todas las PQRS registradas al usuario administrativo.

**Prioridad:** Alta

**Actor principal:** Gestor PQRS

**Precondiciones:**  
PRE-1: El gestor debe haber iniciado sesión en el sistema.

**Criterios de aceptación:**
- El listado muestra todos los radicados sin importar el cliente.
- Cada fila incluye: número de radicado, fecha, tipo, comentarios, anexo, estado y justificación.
- El listado se puede paginar o desplazar si el volumen de registros es alto.

**Flujo principal:**  
1. El gestor ingresa al módulo de gestión.  
2. El sistema consulta todos los registros.  
3. Muestra listado general.

**Salida esperada:**  
Listado completo.

**Excepciones:**  
E-1: Sesión expirada o no autorizada.

---

**HU-10** Filtrado de radicados por tipo y estado

**Historia de Usuario:**  
> *Como **gestor**, quiero filtrar el listado de radicados por tipo de radicado y/o estado, para priorizar y gestionar eficientemente las solicitudes pendientes.*

**Descripción:**  
El sistema permitirá filtrar por tipo de PQRS y estado.

**Prioridad:** Alta

**Actor principal:** Gestor PQRS

**Precondiciones:**  
PRE-1: El gestor debe haber iniciado sesión.

**Criterios de aceptación:**
- Los filtros disponibles son: tipo de radicado (P/Q/R/S) y estado (Nuevo, En proceso, Resuelto, Rechazado).
- Los filtros se pueden aplicar de forma individual o combinada.
- El listado se actualiza al aplicar o limpiar cualquier filtro.

**Flujo principal:**  
1. El gestor selecciona la pestaña de filtros. 
2. El gestor selecciona los filtros que va a usar. 
3. El sistema procesa consulta.  
4. Muestra coincidencias.

**Salida esperada:**  
Listado filtrado.

**Excepciones:**  
E-1: Sesión expirada o no autorizada.

---

**HU-11** Cambio de estado de una PQRS

**Historia de Usuario:**  
> *Como **gestor**, quiero cambiar el estado de un radicado e ingresar una justificación, para informar al cliente sobre el avance o resolución de su solicitud.*

**Descripción:**  
El sistema permitirá cambiar estados en las PQRS radicadas.

**Prioridad:** Alta

**Actor principal:** Gestor PQRS

**Precondiciones:**  
PRE-1: El gestor debe haber iniciado sesión en el sistema.

**Criterios de aceptación:**
- Los estados disponibles son: Nuevo, En proceso, Resuelto, Rechazado.
- El campo de justificación es obligatorio; no se permite el cambio de estado sin él.
- El nuevo estado y la justificación quedan registrados y visibles en la web tanto para administrador como para cliente.

**Flujo principal:**  
1. El gestor selecciona un radicado del listado.
2. El gestor escoge el nuevo estado.
3. El gestor ingresa la justificación (campo obligatorio).
4. El sistema valida que la justificación no este vacia.
5. El sistema guarda el cambio de estado y justificación.
6. El listado se actualiza con el nuevo estado.

**Salida esperada:**  
Estado actualizado.

**Excepciones:**  
E-1: Sesión expirada o no autorizada.

---

**HU-12** Descarga de anexo PDF 

**Historia de Usuario:**  
> *Como **gestor**, quiero descargar el archivo PDF adjunto de un radicado, para revisar la documentación de soporte enviada por el cliente.*

**Descripción:**  
El sistema permitirá descargar documentos adjuntos.

**Prioridad:** Alta

**Actor principal:** Gestor PQRS

**Precondiciones:**  
PRE-1: El gestor debe haber iniciado sesión en el sistema.

**Criterios de aceptación:**
- Cada radicado con anexo muestra un botón o enlace de descarga.
- El archivo descargado corresponde exactamente al PDF adjuntado por el cliente.
- Los radicados sin anexo no muestran la opción de descarga (o la muestran deshabilitada).

**Flujo principal:**  
1. El gestor selecciona radicado.  
2. El gestor elige archivo adjunto.  
3. Sistema descarga PDF.

**Salida esperada:**  
Archivo descargado.

**Excepciones:**  
E-1: Sesión expirada o no autorizada.

---

**HU-13** Generación de reporte PDF del listado de radicados

**Historia de Usuario:**  
> *Como **gestor de PQRS**, quiero exportar el listado actual de radicados (con los filtros aplicados) a un archivo PDF, para tener un reporte formal y compartible de las PQRS gestionadas.*

**Descripción:**  
El sistema generará un documento PDF con el listado de radicados.

**Prioridad:** Alta

**Actor principal:** Gestor PQRS

**Precondiciones:**  
PRE-1: El gestor debe haber iniciado sesión en el sistema.

**Criterios de aceptación:**
- El reporte refleja exactamente el listado visible en pantalla al momento de generarlo (con filtros activos).
- La columna de enlace/anexo no se incluye en el reporte.
- El archivo PDF generado es descargable desde el navegador.
- El reporte incluye fecha y hora de generación en el encabezado o pie de página.

**Flujo principal:**  
1. El gestor ingresa al módulo reportes.  
2. El gestor selecciona generar PDF.  
3. El sistema compila datos.  
4. El sistema prepara la descarga reporte.

**Salida esperada:**  
Reporte PDF generado.

**Excepciones:**  
E-1: No existen datos para exportar.
E-2: Sesión expirada o no autorizada.

---