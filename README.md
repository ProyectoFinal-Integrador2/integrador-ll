# Sistema de Gestión de Incidencias (UTP Integrador)

## Estructura del Proyecto

- **[`proyecto-integrador-back/`](./proyecto-integrador-back)**: Backend en Node.js + Express con TypeScript (API en `/api/v1`).
- **[`proyecto-integrador-front/`](./proyecto-integrador-front)**: Frontend en React + Vite + Tailwind CSS con React Router.

## Guía de Inicio Rápido

### Instalar dependencias

```bash
npm run setup
```

### Ejecutar frontend y backend juntos

```bash
npm run dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

### Ejecutar por separado

```bash
cd proyecto-integrador-back && npm run dev
cd proyecto-integrador-front && npm run dev
```