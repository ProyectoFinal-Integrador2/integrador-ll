# Sistema de Gestión de Incidencias (UTP Integrador)

Monorepo con **npm workspaces**: un solo `package.json` en la raíz coordina
los dos paquetes.

## Estructura del Proyecto

- **[`proyecto-integrador-back/`](./proyecto-integrador-back)**: API en Express + TypeScript (rutas en `/api/v1`).
  Capas: `routes` → `controllers` → `services` → `repositories`.
- **[`proyecto-integrador-front/`](./proyecto-integrador-front)**: SPA en React + Vite + Tailwind CSS con React Router.
  Código agrupado por feature en `src/features/*`, UI compartida en `src/components`.
- **[`Laboratorios/`](./Laboratorios)**, **[`Sesiones/`](./Sesiones)**: entregables de la universidad.

## Requisitos

- Node.js **24** (ver [`.nvmrc`](./.nvmrc); hay `engines.node >= 24` en los tres `package.json`).

## Guía de Inicio Rápido

### Instalar dependencias

Un solo `npm install` en la raíz: los workspaces se encargan del resto.

```bash
npm install
```

### Configurar el backend (opcional)

```bash
cp proyecto-integrador-back/.env.example proyecto-integrador-back/.env
```

Sin `.env` el servidor usa `PORT=3000`.

### Ejecutar frontend y backend juntos

```bash
npm run dev
```

- Backend: `http://localhost:3000` (health check en `http://localhost:3000/api/v1/health`)
- Frontend: `http://localhost:5173`

El frontend llama a la API por rutas relativas (`/api/...`); Vite hace de proxy
hacia el backend, así que en desarrollo no hace falta configurar CORS.

### Ejecutar por separado

```bash
npm run dev -w proyecto-integrador-back
npm run dev -w proyecto-integrador-front
```

## Otros comandos

```bash
npm run typecheck   # tsc en ambos paquetes
npm run lint        # eslint en el frontend
npm run build       # tsc + vite build
```

## Convenciones

- Imports del frontend con el alias `@/` (`@/components`, `@/features/users`), no rutas relativas profundas.
- Todo en el barrel del feature: `src/features/users/index.ts` es el único punto de entrada desde fuera.
- Exportaciones siempre **named**; no hay `export default` salvo en `main.tsx`.
- El frontend y el backend comparten la misma versión de TypeScript.
