# Laboratorio 8 — Verificación, Calidad, Empaquetado y Decisión de Entrega

Este informe revisa, **para los temas de la semana**, la evidencia existente en el sistema
de gestión de incidencias. El stack real es **Express 5 + TypeScript + PostgreSQL
(Supabase)** en el back end y **React 19 + Vite + Tailwind** en el front end, gestionado con
**npm workspaces**. Muchos de los artefactos del caso de estudio (testcontainers, Playwright,
k6, axe-core, Docker Compose, Caddy, pg_dump) **no están implementados en este repositorio**,
por lo que el documento se enfoca en lo que sí existe y es verificable, marcando cada tema
omitido.

> Base técnica: [`ARQUITECTURA.md`](../../ARQUITECTURA.md) · Requerimientos:
> [`REQUERIMIENTOS.md`](../../REQUERIMIENTOS.md) · Labs previos: [`5`](../Laboratorio%205/README.md)
> · [`6`](../Laboratorio%206/README.md) · [`7`](../Laboratorio%207/README.md)

---

## 1. Pruebas Funcionales e Integración Real (Back End & Front End)

### 1.1 Integración real Back ↔ Front (sin mocks)

El sistema **no usa datos simulados**: el front end consume una **API real** (Express) que
persiste en **PostgreSQL alojado en Supabase**, por lo que la integración de extremo a
extremo es ejecutable y verificable de forma manual:

- Front → `src/services/apiClient.ts` (`apiGet`/`apiSend`) → `/api/v1` → proxy de Vite
  (`vite.config.ts`) → `routes → controllers → services → repositories → pool pg`.
- Rutas/recursos reales para cada módulo (ver [`REQUERIMIENTOS.md`](../../REQUERIMIENTOS.md)
  y `routes/index.ts`).

### 1.2 Verificación de salud (equivalente a smoke básico)

Existe un endpoint de salud que comprueba proceso **y** base de datos: `GET /api/v1/health`
ejecuta `select 1` y responde `{ status: 'ok', database: 'ok' }` o `503` si el motor no
responde (`routes/health.routes.ts`). Es el punto de verificación de que la cadena de
integración está operativa.

### 1.3 Escenarios funcionales implementados y verificables

| Escenario | Comportamiento esperado | Evidencia en código |
| :--- | :--- | :--- |
| Login con credenciales válidas | Emite JWT `HS256`, TTL 8h | `services/auth.service.ts:47-54` |
| Credenciales inválidas | `401` `"Correo o contrasena incorrectos."` | `controllers/auth.controller.ts`, `utils/httpError.ts` |
| Validación de entrada | `400` (correo, teléfono, SLA, estado inválido) | `services/user.service.ts`, `services/sla.service.ts` |
| Rol sin permiso | `403` `"Tu rol no tiene permiso..."` | `middlewares/auth.ts:40-51`, `routes/index.ts` |
| IDOR (editar perfil ajeno) | `403` `"Solo puedes editar tu propio perfil."` | `controllers/user.controller.ts:48-50` |
| Ticket ya tomado por otro técnico | `409` Conflict | `services/ticket.service.ts:130-132` |
| Rutas protegidas (redirección) | `RequireAuth` → `/login` guardando ruta origen (`from`) | `components/autenticacion/RequireAuth.tsx`, `pages/LoginPage.tsx` |
| Estados de interfaz | Carga → datos / **vacío** / error con `role="alert"`, cancelación con `AbortController` | páginas `*.tsx`, `services/apiClient.ts` |

### 1.4 Regresión y compilación

Como puertas de calidad (no hay suite de tests): `npm run typecheck` (tsc en ambos paquetes),
`npm run lint` (ESLint) y `npm run build` (`tsc` + `vite build`) — definidas en el
`package.json` raíz.

> **Omitido:** Testcontainers con PostgreSQL efímero, **Playwright** E2E y **presupuestos de
> empaquetado** (budgets) — no están configurados en el repositorio (`package.json` sin
> scripts de test reales; el backend solo tiene un placeholder).

---

## 2. Pruebas No Funcionales (Rendimiento, Accesibilidad y Seguridad)

### 2.1 Rendimiento

> **Omitido:** pruebas de carga con **Grafana k6** (percentil p95, VUs) — no existen
> mediciones ni benchmarks en el repositorio.

El único control de rendimiento aplicado es de diseño: búsquedas/filtros del front derivan
normalizados con `useMemo` y las consultas usan SQL parametrizado y `JOIN` único
(`repositories/*`), sin datos redundantes.

### 2.2 Accesibilidad (a11y) y diseño responsivo

La **evaluación automatizada con axe-core no está configurada** (omitida), pero la
implementación aplica las bases cubiertas en el Laboratorio 5:

- **Etiquetas y ARIA:** `htmlFor`/`id`, `role="alert"`, `role="dialog"` + `aria-modal`,
  `aria-label`, `aria-expanded`, `aria-pressed`, `aria-hidden`.
- **Teclado y foco:** cierre de modales con `Escape`, foco visible (`focus:ring`, `focus:border`)
  y `autoComplete` en formularios.
- **Responsivo mobile-first:** breakpoints `sm/md/lg/xl`, grids que colapsan a una columna y
  sidebar tipo drawer en móvil — cubriendo el rango ~375 px → 1280 px sin desbordamiento
  horizontal por diseño (Tailwind).

### 2.3 Seguridad y hardening de entorno

Controles implementados y documentados en el Laboratorio 7: hashing **BCrypt** con sal, JWT
firmado con `JWT_SECRET` validado al arranque, **SQL parametrizado** (anti inyección), tokens
solo en cabecera `Authorization`, CORS + proxy de desarrollo.

> **Omitido:** cabeceras de seguridad HTTP (`X-Content-Type-Options`, `X-Frame-Options`,
> HSTS, CSP) — no se usa `helmet`; y endpoints **Actuator** (inexistentes: no es Spring). El
> aislamiento de servicios se reduce a la arquitectura por capas; no hay contenedores.

---

## 3. Empaquetado y Orquestación

> **Omitido:** `Dockerfile` multi-etapa, **Docker Compose** (redes `edge`/`data`,
> healthchecks, volúmenes `db_data`, `.env` de compose) — el proyecto no está contenerizado.

El empaquetado equivalente se resuelve con **npm workspaces**: `npm run dev` levanta back y
front juntos, y `npm run build` genera el artefacto de producción del backend (`tsc → dist/`)
y del frontend (`vite build`), con la ruta `/api` esperando un proxy en producción (misma
estrategia que el proxy de desarrollo; ver [`ARQUITECTURA.md`](../../ARQUITECTURA.md) §5).

La **parametrización existe a nivel de variables de entorno**: `.env.example` +
`config/env.ts` validan `PORT`, `DATABASE_URL` y `JWT_SECRET` en el arranque.

---

## 4. Publicación Cloud, Servidor Web y Smoke Testing

> **Omitido:** despliegue en VM cloud con **Caddy** (proxy inverso y HTTPS), `docker
> save/load --no-build` y el script `smoke.mjs`.

El equivalente más cercano implementado es el **endpoint de salud** (`/api/v1/health`), que
puede usarse como *smoke check* de la cadena proceso + base de datos
(`routes/health.routes.ts`).

---

## 5. Persistencia de Datos, Respaldo y Estrategia de Reversión

- **Persistencia ante reinicios:** la base de datos es **PostgreSQL real alojado en Supabase**
  (conexión SSL vía `DATABASE_URL`, pool `pg`), de modo que los registros persisten por
  naturaleza ante reinicios del proceso API o del front; el `select 1` del healthcheck
  verifica continuamente la disponibilidad del motor.
- Marca de auditoría persistida en los dominios: `creado_en` / `actualizado_en` con `now()`.

> **Omitido:** **dumps con `pg_dump`/`pg_restore`** y **rollback tipo Flyway** — no hay
> migraciones versionadas ni scripts de respaldo configurados en el repositorio.

---

## 6. Criterios de Aceptación y Decisión de Entrega

### 6.1 Matriz de casos y evidencia

| # | Caso probado | Resultado esperado (verificable) | Evidencia |
| :--- | :--- | :--- | :--- |
| 1 | Login válido por rol | Token JWT + redirección por rol | `auth.routes.ts`, `auth.service.ts` |
| 2 | Login inválido | `401`, sin mensajes específicos | `auth.service.ts:25-33` |
| 3 | Registro de usuario (Jefe TI) | `201`, contraseña temporal bcrypt | `user.routes.ts`, `user.service.ts:27-51` |
| 4 | RBAC por módulo | `403` si el rol no corresponde | `middlewares/auth.ts`, `routes/index.ts` |
| 5 | Ciclo de ticket | Abierto → En progreso → Cerrado; `409` si lo toma otro técnico | `ticket.service.ts` |
| 6 | SLA: tiempos respuesta < resolución | `400` si se viola la regla | `sla.service.ts:93-97` |
| 7 | Evaluación sin spoofing | ids de técnico/evaluador deducidos del ticket | `evaluation.types.ts` |
| 8 | Rutas protegidas | Redirección a `/login` + retorno a origen | `RequireAuth.tsx`, `LoginPage.tsx` |
| 9 | Persistencia | Datos leíbles a través de `/api/v1/health` (base ok) | `health.routes.ts` |
| 10 | Compilación | `typecheck`, `lint` y `build` pasan | `package.json` raíz |

### 6.2 Decisión de entrega

Las funcionalidades de los sprints **HU01–HU08, HU09–HU19 y partes de HU23** están
implementadas y la **integración real Back ↔ BD** es verificable de punta a punta, lo que
permite una **demostración funcional de laboratorio** cubriendo: autenticación JWT + RBAC,
gestión de usuarios, ciclo de tickets, SLA, equipos, disponibilidad, evaluaciones y base de
conocimiento.

**Pendiente por cortar el 100 % de automatización:** suite de pruebas unitarias/E2E,
presupuestos de build, CI/CD (GitHub Actions) y contenerización/Docker Compose. La
**recomendación** es declarar la versión **apta para la demostración funcional** (con
verificación manual y healthcheck) y reservar la "liberación de producción" hasta cubrir las
pruebas automatizadas y el pipeline de CI documentados en `Avance.md` (cobertura ≥ 80 % y
aprobación del Product Owner en staging).