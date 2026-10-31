# Integración del panel administrativo

Las rutas `/admin/dashboard`, `/admin/soporte` y `/admin/usuarios` no incluyen registros de ejemplo. Los números se muestran como `—` hasta recibir datos. `null` representa información sin cargar; una lista vacía con `cargado: true` representa una consulta completada sin resultados.

Buscar `TODO BACKEND` en los archivos de admin para localizar los puntos de integración.

| Archivo | Integración pendiente |
| --- | --- |
| `src/App.jsx` | Guard de sesión y rol para `/admin`; manejo de 401 y 403. |
| `src/layouts/AdminLayout.jsx` | Carga compartida, identidad, estado del sistema, métricas, errores, reintentos y actualización tras acciones. |
| `src/data/estadoAdmin.js` | Modelos de vista vacíos y servicio de acciones. Los campos documentados son un formato de UI, no un contrato de API definitivo. |
| `src/pages/admin/PanelAdmin.jsx` | Métricas globales, tickets recientes y cola de verificación; aprobación/rechazo con revisión documental y auditoría. |
| `src/pages/admin/SoporteAdmin.jsx` | Listado paginado, filtros, mensajes, lectura, respuesta y cambio de estado. |
| `src/pages/admin/UsuariosAdmin.jsx` | Búsqueda/paginación en servidor, activación/suspensión, confirmación y protección de cuentas administrativas. |

El selector de dashboards permite revisar las pantallas locales; no autentica ni concede permisos. Debe adaptarse a los roles de la sesión. El backend debe autorizar todas las consultas y mutaciones y auditar los cambios administrativos.

Al conectar las consultas, agregar estados de carga, fallo y reintento por recurso. Evitar interpretar un fallo como lista vacía. Cancelar peticiones obsoletas y mantener coherentes métricas, pendientes y listados después de una mutación. En soporte, conservar el borrador si falla el envío y limpiarlo solo cuando el servidor confirme la respuesta. No se simula éxito: el servicio de acciones actual devuelve un error hasta que se implemente.
