# Laboratorio 5 — Enrutamiento, Formularios, Estado, Accesibilidad e Integración Backend

Este informe revisa, **para los temas de la semana**, la evidencia existente en el
sistema de gestión de incidencias. El proyecto está construido con **React 19 + React
Router 7 + Vite + Tailwind CSS** en el frontend y **Express 5 + PostgreSQL** en el
backend, por lo que cada tema se documenta con su equivalente real en este stack y,
cuando una capacidad no está implementada, se omite.

> Base técnica: [`ARQUITECTURA.md`](../../ARQUITECTURA.md) · Guía de inicio: [`README.md`](../../README.md)

---

## 1. Enrutamiento y Navegación (React Router 7)

### 1.1 Rutas anidadas, de layout e índice

El enrutado se declara con `createBrowserRouter` y se organiza en **rutas anidadas**
bajo un layout común (`MainLayout`), con una ruta `index` como panel principal:

- `src/App.tsx` — árbol completo de rutas (`/login`, `/perfil`, `/tickets`, `/usuarios`,
  `/equipos`, `/prioridades-sla`, `/disponibilidad`, `/evaluaciones`, `/reportes`,
  `/base-conocimiento`).
- `src/components/layout/MainLayout.tsx` — layout persistente con `<Outlet />` y
  `useMatches` para resolver el título de la ruta activa.

### 1.2 Guardas declarativas por autenticación y rol

La protección no se repite por página: se compone con **guardas** que envuelven
subárboles de rutas y renderizan `<Outlet />` o redirigen.

| Guarda | Archivo | Comportamiento |
| :--- | :--- | :--- |
| `RequireAuth` | `src/components/autenticacion/RequireAuth.tsx` | Exige sesión activa; redirige a `/login` y **guarda la ruta de origen** (`state={{ from: location.pathname }}`). Fuerza `/perfil` si el usuario debe cambiar su contraseña. |
| `RequireRoles` | `src/components/autenticacion/RequireRoles.tsx` | Segmenta por rol (`TODOS`, `OPERATIVOS`, `JEFES`, `CALIFICAN`); si el rol no está permitido redirige a `/perfil`. |

La segmentación por rol se aplica en el árbol de rutas de `App.tsx`, agrupando páginas
según el catálogo de roles (`Jefe TI`, `Técnico`, `Usuario`).

### 1.3 Navegación interna

- **Enlaces declarativos:** `<NavLink>` en `src/components/layout/Sidebar.tsx` (aplica
  estado activo) y `<Link>` en paneles como `RecentTicketsPanel`, `SlaCommitmentPanel` y
  `TechnicianAvailabilityPanel`.
- **Navegación programática:** `useNavigate()` en `LoginPage`, `DashboardPage`,
  `TicketsPage` y `UsuarioDashboardView`.
- **Redirección de retorno:** tras iniciar sesión, `LoginPage` navega a la ruta capturada
  en `location.state.from` (`useLocation`), restaurando el destino original.

### 1.4 Manejo de rutas inexistentes

Se define una **ruta comodín** `path: '*'` que renderiza la vista "404 — Página no
encontrada" (`src/App.tsx`), evitando pantallas en blanco ante rutas inválidas.

> **No implementado (omitido):** parámetros dinámicos en la URL (`/recurso/:id`) y carga
> diferida de componentes (`React.lazy` / `Suspense`). En este proyecto las vistas se
> importan de forma directa.

---

## 2. Formularios y Validaciones (componentes controlados)

### 2.1 Modelado del formulario

El equivalente a `FormGroup`/`NonNullableFormBuilder` de Angular se resuelve con
**inputs controlados** ligados a `useState` y una **interfaz tipada** que define el
contrato del formulario:

```ts
interface RegisterUserFormData {
  nombre: string; apellido: string; correo: string;
  rol: RolUsuario; area: string; fono: string;
}
```

Evidencia: `src/components/usuarios/RegisterUserModal.tsx`,
`src/components/tickets/CreateTicketModal.tsx`,
`src/components/sla/SlaPriorityModal.tsx`, `src/pages/LoginPage.tsx`,
`src/pages/EditProfilePage.tsx`.

### 2.2 Validaciones de entrada

Se combinan validaciones **nativas del navegador** y **reglas en el componente**:

| Validación | Dónde | Evidencia |
| :--- | :--- | :--- |
| `required` | Todos los formularios | `LoginPage`, `RegisterUserModal`, `EditEquipmentModal` |
| `type="email"` | Correo | `LoginPage`, `RegisterUserModal`, `EditProfilePage` |
| `pattern="[0-9]{9}"` + `minLength`/`maxLength`/`inputMode` | Teléfono | `RegisterUserModal.tsx` |
| Regex de correo y reglas acumuladas (`EMAIL_RULES`) | Login | `LoginPage.tsx` |
| Filtrado de dígitos y tope de largo en `onChange` | Teléfono | `RegisterUserModal.tsx` |
| Regex espejo de correo en servidor | API | `proyecto-integrador-back/src/services/auth.service.ts` |

### 2.3 Control de estados y experiencia de usuario

- **Estados visuales (equivalente a `editing`/`saving`/`done`):** `isSubmitting` / `isSaving`
  en cada formulario y un estado de éxito (`creado`) que reemplaza el formulario por un
  aviso con la contraseña temporal.
- **Prevención de doble envío:** guarda explícita `if (isSubmitting) return;` y atributo
  `disabled` en los botones de envío y de cierre durante la operación.
- **Conservación de datos ante error controlado:** si la llamada al backend falla, el
  formulario permanece con los valores ingresados y muestra el mensaje de error
  (`role="alert"`), sin limpiar los campos.

---

## 3. Gestión de Estado y Reactividad

### 3.1 Primitivas reactivas

El equivalente a `signal` en Angular es el par **estado + memorización** de React:

- `useState` — almacenamiento observable del estado de la interfaz y de mensajes de error.
- `useMemo` — cálculo derivado de listas filtradas/búsquedas (p. ej. `visibleTickets`,
  `visibleUsers`, `visiblePriorities`).
- `useCallback` — memoización de funciones estables (login, logout, recarga de dashboard).

Evidencia recurrente en `SlaPage`, `TicketsPage`, `UsersPage`, `EquiposPage`,
`KnowledgeBasePage` y `SessionProvider`.

### 3.2 Store compartido (equivalente a `BookingStore`)

La sesión se administra mediante **inyección por contexto**, no por props:

- `src/context/SessionProvider.tsx` expone `{ user, cargando, login, logout, actualizarSesion }`
  con el **valor memoizado** (`useMemo`) para evitar re-renderizados innecesarios.
- El token se **persiste en `sessionStorage`** (`helpdesk.token`) a través de
  `src/services/sessionStore.ts`, y se **restaura al recargar** consultando `obtenerSesion()`.
- Si la restauración de la sesión falla, se borra el token y se limpia el usuario.

Esto evita inconsistencias dentro de la sesión y centraliza el estado compartido por toda
la aplicación.

---

## 4. Accesibilidad (a11y) y Diseño Adaptable (Responsive)

### 4.1 Accesibilidad básica (WCAG)

| Práctica | Evidencia |
| :--- | :--- |
| Etiquetas asociadas a controles (`htmlFor` + `id`) | `LoginPage`, `RegisterUserModal`, `EditEquipmentModal`, `EvaluationForm` |
| Regiones de error anunciadas (`role="alert"`) | Todas las páginas y modales |
| Diálogos accesibles (`role="dialog"`, `aria-modal="true"`) y cierre con **Escape** | `src/components/common/BaseModal.tsx` |
| Etiquetas para lectores de pantalla (`aria-label`) | Sidebar, `Header`, toolbars de búsqueda, `StarRating` |
| Estados de control (`aria-expanded`, `aria-haspopup`, `aria-pressed`) | `Header`, filtros de knowledge/equipos |
| Elementos decorativos ocultos (`aria-hidden`) | Iconografía `lucide-react` |
| Foco visible (`focus:border-*`, `focus:ring-*`) y `autoComplete` | Inputs de Login y formularios |
| Manejo de teclado y bloqueo de scroll de fondo en modales | `BaseModal.tsx` |

### 4.2 Diseño adaptable (mobile-first con Tailwind)

El maquetado usa los breakpoints de Tailwind (`sm:`, `md:`, `lg:`, `xl:`), ajustándose
desde pantallas pequeñas (~375 px) hasta escritorio (~1280 px):

- **Grids que colapsan:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  (dashboards, reportes, listados).
- **Sidebar tipo drawer en móvil:** oculto por defecto y desplegable (`fixed … lg:hidden` /
  `lg:static`) en `src/components/layout/Sidebar.tsx`.
- **Contenedores fluidos:** `w-full max-w-md` / `max-w-4xl mx-auto` para centrar y acotar
  el ancho en pantallas grandes.

---

## 5. Solución de Errores y Preparación para el Back End

### 5.1 Integración real con el servidor (ya implementada)

A diferencia de un prototipo con datos provisionales, el frontend **consume un backend
real** desde el inicio:

- **API REST** en Express 5 montada bajo `/api/v1` (rutas por recurso en
  `proyecto-integrador-back/src/routes/`).
- **Persistencia** en PostgreSQL alojado en Supabase, mediante pool `pg` y SQL
  parametrizado centralizado en la capa de repositorios.
- **Cliente HTTP tipado** en el front: `src/services/apiClient.ts` (`apiGet` / `apiSend`),
  con un módulo por recurso (`usersApi`, `ticketsApi`, `slasApi`, `reportsApi`, …).
- **Sin CORS en desarrollo:** el front llama a rutas relativas `/api/...` y **Vite hace de
  proxy** hacia `http://localhost:3000`.
- **Autenticación JWT:** el token se emite en `auth.service.ts` y viaja en las peticiones;
  las rutas protegidas usan el middleware `requerirAutenticacion` / `requerirRol`.

### 5.2 Manejo de errores

- **Backend:** middleware central `errorHandler` + `notFound`, con errores HTTP tipados
  (`utils/httpError.ts`) y payload uniforme `{ error: string }`.
- **Frontend:** `apiClient` estandariza la lectura de errores y cada página presenta el
  fallo en un bloque `role="alert"`, además de estados `isLoading` con *spinner*/mensaje.

### 5.3 Guía de diagnóstico (fallos comunes resueltos)

| Síntoma | Causa típica | Verificación |
| :--- | :--- | :--- |
| Redirige siempre a `/login` | Token ausente/expirado en `sessionStorage` | Revisar `leerToken()` y la restauración con `obtenerSesion()` |
| Vuelve a `/perfil` al navegar | El rol no está en la lista `allow` de `RequireRoles` | Confirmar `user.rol` vs. grupo de la ruta en `App.tsx` |
| "Correo o contraseña incorrectos" | Credenciales inválidas o rol no coincide con el usuario | `auth.service.ts` valida correo/contraseña y el rol seleccionado |
| Error de red en desarrollo | Backend no levantado o puerto distinto | `npm run dev` (back en `:3000`) y proxy en `vite.config.ts` |
| Datos no llegan | Validación de `DATABASE_URL` al arrancar | `config/env.ts` exige una URL `postgres://` válida |
