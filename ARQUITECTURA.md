# Arquitectura Aplicada — Sistema de Gestión de Incidencias con SLA

Documento técnico derivado del **código implementado** en este repositorio.

---

## 1. Visión general

Monorepo gestionado con **npm workspaces**: un único `package.json` en la raíz coordina dos paquetes independientes.

| Paquete | Rol |
|---|---|
| `proyecto-integrador-back` | API REST (Express + TypeScript), expone rutas bajo `/api/v1` |
| `proyecto-integrador-front` | SPA (React + Vite + Tailwind CSS), consume la API por rutas relativas |

- **Runtime:** Node.js ≥ 24 (fijado en `.nvmrc` y en `engines` de los tres `package.json`).
- **Arranque:** `npm install` en la raíz + `npm run dev` (levanta back y front en paralelo con `concurrently`).
- **Comandos globales:** `dev`, `build`, `typecheck`, `lint`.

---

## 2. Arquitectura aplicada

### 2.1 Estilo arquitectónico

- **Backend:** arquitectura **multicapa** sobre un único proceso Express (monolito modular), con separación estricta de responsabilidades.
- **Frontend:** **SPA por capas** con enrutado declarativo, guardas por rol y una capa de servicios aislada del DOM.
- **Patrón clave:** **Patrón Repositorio** — el SQL vive únicamente en `src/repositories/*`; servicios y controllers nunca tocan la base de datos directamente.

### 2.2 Flujo de una petición

```
UI (componente/page)
  → capa de servicios del front (src/services/*Api.ts)
    → apiClient (fetch genérico apiGet / apiSend, base /api/v1)
      → proxy de Vite (/api → http://localhost:3000)        [desarrollo]
        → Express: routes → controllers → services → repositories
          → PostgreSQL (pool pg, SQL parametrizado)
```

### 2.3 Backend — capas (`proyecto-integrador-back/src`)

| Capa | Directorio | Responsabilidad |
|---|---|---|
| Rutas | `routes/` | Un router por recurso; `routes/index.ts` los monta en `/api/v1` (`/tickets`, `/users`, `/equipments`, `/sla`, `/availability`, `/dashboard`, `/evaluations`, `/reports`, `/knowledge-base`, `/health`) |
| Controladores | `controllers/` | Validación de entrada, orquestación de la llamada y respuesta HTTP (no contienen lógica de negocio) |
| Servicios | `services/` | Lógica de negocio por dominio (`ticket.service`, `sla.service`, `report.service`…) |
| Repositorios | `repositories/` | SQL crudo + mapeo fila → objeto de dominio; exponen interfaces (`TicketRepositorio`, `UserRepositorio`…) |
| Config | `config/` | `env.ts` (validación estricta de `PORT` y `DATABASE_URL` con `dotenv`), `db.ts` (pool de conexión y helpers `query` / `queryOne`) |
| Middlewares | `middlewares/` | `notFound` (404) y `errorHandler` (manejador central de errores) |
| Tipos | `types/` | Contratos de dominio por módulo (`ticket.types.ts`, `user.types.ts`…) |
| Utilidades | `utils/` | `httpError.ts` (errores HTTP tipados), `avatar.ts` |

Cadena típica: `route → controller → service → repository → pg pool`.

### 2.4 Frontend — capas (`proyecto-integrador-front/src`)

| Capa | Directorio | Responsabilidad |
|---|---|---|
| Páginas | `pages/` | Una vista por ruta (Login, Dashboard, Tickets, Users, Equipments, Sla, Reports, Evaluations, KnowledgeBase, Availability, EditProfile) |
| Componentes | `components/` | UI agrupada por dominio (`tickets/`, `usuarios/`, `sla/`, `reportes/`, `equipos/`, `layout/`…) + guardas (`autenticacion/RequireAuth.tsx`, `RequireRoles.tsx`) |
| Servicios | `services/` | `apiClient.ts` (cliente `fetch` tipado con manejo de errores) y un módulo por recurso (`ticketsApi.ts`, `usersApi.ts`…) |
| Contexto | `context/` | `SessionProvider` + `useSession`: estado de sesión con persistencia en `sessionStorage` |
| Tipos | `types/` | Espejo de los contratos del backend (`ticket.types.ts`, `roles.ts`…) |
| Utilidades | `utils/` | helpers de fecha, estilos por rol/estado, texto |

**Enrutado:** `createBrowserRouter` (React Router 7) con rutas anidadas bajo `MainLayout` y **guardas declarativas**:

- `RequireAuth` → protege todas las rutas privadas (redirige a `/login`).
- `RequireRoles` → segmentación por rol en el árbol de rutas (`TODOS`, `OPERATIVOS`, `JEFES`, `CALIFICAN`).
- 404 global con `path: '*'`.

---

## 3. Stack tecnológico

### 3.1 Frontend

| Tecnología | Versión | Función |
|---|---|---|
| React | 19.2 | Librería de UI |
| Vite | 8.2 | Bundler y servidor de desarrollo (HMR) |
| TypeScript | ~6.0.3 | Tipado estático |
| Tailwind CSS | 4.3 (plugin `@tailwindcss/vite`) | Estilos utility-first |
| React Router | 7.18 (`react-router-dom`) | Enrutado SPA con guardas por rol |
| lucide-react | 1.44 | Iconografía |
| ESLint 10 + typescript-eslint | — | Lint (config flat, plugins react-hooks/react-refresh) |

### 3.2 Backend

| Tecnología | Versión | Función |
|---|---|---|
| Express | 5.2 | Framework HTTP y enrutado |
| pg | 8.23 | Cliente PostgreSQL (pool de conexiones, SQL parametrizado) |
| cors / dotenv | — | Cabeceras CORS y variables de entorno |
| tsx | 4.23 | Ejecución y watch de TypeScript en desarrollo |

### 3.3 Herramientas compartidas

- **TypeScript ~6.0.3** en ambos paquetes (misma versión, `strict: true`).
- **concurrently** en la raíz para levantar back + front con un solo comando.
- Base de datos **PostgreSQL** alojada en **Supabase** (acceso vía `DATABASE_URL` con SSL).

---

## 4. Lenguaje y convenciones

- **Lenguaje:** TypeScript estricto en las dos mitades (`"strict": true`; el front añade `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`).
- **Módulos:** backend en CommonJS (`type: commonjs`, resolución `nodenext`); frontend ESM (`bundler`, JSX `react-jsx`).
- **Alias de importación:** `@/` → `src/` en el frontend, definido en `tsconfig.app.json` y en `vite.config.ts` (`@/components`, `@/services/ticketsApi`…).
- **Exports:** siempre *named*; único `export default` permitido es `main.tsx` / `App.tsx` como punto de entrada.
- **Contratos de datos:** cada dominio define sus tipos en `types/*.types.ts` en back y front (IDs como `string` en el dominio, fechas como ISO 8601).
- **SQL:** parametrizado siempre (`$1`, `$2`…), centralizado en repositorios; mapeo explícito fila → dominio en cada repositorio.
- **Validación de entorno:** falla al arrancar si `DATABASE_URL` falta o no es una URL `postgres://` (`config/env.ts`).

---

## 5. Comunicación front ↔ back

- El frontend llama a rutas **relativas** (`/api/v1/...`); **Vite hace de proxy** hacia `http://localhost:3000` (`vite.config.ts` → `server.proxy`), por lo que en desarrollo no se necesita configurar CORS.
- Cliente HTTP propio en `services/apiClient.ts`: `apiGet<T>()` y `apiSend<T>()` con tipado de respuesta y lectura estandarizada de errores (`{ error: string }`).
- En producción el mismo patrón rutas relativas permite servir ambos detrás de un único origen.

---

## 6. Seguridad y sesión

- **Guardas en cliente:** `RequireAuth` exige sesión iniciada; `RequireRoles` restringe rutas por rol (`Jefe TI`, `Técnico`, `Usuario`).
- **Sesión:** `SessionProvider` mantiene el usuario en contexto React y persiste el rol en `sessionStorage` (`helpdesk.session.rol`), restaurándola al recargar.
- **Estado actual:** la sesión está implementada sobre datos de usuario de ejemplo (`services/mockUsers.ts`); el backend aún no expone un endpoint de autenticación.
- **CORS:** habilitado globalmente en Express (`app.use(cors())`).
- **Seguridad en capa de datos:** todo el acceso a PostgreSQL pasa por el pool con consultas parametrizadas (prevención de inyección SQL).

---

## 7. Metodología — Scrum

- **Marco:** **Scrum** con roles definidos: Product Owner (Maycol Quicaño), Scrum Master (Jorge Vilca) y Developers (Jeremy Poma, Daniel Turin).
- **Backlog:** **24 Historias de Usuario (HU01–HU24)** priorizadas en **6 sprints**:
  - Sprint 1 — acceso y gestión de usuarios (HU01–HU04)
  - Sprint 2 — tickets de incidencia (HU06–HU08)
  - Sprint 3 — prioridades SLA, base de conocimiento, equipos (HU09–HU12)
  - Sprint 4 — equipos, disponibilidad de técnicos (HU13–HU16)
  - Sprint 5 — evaluaciones, auditoría y reporte de cumplimiento SLA (HU17–HU20)
  - Sprint 6 — reportes (HU22–HU24)
- **Control de versiones (evidencia en git):**
  - Flujo de ramas: `feat/HU-xxx` (o `HU-x-...`) → integración en `dev` → `main`.
  - Commits convencionales en su mayoría: `feat:`, `feat(HU-003):`, `chore:`, con referencia a issues (`closes #14`).
  - Historial de merges de cada HU hacia `dev` antes de llegar a `main`.

---

## 8. Calidad y DevOps

| Práctica | Estado actual |
|---|---|
| Typecheck | `npm run typecheck` ejecuta `tsc --noEmit` / `tsc -b` en ambos paquetes |
| Lint | `npm run lint` (ESLint flat config, solo frontend) |
| Build | `npm run build` → `tsc` (back) + `tsc -b && vite build` (front) |
| Pruebas automatizadas | **No implementadas** (el script `test` del backend es un placeholder) |
| CI/CD | **No configurado** en el repositorio (no existe `.github/workflows`) |
| Formateo | Sin Prettier configurado; se respeta el estilo del código existente |

Comandos disponibles:

```bash
npm run dev        # back (:3000) + front (:5173) en paralelo
npm run typecheck  # validación de tipos en ambos paquetes
npm run lint       # ESLint en el frontend
npm run build      # build de producción de ambos paquetes
```

---

## 9. Estructura de carpetas

```
integrador-ll/
├── package.json                  # raíz: workspaces + scripts globales
├── .nvmrc                        # Node 24
├── Laboratorios/                 # entregas académicas
├── Sesiones/                     # entregas académicas
├── proyecto-integrador-back/
│   └── src/
│       ├── app.ts                # Express: cors, json, /api/v1, 404, errorHandler
│       ├── server.ts             # arranque
│       ├── config/               # env.ts (validación), db.ts (pool pg)
│       ├── routes/               # un router por recurso + index.ts
│       ├── controllers/          # HTTP por recurso
│       ├── services/             # lógica de negocio
│       ├── repositories/         # SQL + mapeo a dominio (Patrón Repositorio)
│       ├── types/                # contratos de dominio
│       └── utils/                # httpError, avatar
└── proyecto-integrador-front/
    └── src/
        ├── main.tsx / App.tsx    # entrada + router con guardas
        ├── pages/                # una vista por ruta
        ├── components/           # UI por dominio + layout + autenticación
        ├── services/             # apiClient + módulos por recurso
        ├── context/              # SessionProvider (sesión por rol)
        ├── types/                # contratos de dominio (espejo del back)
        └── utils/                # helpers de fecha, estilos, texto
```
