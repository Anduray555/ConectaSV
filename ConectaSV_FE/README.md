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

## Dashboards preparados para el backend

Los dashboards de estudiante y empresa inician con estructuras vacías en `src/data/estadoDashboard.js`. Se eliminaron los archivos de registros ficticios. Los menús, filtros, tipos de oferta y tipos de documento siguen siendo configuración de la interfaz.

### Entrada de datos

`DashboardLayout` y `EmpresaLayout` mantienen el estado compartido `datos` y exponen `setDatos` mediante el contexto de `Outlet`. Conectar allí las consultas de la sesión autenticada y adaptar sus respuestas a estos modelos. Las vistas hijas consumen `useOutletContext()`.

- **Estudiante:** `perfil`, `sesion`, `ofertas`, `conversaciones`, `expediente`.
- **Empresa:** `empresa`, `ofertas`, `candidatos`, `expedientes`, `conversaciones`, `resumen`.
- **Ausencia de información:** listas `[]`, campos de formularios `''`, expediente `null`, totales/plan/verificación `null`. Un total desconocido muestra `—`; un cero confirmado debe llegar como `0`.
- Mantener todos los campos del modelo inicial al adaptar respuestas parciales. Los arrays de habilidades, etiquetas, sectores y mensajes deben existir aunque estén vacíos.

### Formatos consumidos por las vistas

Los siguientes campos describen el modelo de presentación, no endpoints ni un contrato obligatorio del servidor:

| Colección/objeto | Campos |
| --- | --- |
| Oferta de estudiante | `id`, `titulo`, `empresa`, `siglas`, `color`, `ubicacion`, `salario`, `tipo` (`empleo`, `practica`, `servicio`), `etiquetas`, `publicado`, `aplicantes` |
| Oferta de empresa | `id`, `titulo`, `ubicacion`, `salario`, `tipo` (etiqueta visible), `etiquetas`, `descripcion`, `publicado`, `activa` |
| Candidato | `id`, `nombre`, `siglas`, `carrera`, `universidad`, `ofertaId`, `estado`, `match`, `habilidades` |
| Conversación | `id`, `empresa` (nombre del interlocutor), `siglas`, `color`, `vacante`, `hora`, `sinLeer`, `enLinea`, `mensajes` |
| Mensaje | `id`, `de` (`yo` o `empresa`, clase visual de recibido), `texto`, `hora` |
| Expediente de estudiante | `empresa`, `siglas`, `proyecto`, `periodo`, `horas`, `documentos` |
| Expediente de empresa | `estudianteId`, `estudiante` (opcional: nombre y siglas), `proyecto`, `documentos` |
| Documento | Diccionario por tipo `carta`, `proyecto`, `plan`; cada documento contiene `url`, `nombre`, `fecha`, `peso`, `fuente` |

Los campos de perfil, sesión y resumen están explícitos en `estadoDashboard.js`. Las métricas globales de empresa provienen de `resumen`, evitando confundir una página de candidatos con los totales reales. Los tres espacios de documentos se conservan incluso sin expediente. Las URLs deben corresponder a archivos autorizados y disponibles.

### Operaciones pendientes

Los formularios conservan sus campos, validaciones y borradores. Guardar perfiles/ofertas, eliminar, cambiar estado, enviar mensajes, generar y cargar PDFs aún no hacen peticiones ni crean registros locales. Muestran que la operación no está conectada, sin confirmar éxito ni limpiar el borrador. El botón de edición de estudiante permanece deshabilitado hasta implementar su formulario/operación.

Buscar `TODO API` y `TODO BACKEND` en `src`. Conectar las operaciones y actualizar el estado solo con respuestas confirmadas. Incorporar carga, errores y reintentos al definir las peticiones. La sesión, autorización por rol, verificación, plan, lecturas y presencia deben provenir del backend. Los enlaces entre dashboards únicamente navegan; no autorizan acceso.

La landing mantiene su contenido de presentación y su vista de ejemplo en `src/data/landing.js`, independiente de ambos dashboards.

### Verificación

Con una versión de Node compatible con Vite, ejecutar:

```sh
npm run lint
npm run build
node tests/dashboard-render.mjs
```

La prueba renderiza las diez rutas de dashboard sin registros y comprueba ausencia de datos ficticios, espacios de documentos y totales desconocidos.
