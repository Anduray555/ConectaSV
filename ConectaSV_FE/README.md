# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Datos de ejemplo del Dashboard

Todos los registros ficticios están en `src/data/dashboard.mock.js`:

| Exportación | Consumidor | Datos que deberá proporcionar el backend |
| --- | --- | --- |
| `ofertasMock` | Explorar | Oportunidades y datos de las empresas |
| `conversacionesMock` | Mensajes y DashboardLayout | Conversaciones, mensajes y contador sin leer |
| `perfilMock` | MiPerfil y DashboardLayout | Perfil, habilidades y estadísticas del estudiante |
| `documentosSSMock` | DocumentosSS | Datos del estudiante, institución y proyecto |
| `sesionDashboardMock` | DashboardLayout | Rol del usuario y ciclo académico |

Buscar `TODO API` en `src` permite localizar los puntos de integración. Buscar `Mock` permite localizar el uso de datos ficticios. El panel muestra un aviso de datos de ejemplo.

Al integrar el backend:

1. Crear servicios para las peticiones cuando estén definidos los endpoints y la autenticación. Los campos actuales describen el formato que consumen las vistas; no constituyen un contrato definitivo de la API.
2. Reemplazar las importaciones mock por los resultados de esos servicios, adaptando las respuestas al formato de las vistas. Añadir estados de carga, error y datos vacíos; Mensajes necesita manejar la ausencia de conversación activa.
3. Conectar el envío de mensajes y la persistencia de los formularios. Actualmente los mensajes y los cambios de documentos solo viven en el estado local y se pierden al salir de la vista o recargar. El botón Editar perfil todavía no tiene acción.
4. Actualizar el contador de mensajes a partir de los datos reales y retirar el aviso de ejemplo. Eliminar el archivo mock cuando ya no tenga consumidores.

`src/data/dashboard.js` contiene etiquetas de tipos de oferta. Los menús, filtros, campos del formulario y fases del documento son configuración de la interfaz, separada de los registros ficticios.

## Vistas de empresa (demostración local)

Acceder a `/empresa` o usar el enlace **Empresa** del panel de estudiante.

- `/empresa/dashboard`: métricas calculadas a partir de los datos de ejemplo, aplicantes recientes y ofertas activas.
- `/empresa/ofertas`: crear, editar, pausar, activar y eliminar ofertas con confirmación local.
- `/empresa/candidatos`: filtros por oferta y estado; los filtros se conservan en la URL.
- `/empresa/documentos`: selección de estudiante, progreso de los tres tipos de documento, plantillas de ejemplo y carga/vista previa de PDF (máximo 10 MB).
- `/empresa/mensajes`: búsqueda de candidatos, conversaciones y envío temporal de mensajes.
- `/empresa/perfil`: información y edición temporal del perfil de empresa.

Los datos se definen en `src/data/empresa.mock.js`. `EmpresaLayout` mantiene el estado compartido entre las rutas; se reinicia al recargar o salir del panel de empresa. Los archivos PDF cargados permanecen solo en memoria y sus URLs se liberan al salir del panel. La vista de un documento precargado es una plantilla de demostración, no un PDF oficial.

Buscar `TODO BACKEND` en el layout y las páginas de empresa para localizar las consultas y operaciones pendientes. El selector de rol sirve solo para navegar durante la demostración; la autenticación, autorización y verificación de empresa deberán provenir del backend.

### Puntos de integración marcados en el código

Todos los pendientes de las vistas de empresa se localizan buscando `TODO BACKEND`:

| Archivo | Sustituciones pendientes |
| --- | --- |
| `src/App.jsx` y layouts | Sesión y rol, autorización, carga/error, perfil, plan, verificación, contador real de mensajes y retirada de avisos de demostración |
| `src/data/empresa.mock.js` | Todas las fuentes ficticias, campos/ids reales y mapeo de tipos de documento |
| `src/pages/empresa/DashboardEmpresa.jsx` | Totales globales, entrevistas reales, orden por fecha y resumen de ofertas/aplicantes |
| `src/pages/empresa/OfertasEmpresa.jsx` | Consultas, paginación, contrato del formulario, crear/editar/eliminar/pausar/activar, validación y confirmación de persistencia |
| `src/pages/empresa/CandidatosEmpresa.jsx` | Postulaciones, filtros y totales del servidor, estados, compatibilidad y relación con la oferta |
| `src/pages/empresa/DocumentosEmpresa.jsx` | Expedientes reales, estados de archivo, carga/reemplazo/generación, validación y acceso al PDF; retirada de plantillas y valores fijos |
| `src/pages/empresa/MensajesEmpresa.jsx` | Conversaciones/historial, búsqueda, remitentes, envío, lecturas, presencia y sincronización |
| `src/pages/empresa/PerfilEmpresa.jsx` | Estadísticas globales, contrato de perfil, actualización y errores por campo |

Los comentarios describen operaciones necesarias sin inventar endpoints. La selección de pestañas, borradores y apertura/cierre de formularios puede seguir siendo estado de interfaz. Los mensajes de éxito y la actualización de registros deben depender de la respuesta del servidor. El backend también debe comprobar permisos y validar los datos/archivos recibidos.
