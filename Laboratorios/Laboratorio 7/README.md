# Laboratorio 7 — Autenticación JWT, Autorización RBAC, Integridad y Defensa Perimetral

Este informe revisa, **para los temas de la semana**, la evidencia existente en el sistema
de gestión de incidencias. El stack real es **Express 5 + TypeScript + jsonwebtoken +
bcryptjs + PostgreSQL (Supabase)** en el back end y **React 19 + React Router 7 + Vite** en
el front end; cada tema se documenta con su equivalente en este stack.

> **Temas omitidos por no estar implementados en este repositorio:** identificador de
> correlación `X-Correlation-ID` y tabla de auditoría `audit_event`; **bloqueo pesimista y
> transacciones multi-consulta**; **throttling** del login por IP (HTTP 429 + `Retry-After`);
> **cabeceras de seguridad CSP** y **pruebas automatizadas**. Además, el token de sesión
> **no** se maneja únicamente en memoria: se persiste en `sessionStorage` (ver §1.3).

> Base técnica: [`ARQUITECTURA.md`](../../ARQUITECTURA.md) · Laboratorio 6: [`README.md`](../Laboratorio%206/README.md)

---

## 1. Gestión de Identidad y Autenticación Stateless (JWT)

### 1.1 Emisión y validación de tokens JWT

El endpoint **`POST /api/v1/auth/login`** valida las credenciales contra la base de datos y
emite un token **JWT firmado con HS256** (el algoritmo por defecto de `jsonwebtoken`):

- `routes/auth.routes.ts` → `POST /login` y `GET /me`.
- `services/auth.service.ts:47` arma el payload `{ sub, nombre, correo, rol }` y lo firma con
  `jwt.sign(payload, env.jwtSecret, { expiresIn: DURACION_SESION })`.
- **TTL real:** la sesión dura **8 horas** (`DURACION_SESION = '8h'`, `auth.service.ts:12`), el
  TTL acordado por el proyecto (nótese que difiere del TTL de 15 minutos del caso de estudio).
- La validación ocurre en el middleware `requerirAutenticacion` (`middlewares/auth.ts:18`),
  que verifica el token con `jwt.verify` y expone la sesión (`req.sesion`) con `sub`, rol y
  correo para el resto de la cadena.

El token **no viaja en cookies** sino en la cabecera `Authorization: Bearer`, manteniendo el
servidor **stateless**: no hay estado de sesión en memoria ni en el servidor.

### 1.2 Almacenamiento seguro de contraseñas

Las contraseñas nunca se guardan en texto plano ni con cifrado reversible; se almacenan como
**hash BCrypt con sal** (`bcryptjs`), equivalente al `DelegatingPasswordEncoder` con BCrypt de
Spring Security:

- `utils/password.ts:44` → `hashPassword = bcrypt.hashSync(plain, COSTE)` con `COSTE = 10`.
- La verificación usa `bcrypt.compareSync` (`verificarPassword`), nunca comparación directa.
- El alta y el restablecimiento generan una **contraseña temporal aleatoria de 12
  caracteres** (mayúscula, minúscula, número y símbolo) que se entrega una sola vez y el
  usuario debe cambiar en su primer ingreso (`utils/password.ts:34`, `user.service.ts:37`).

### 1.3 Sesión segura en el front end

La sesión se restaura tras una recarga, por lo que el token se **persiste en
`sessionStorage`** (`services/sessionStore.ts`, clave `helpdesk.token`) —no en cookies ni en
`localStorage`— y se revalida contra el servidor al arrancar (`SessionProvider.tsx` →
`obtenerSesion()`).

> **Diferencia con el caso de estudio:** no se usa almacenamiento exclusivamente en memoria
> (el patrón recomendado para mitigar XSS). La compensación elegida es que el token vive en
> `sessionStorage` (ámbito por pestaña, no persistente entre sesiones del navegador) y se
> descarta ante cualquier `401` (`apiClient.ts` → `manejarSesionInvalida`).

---

## 2. Autorización y Control de Acceso Basado en Roles (RBAC)

### 2.1 Reglas de seguridad por ruta y método (equivalente a `SecurityConfig` / `@PreAuthorize`)

La segmentación por rol se declara en el **árbol de rutas del servidor**
(`routes/index.ts`) y a nivel de **método** con el middleware `requerirRol(...)`:

| Recurso | Roles permitidos | Evidencia |
| :--- | :--- | :--- |
| `GET/POST/PUT /users` | Solo `Jefe TI` | `user.routes.ts` |
| `/reports` | Solo `Jefe TI` | `routes/index.ts:29` |
| `/availability` | `Jefe TI`, `Técnico` | `routes/index.ts:31` |
| `/evaluations` | `Jefe TI`, `Usuario` | `routes/index.ts:32` |
| `/sla`, `/equipments` (escritura) | Solo `Jefe TI` | `sla.routes.ts`, `equipment.routes.ts` |

`requerirRol` (`middlewares/auth.ts:40`) lanza **HTTP 403** si el rol de la sesión no está en
la lista permitida. Toda la API, salvo `/health` y `/auth/login`, exige además
`requerirAutenticacion` (`routes/index.ts:20`).

En el front end la misma política se refleja con la **guard declarativa** `RequireRoles`
(`components/autenticacion/RequireRoles.tsx`) y el agrupamiento de rutas por rol en
`App.tsx` (`TODOS`, `OPERATIVOS`, `JEFES`, `CALIFICAN`); si el rol no está permitido redirige
a `/perfil`.

### 2.2 Prevención de vulnerabilidades IDOR / BOLA

La identidad del usuario se extrae **siempre del claim `sub` del JWT** validado en el
servidor y nunca se confía en el cuerpo de la petición:

- `middlewares/auth.ts:26` → `req.sesion = { id: payload.sub, ... }`.
- **Perfil y contraseña:** `user.controller.ts` rechaza con **403** si el `id` del recurso no
  coincide con `req.sesion.id` (`Solo puedes editar tu propio perfil.`).
- **Tickets:** si el cliente no envía `usuarioId`, el solicitante se deduce de la sesión
  (`ticket.service.ts:67-69`), de modo que nadie puede abrir un ticket a nombre de otro.
- **Evaluaciones:** el cuerpo solo acepta `{ idTicket, puntuacion, comentario }`; `tecnico_id`
  y `evaluador_id` **se deducen del ticket** en el servidor (`evaluation.types.ts`), impidiendo
  calificar a un técnico o hacerse pasar por otro solicitante.

---

## 3. Concurrencia, Transacciones y Control de Integridad

El proyecto no usa bloqueo pesimista ni transacciones multi-consulta; el control de
integridad concurrente se apoya en **restricciones del motor** y en **respuestas de conflicto
HTTP 409**:

- **`UNIQUE` en la base:** `correo` y `codigo` de inventario no pueden repetirse, y
  `disponibilidad.usuario_id` es única — el alta/modificación de horario usa upsert
  `insert ... on conflict (usuario_id) do update` (`availability.repository.ts:59-66`),
  evitando dobles registros bajo carga concurrente.
- **HTTP 409 (Conflict)** para carreras reales:
  - un ticket **ya tomado por otro técnico** devuelve
    `HttpError.conflict('Este ticket ya fue tomado por otro tecnico.')`
    (`ticket.service.ts:130-132`);
  - un **correo ya registrado** lanza `409` (regla de negocio en
    `user.service.ts:217`);
  - la **no duplicación de evaluaciones** del mismo ticket+evaluador se verifica antes de
    insertar (`evaluation.repository.ts` → `tieneResena`).

> **Omitido:** `@Lock(PESSIMISTIC_WRITE)` y transacciones explícitas (`BEGIN/COMMIT`): los
> repositorios ejecutan consultas individuales atómicas, por lo que no se documenta control
> transaccional de múltiples sentencias.

---

## 4. Trazabilidad, Auditoría y Manejo de Errores

### 4.1 Respuestas estandarizadas (equivalente a Problem Details)

Los fallos de seguridad se devuelven con **códigos HTTP semánticos y un payload uniforme
`{ error }`**, sin revelar trazas ni SQL (ver §5):

| Situación | HTTP | Mensaje (sin datos sensibles) |
| :--- | :--- | :--- |
| Credenciales inválidas | `401` | `Correo o contrasena incorrectos.` |
| Sesión ausente/expirada | `401` | `Sesion no iniciada.` / `Sesion invalida o expirada.` |
| Rol sin permiso | `403` | `Tu rol no tiene permiso para esta accion.` |
| Recurso de otro usuario (IDOR) | `403` | `Solo puedes editar tu propio perfil.` |
| Conflicto (ticket tomado / correo repetido) | `409` | mensaje específico del conflicto |
| Error inesperado | `500` | `Error interno del servidor` |

Implementado en `middlewares/errorHandler.ts`, `middlewares/notFound.ts` y el factory
`utils/httpError.ts`.

### 4.2 Auditoría

> **Omitido:** no existe una tabla `audit_event` ni correlación `X-Correlation-ID` en logs.
> La única trazabilidad de eventos de autenticación se reduce a lo registrado por el
> `errorHandler` (errores inesperados) y a los datos persistidos por los propios dominios
> (`actualizado_en`, `creado_en`). Como garantía de privacidad, las respuestas de error nunca
> incluyen contraseñas, tokens ni datos personales.

---

## 5. Defensa Perimetral y Mitigación de Vulnerabilidades (OWASP)

### 5.1 Controles de defensa implementados

| Control | Implementación | Evidencia |
| :--- | :--- | :--- |
| Hash de contraseñas con sal (BCrypt) | `bcryptjs` `hashSync`/`compareSync`, nunca texto plano | `utils/password.ts` |
| Secreto JWT seguro y validado en arranque | `JWT_SECRET` obligatorio y `≥ 16` caracteres; el servidor falla al arrancar si falta | `config/env.ts:31` |
| Prevención de inyección SQL | Todo el SQL es **parametrizado** (`$1`, `$2`, …) y vive solo en repositorios | `config/db.ts`, `repositories/*` |
| Tokens solo en cabecera `Authorization` | No en cookies; descartados ante 401 | `apiClient.ts`, `middlewares/auth.ts` |
| CORS habilitado | `app.use(cors())` global; en desarrollo el **proxy de Vite** (`/api → :3000`) evita peticiones cross-origin | `app.ts:9`, `vite.config.ts` |

### 5.2 OWASP no implementado (omitido)

> **Omitido:** **throttling** del login por IP (máx. N intentos por minuto + `Retry-After`),
> **cabeceras de seguridad** (CSP, `X-Content-Type-Options`, etc. — no hay `helmet`) y
> **política de bloqueo por intentos fallidos** del diseño original (HU01) que aún no se ha
> materializado en `auth.service.ts`.

---

## 6. Integración en el Front End y Pruebas

### 6.1 Cabecera de autorización automática (equivalente a `authInterceptor`)

`services/apiClient.ts` centraliza la inyección de la sesión en **todas** las peticiones:

- `cabecerasDeSesion` adjunta `Authorization: Bearer <token>` leído de `sessionStorage`
  (`apiClient.ts:32-35`).
- Si una petición devuelve **401**, `manejarSesionInvalida` borra el token y redirige a
  `/login`, salvo en el propio `POST /auth/login` (`apiClient.ts:22-30`).

### 6.2 Guards de ruta (equivalente a guards de Angular)

- `RequireAuth` (`components/autenticacion/RequireAuth.tsx`) exige sesión y redirige a
  `/login` conservando la ruta origen (`state.from`); fuerza `/perfil` si el usuario debe
  cambiar la contraseña.
- `RequireRoles` (`components/autenticacion/RequireRoles.tsx`) filtra por el `rol` del
  usuario en el árbol de rutas de `App.tsx`.

### 6.3 Pruebas automatizadas

> **Omitido:** no existen suites de pruebas (el script `test` del backend es un placeholder y
> el frontend no tiene framework de testing configurado). La calidad se verifica hoy con
> `npm run typecheck`, `npm run lint` y `npm run build`.