# 🖥️ Sistema de Gestión de Soporte TI — Proyecto Integrador II

Sistema web para la gestión de tickets de soporte, equipos, disponibilidad de técnicos, evaluaciones y base de conocimiento del área de TI.

---

## 📋 Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL 17 |
| Contenedores | Docker + Docker Compose |

---

## ✅ Requisitos previos

Antes de comenzar, asegúrate de tener instalado en tu computadora:

### 1. Git
Descárgalo desde: https://github.com/ProyectoFinal-Integrador2/integrador-ll

Verifica la instalación:
```bash
git --version
```

### 2. Docker Desktop
Descárgalo desde: https://www.docker.com/products/docker-desktop/

> ⚠️ En Windows, Docker Desktop requiere **WSL 2** habilitado. El instalador te guiará si no lo tienes.

Verifica la instalación:
```bash
docker --version
docker compose version
```

Ambos comandos deben responder con una versión. Si Docker Desktop no está abierto (corriendo), ábrelo antes de continuar.

---

## 🚀 Instalación y puesta en marcha

### Paso 1 — Clona el repositorio

```bash
git clone <URL-del-repositorio>
cd "Integrador Proyecto Final"
```

> Reemplaza `<URL-del-repositorio>` con la URL real del proyecto (GitHub, GitLab, etc.).

---

### Paso 2 — Crea el archivo de variables de entorno

El proyecto necesita un archivo `.env` con las credenciales. Ya existe un `.env.example` como plantilla:

**En Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**En Mac / Linux:**
```bash
cp .env.example .env
```

Abre el archivo `.env` con cualquier editor de texto. Verás esto:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin1234
POSTGRES_DB=integrador_db
JWT_SECRET=cambia-este-secreto-en-produccion-minimo-16-chars
```

Cambia el valor de `JWT_SECRET` por cualquier texto largo que quieras (mínimo 16 caracteres). El resto puedes dejarlo igual para desarrollo local.

---

### Paso 3 — Levanta el proyecto

Con Docker Desktop abierto y corriendo, ejecuta desde la carpeta raíz del proyecto:

```bash
docker compose up --build
```

Este comando hace todo automáticamente:

```
✔ Descarga las imágenes base (Node, Nginx, PostgreSQL)
✔ Compila el backend  (TypeScript → JavaScript)
✔ Compila el frontend (React + Vite → archivos estáticos)
✔ Crea la base de datos y ejecuta el script SQL (tablas + datos iniciales)
✔ Levanta los 3 servicios listos para usar
```

> ⏳ La primera vez puede tardar **3 a 5 minutos** porque descarga las imágenes de Docker. Las veces siguientes es mucho más rápido.

Cuando veas en la consola algo como esto, ya está listo:

```
integrador_backend   | Server running on port 3000
integrador_frontend  | /docker-entrypoint.sh: Configuration complete; ready for start up
```

---

### Paso 4 — Abre la aplicación

| Qué | URL |
|---|---|
| 🌐 Aplicación web | http://localhost |
| 🔧 API del backend | http://localhost:3000/api/health |

---

## 🔑 Usuario inicial

Al levantar por primera vez, la base de datos se crea con un usuario administrador:

| Campo | Valor |
|---|---|
| **Correo** | `ana.torres@empresa.pe` |
| **Contraseña** | `Admin123!` |
| **Rol** | Jefe TI |

---

## 🛑 Cómo detener el proyecto

Para detener los contenedores sin borrar nada:

```bash
docker compose down
```

Para volver a levantarlo (sin reconstruir):

```bash
docker compose up
```

---

## 🔄 Comandos útiles

### Ver el estado de los contenedores
```bash
docker compose ps
```
Los 3 servicios deben aparecer como `Up`:
```
integrador_db        Up
integrador_backend   Up
integrador_frontend  Up
```

### Ver los logs en tiempo real
```bash
# Todos los servicios
docker compose logs -f

# Solo el backend
docker compose logs -f backend

# Solo la base de datos
docker compose logs -f postgres
```

### Reconstruir después de cambios en el código
```bash
docker compose up --build
```

---

## 🗑️ Resetear la base de datos desde cero

Si necesitas borrar todos los datos y volver al estado inicial (tablas vacías con solo los datos seed):

```bash
docker compose down -v
docker compose up --build
```

> ⚠️ El flag `-v` elimina el volumen de PostgreSQL. **Todos los datos se perderán.**

---

## ❓ Solución de problemas frecuentes

### "Cannot connect to the Docker daemon"
Docker Desktop no está corriendo. Ábrelo desde el menú de inicio y espera a que el ícono de la ballena aparezca en la barra de tareas.

### El frontend carga pero la API no responde
Espera unos segundos. El backend tarda un poco más en iniciar porque primero espera a que PostgreSQL esté listo.

### "Port 80 is already in use" o "Port 3000 is already in use"
Otro programa está usando ese puerto. Puedes:
- Detener el programa que lo usa, o
- Editar el `docker-compose.yml` y cambiar el puerto izquierdo (ej: `"8080:80"` para el frontend)

### Quiero ver si las tablas se crearon correctamente
```bash
docker exec -it integrador_db psql -U admin -d integrador_db -c "\dt"
```
Debes ver la lista de tablas: `usuarios`, `tickets`, `equipos`, etc.

---

## 📁 Estructura del proyecto

```
Integrador Proyecto Final/
├── proyecto-integrador-back/   # Backend Node.js + Express
│   ├── src/
│   │   ├── config/             # Configuración BD y variables de entorno
│   │   ├── controllers/        # Controladores HTTP
│   │   ├── repositories/       # Acceso a la base de datos
│   │   ├── routes/             # Definición de rutas API
│   │   ├── services/           # Lógica de negocio
│   │   └── types/              # Tipos TypeScript
│   └── Dockerfile
├── proyecto-integrador-front/  # Frontend React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas de la aplicación
│   │   ├── services/           # Llamadas a la API
│   │   └── types/              # Tipos TypeScript
│   ├── Dockerfile
│   └── nginx.conf
├── database/
│   └── integrador_BDD.sql      # Script de creación de tablas y datos iniciales
├── docker-compose.yml          # Orquestación de los 3 contenedores
├── .env.example                # Plantilla de variables de entorno
└── README.md                   # Este archivo
```
