# Laboratorio 6 — Base de Datos PostgreSQL, Arquitectura Back End e Integración Front End

Este informe revisa, **para los temas de la semana**, la evidencia existente en el
sistema de gestión de incidencias. El back end está construido con **Express 5 +
TypeScript + PostgreSQL** (alojado en **Supabase**) y el front end con **React 19 +
Vite**, por lo que cada tema se documenta con su equivalente real en este stack.

> **Temas omitidos por no estar implementados en este repositorio:** migraciones con
> **Flyway** y **Docker Compose** (tema 2), **replicación / copias de seguridad** (tema 3)
> y **pruebas automatizadas** con Testcontainers/Jest (tema 7). El esquema vive en la base
> de datos de Supabase; no se versiona con archivos de migración en el repositorio.

> Base técnica: [`ARQUITECTURA.md`](../../ARQUITECTURA.md) · Requerimientos: [`REQUERIMIENTOS.md`](../../REQUERIMIENTOS.md)

---

## 1. Diseño e Implementación de Base de Datos en PostgreSQL

### 1.1 Modelo físico

El modelo se deduce de las consultas SQL de la capa de repositorios
(`proyecto-integrador-back/src/repositories/*`). Todas las tablas usan **clave primaria
surrogate** `id` y **claves foráneas** hacia `usuarios` / `equipos` / `tickets`.

| Tabla | Columnas principales | Claves y relaciones |
| :--- | :--- | :--- |
| `usuarios` | `id`, `nombre`, `correo`, `rol`, `area`, `estado`, `fono`, `password_hash`, `debe_cambiar_contrasena` | PK `id`; `correo` único |
| `tickets` | `id`, `descripcion`, `nombre_solicitante`, `usuario_id`, `prioridad`, `estado`, `tecnico_id`, `equipo_id`, `creado_en` | FK `usuario_id`→`usuarios`, `tecnico_id`→`usuarios`, `equipo_id`→`equipos` |
| `sla_prioridades` | `id`, `nivel`, `descripcion`, `minutos_respuesta`, `minutos_resolucion`, `minutos_escalamiento`, `actualizado_en` | PK `id` |
| `equipos` | `id`, `codigo`, `nombre`, `area`, `tipo`, `estado`, `creado_en` | PK `id`; `codigo` = identidad de inventario (único) |
| `disponibilidad` | `usuario_id`, `horario` | FK `usuario_id`→`usuarios`; `UNIQUE(usuario_id)` (upsert `ON CONFLICT`) |
| `articulos_conocimiento` | `id`, `titulo`, `categoria`, `autor_id`, `contenido`, `vistas`, `creado_en` | FK `autor_id`→`usuarios` |
| `evaluaciones` | `id`, `ticket_id`, `tecnico_id`, `evaluador_id`, `puntuacion`, `comentario`, `creado_en` | FK `ticket_id`→`tickets`, `tecnico_id`/`evaluador_id`→`usuarios` |

La `disponibilidad` usa **upsert** (`insert ... on conflict (usuario_id) do update`), lo que
exige y aprovecha una restricción `UNIQUE` sobre `usuario_id`
(`availability.repository.ts:59`).

### 1.2 Integridad de datos y reglas de negocio a nivel de motor

Las reglas del dominio se refuerzan con restricciones del motor, además de la validación en
servicios:

- **`NOT NULL`:** campos obligatorios del alta (`nombre`, `correo`, `rol`, `area`;
  `descripcion`, `prioridad` en tickets; tiempos del SLA, etc.).
- **`FOREIGN KEY`:** la integridad referencial se delega expresamente al motor — en
  `ticket.service.ts:57` se documenta que *"la integridad la garantiza la llave foránea de
  la base de datos"* (`usuario_id`, `tecnico_id`, `equipo_id`, `autor_id`, `ticket_id`).
- **`UNIQUE`:** `correo` (login por correo), `codigo` de inventario y `usuario_id` en
  disponibilidad.
- **`CHECK` (catálogos cerrados):** los valores permitidos están definidos como uniones
  literales en los tipos del dominio y se validan en el servicio antes de llegar al motor:
  `rol`, `estado` de usuario, `prioridad` y `estado` de ticket, `nivel` de SLA, `tipo`/`estado`
  de equipo, `categoría` de conocimiento y `puntuación` (1–5).

Ejemplo de regla de negocio validada, no solo almacenada:

```ts
// ticket.service.ts — máquina de estados del ticket
TRANSICIONES_ESTADO = {
  Abierto:       ['En progreso', 'Cancelado'],
  'En progreso': ['Cerrado'],
  Cerrado:       [],
  Cancelado:     [],
};
```

### 1.3 Manejo de fechas y zona horaria

- Las marcas de tiempo (`creado_en`, `actualizado_en`) se escriben con `now()` en el motor
  (`sla.repository.ts:82`).
- El repositorio **normaliza a ISO 8601 en UTC** antes de exponer el dato al dominio:
  `creadoEn: new Date(fila.creado_en).toISOString()` (`ticket.repository.ts:59`).
- El **formateo a la zona/local** del usuario ocurre recién en el front end con
  `Intl.DateTimeFormat('es-PE')` (`src/utils/date.ts`), evitando ambigüedad de zonas en la
  capa de datos.

---

## 2. Patrones de Acceso a Datos y Arquitectura Back End

### 2.1 Arquitectura en capas

El back end sigue una separación estricta **Rutas → Controladores → Servicios →
Repositorios**, equivalente a la tríada *Controller / Service / Repository* de Spring Boot:

| Capa | Directorio | Responsabilidad |
| :--- | :--- | :--- |
| Rutas | `src/routes/` | Mapeo HTTP por recurso; montadas bajo `/api/v1` (`routes/index.ts`) |
| Controladores | `src/controllers/` | Acotan `req.body`/`req.params`, orquestan y responden HTTP (sin lógica de negocio) |
| Servicios | `src/services/` | Lógica de negocio y validación de dominio; lanzan `HttpError` |
| Repositorios | `src/repositories/` | SQL parametrizado + mapeo fila → dominio (nadie más toca la BD) |

Cadena típica: `route → controller → service → repository → pool pg`.

### 2.2 Patrón Repositorio

Cada dominio define una **interfaz** (`UsuarioRepositorio`, `TicketRepositorio`,
`SlaRepositorio`, …) y una **implementación PostgreSQL** (`PostgresUsuarioRepositorio`, …).
El SQL crudo vive **únicamente** en los repositorios y siempre es **parametrizado**
(`$1`, `$2`, …), lo que previene inyección y aísla el acceso a datos de la lógica de negocio.

### 2.3 Proyecciones y DTOs (no exponer columnas internas)

El equivalente a las proyecciones cerradas (`SlotView`) y a los DTOs de respuesta
(`SpecialtyResponse`) de Spring se resuelve con **interfaces de fila** y un **mapeador a
dominio**:

```ts
interface FilaUsuario { id: number; nombre: string; /* ... */ debe_cambiar_contrasena: boolean }

const aDominio = (fila: FilaUsuario): Usuario => ({
  id: String(fila.id),                 // id interno numérico → string de dominio
  /* ... */
});                                      // `password_hash` nunca sale del repositorio
```

Así, detalles internos como `password_hash` o los `id` numéricos **no se exponen** en la
respuesta de la API: el dominio usa `id: string` y omite la credencial.

---

## 3. Desarrollo de la API REST y Manejo de Errores

### 3.1 Endpoints de consulta

La API expone servicios REST bajo `/api/v1`. Los catálogos y listados se resuelven con
**GET**:

| Endpoint | Recurso | Archivo |
| :--- | :--- | :--- |
| `GET /api/v1/users` | Usuarios | `routes/user.routes.ts` |
| `GET /api/v1/tickets` | Tickets | `routes/ticket.routes.ts` |
| `GET /api/v1/sla` | Prioridades SLA | `routes/sla.routes.ts` |
| `GET /api/v1/equipments` | Equipos | `routes/equipment.routes.ts` |
| `GET /api/v1/knowledge-base` | Artículos de conocimiento | `routes/knowledge.routes.ts` |
| `GET /api/v1/availability` | Disponibilidad de técnicos | `routes/availability.routes.ts` |

### 3.2 Manejo global de excepciones

Dos middlewares centralizan los errores, evitando repetir `try/catch` por controlador y
**sin revelar trazas ni SQL**:

- **`notFound`** (`middlewares/notFound.ts`): rutas no encontradas → `404` con
  `{ error, path }`.
- **`errorHandler`** (`middlewares/errorHandler.ts`): si el error es `HttpError`, responde con
  su código y `{ error: message }`; cualquier otro error se registra en consola y devuelve un
  `500` **genérico** (`"Error interno del servidor"`), sin stack ni código SQL.

`HttpError` (`utils/httpError.ts`) tipa los estados usados: `400`, `401`, `403`, `404`, `409`.
El payload es un objeto `{ error }` **estandarizado** (semánticamente equivalente a
*Problem Details*, aunque no sigue literalmente RFC 7807).

Además, la autorización se resuelve con middleware: `requerirAutenticacion` valida el JWT y
`requerirRol(...)` restringe por rol (`middlewares/auth.ts`, aplicado en `routes/index.ts`).

---

## 4. Integración con el Front End y Proxy de Desarrollo

### 4.1 Consumo de la API (equivalente a `HttpClient`)

El buscador simulado se reemplazó por **peticiones HTTP reales** con un cliente propio
`src/services/apiClient.ts`:

- `apiGet<T>(path, signal?)` y `apiSend<T>(path, method, body)` sobre `fetch`, con base
  `/api/v1`.
- Adjunta el **token Bearer** desde `sessionStorage` (`cabecerasDeSesion`).
- Lee errores estandarizados (`{ error }`) y, ante un `401`, **limpia la sesión y redirige a
  `/login`** (`manejarSesionInvalida`).
- Un módulo por recurso (`usersApi`, `ticketsApi`, `slasApi`, `reportsApi`, …).

### 4.2 Proxy local (evitar CORS)

`vite.config.ts` redirige las peticiones `/api` hacia el back end, de modo que el front usa
**rutas relativas** y no hay CORS en desarrollo:

```ts
server: {
  proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } },
}
```

### 4.3 Gestión de estado en la interfaz

Cada página maneja explícitamente los cuatro estados de una petición:

- **Carga** (`isLoading` → spinner/mensaje), **vacío** (mensaje cuando no hay datos),
  **error** (`role="alert"` con el mensaje del servidor) y **éxito**.
- **Cancelación automática de peticiones previas:** los efectos crean un `AbortController` y
  lo abortan en el *cleanup*, pasando `signal` a `apiGet`, de forma que una petición quedó
  obsoleta (recarga, cambio de filtro o desmontaje) se cancela en lugar de competir con la
  nueva.

```tsx
useEffect(() => {
  const controller = new AbortController();
  obtenerReporte(controller.signal)
    .then(setReport)
    .catch((e) => { if (!(e instanceof DOMException && e.name === 'AbortError')) setError(toMessage(e)); })
    .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
  return () => controller.abort();          // cancela la petición pendiente
}, []);
```
