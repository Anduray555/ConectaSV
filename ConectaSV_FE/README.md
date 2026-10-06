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
