# Sistema de Gestión de Incidencias (UTP Integrador)

Proyecto modular y desacoplado compuesto por dos aplicaciones independientes:

---

## 📁 Estructura del Proyecto

- **[`backend/`](./backend)**: Servidor Node.js + Express con conexión a Supabase (`bd_sistema_incidencia`), APIs REST de autenticación y scripts SQL de base de datos.
- **[`frontend/`](./frontend)**: Aplicación cliente en Next.js 14 (App Router) con Tailwind CSS, control de accesos por roles (`jefe_ti`, `tecnico`, `usuario`) y React Hook Form.

---

## 🚀 Guía de Inicio Rápido

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
*El backend se ejecutará en: `http://localhost:4000`*

Para ejecutar pruebas de integración con Supertest:
```bash
npm run test:integration
```

---

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
*El frontend se ejecutará en: `http://localhost:3000`*

Para ejecutar pruebas unitarias con Jest y React Testing Library:
```bash
npm test
```

---

## 🗄️ Base de Datos (Supabase)
El script de inicialización de la tabla `perfiles` y políticas RLS se encuentra en:
👉 `backend/database/create_perfiles.sql`
