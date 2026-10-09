# Requerimientos Funcionales — Sistema de Gestión de Incidencias con SLA

**Curso Integrador II: Software — Ciclo 2026-2**
**Equipo:** Maycol Quicaño · Jorge Vilca · Jeremy Poma · Daniel Turin

Documento consolidado de **requerimientos funcionales**, **sprints** e **Historias de
Usuario (HU01–HU24)**. El estado de implementación fue verificado contra el código
fuente del repositorio (`proyecto-integrador-back` y `proyecto-integrador-front`).

> Documentos relacionados: [`Avance.md`](./Avance.md) (sustentación Sprint 1 y diagramas),
> [`ARQUITECTURA.md`](./ARQUITECTURA.md) (arquitectura aplicada), [`README.md`](./README.md) (guía de inicio).

---

## 1. Problema y alcance

La empresa **Quimesa** pertenece a la industria de insumos químicos y fabricación de
productos; sus procesos de gestión de incidencias son **manuales** y no cuentan con un
programa de automatización. Esta necesidad motiva la construcción de un **sistema web de
gestión de incidencias** que agilice y ordene dichos procesos.

El sistema no solo gestiona incidencias, sino que **mide su cumplimiento contra Acuerdos
de Nivel de Servicio (SLA)**, lo que constituye su módulo diferenciador.

### Actores del sistema

| Rol | Descripción |
|---|---|
| **Usuario** | Reporta incidencias, consulta sus tickets y califica el servicio recibido. |
| **Técnico** | Atiende tickets, registra su disponibilidad y consulta la base de conocimiento. |
| **Jefe de TI** | Administra usuarios, equipos, prioridades SLA, reportes y audita el servicio. |

---

## 2. Convención de estados

| Estado | Significado |
|---|---|
| ✅ Implementado | Existe endpoint en backend y vista/servicio en frontend. |
| 🚧 Parcial | Existe una parte de la funcionalidad, pero no cubre el alcance completo de la HU. |
| ⬜ Pendiente | No existe implementación en el código. |

---

## 3. Requerimientos funcionales

| ID | Requerimiento funcional | HU | Actor | Módulo | Estado |
|---|---|---|---|---|---|
| RF-01 | Acceder al sistema mediante inicio de sesión con credenciales y control de intentos fallidos. | HU01 | Usuario | Autenticación | ✅ |
| RF-02 | Registrar un nuevo usuario asignándole un rol. | HU02 | Jefe de TI | Usuarios | ✅ |
| RF-03 | Consultar los usuarios y sus roles/permisos activos. | HU03 | Jefe de TI | Usuarios | ✅ |
| RF-04 | Actualizar los datos del perfil propio. | HU04 | Usuario | Perfil | ✅ |
| RF-05 | Recuperar la contraseña para volver a acceder. | HU05 | Usuario | Autenticación | 🚧 |
| RF-06 | Registrar un ticket de incidencia. | HU06 | Usuario | Tickets | ✅ |
| RF-07 | Consultar tickets de incidencia. | HU07 | Todos | Tickets | ✅ |
| RF-08 | Actualizar el estado de un ticket. | HU08 | Técnico / Jefe de TI | Tickets | ✅ |
| RF-09 | Registrar una prioridad de servicio (SLA). | HU09 | Jefe de TI | SLA | ✅ |
| RF-10 | Registrar un artículo de conocimiento. | HU10 | Técnico / Jefe de TI | Base de conocimiento | ✅ |
| RF-11 | Consultar la base de conocimientos. | HU11 | Todos | Base de conocimiento | ✅ |
| RF-12 | Registrar un equipo informático. | HU12 | Jefe de TI | Equipos | ✅ |
| RF-13 | Consultar equipos informáticos. | HU13 | Jefe de TI | Equipos | ✅ |
| RF-14 | Actualizar la ficha de un equipo informático. | HU14 | Jefe de TI | Equipos | ✅ |
| RF-15 | Registrar disponibilidad de técnicos. | HU15 | Técnico / Jefe de TI | Disponibilidad | ✅ |
| RF-16 | Consultar la disponibilidad de los técnicos. | HU16 | Técnico / Jefe de TI | Disponibilidad | ✅ |
| RF-17 | Registrar una evaluación de servicio. | HU17 | Usuario / Jefe de TI | Evaluaciones | ✅ |
| RF-18 | Auditar y actualizar el estado final de un ticket. | HU18 | Jefe de TI | Tickets | ✅ |
| RF-19 | Consultar las evaluaciones de servicio. | HU19 | Usuario / Jefe de TI | Evaluaciones | ✅ |
| RF-20 | Generar reporte de cumplimiento de SLA. | HU20 | Jefe de TI | Reportes | ⬜ |
| RF-21 | Generar reporte de carga de trabajo de técnicos. | HU21 | Jefe de TI | Reportes | ⬜ |
| RF-22 | Generar reporte del historial de fallas por equipo. | HU22 | Jefe de TI | Reportes | ⬜ |
| RF-23 | Generar reporte de evaluaciones de satisfacción. | HU23 | Jefe de TI | Reportes | 🚧 |
| RF-24 | Generar reporte de artículos de conocimiento más consultados. | HU24 | Jefe de TI | Reportes | ⬜ |

---

## 4. Sprints

| Sprint | Objetivo | Historias de Usuario | Estado |
|---|---|---|---|
| **Sprint 1** | Acceso al sistema y gestión de usuarios. | HU01, HU02, HU03, HU04 | ✅ Completado |
| **Sprint 2** | Recuperación de contraseña y ciclo de vida de tickets. | HU05, HU06, HU07, HU08 | 🚧 HU05 parcial |
| **Sprint 3** | Prioridades SLA, base de conocimiento y equipos. | HU09, HU10, HU11, HU12 | ✅ Completado |
| **Sprint 4** | Gestión de equipos y disponibilidad de técnicos. | HU13, HU14, HU15, HU16 | ✅ Completado |
| **Sprint 5** | Evaluaciones, auditoría y reporte de cumplimiento SLA. | HU17, HU18, HU19, HU20 | 🚧 HU20 pendiente |
| **Sprint 6** | Reportes de gestión. | HU21, HU22, HU23, HU24 | 🚧 HU23 parcial |

### 4.1 Sprint 1 — detalle (sustentación oficial)

| Integrante | Rol Scrum | HU asignada | Duración |
|---|---|---|---|
| Maycol Quicaño | Product Owner | HU01 — Acceder al sistema | 5 días |
| Jorge Vilca | Scrum Master | HU02 — Registrar un nuevo usuario | 5 días |
| Jeremy Poma | Developer | HU03 — Consultar los usuarios | 5 días |
| Daniel Turin | Developer | HU04 — Actualizar perfil de usuario | 5 días |

**Duración del Sprint 1:** 4 semanas. **Producto:** Sistema Web de Gestión de Incidencias.

---

## 5. Historias de Usuario

### Sprint 1

**HU01 — Acceder al sistema**
- **COMO** usuario **QUIERO** iniciar sesión **PARA** acceder al sistema.
- **Actor:** Usuario · **Endpoint:** `POST /api/v1/auth/login`, `GET /api/v1/auth/me` · **Estado:** ✅
- **Escenario 1 — Inicio de sesión exitoso:** *Dado* que el usuario tiene una cuenta activa con credenciales válidas, *cuando* ingresa su correo y contraseña y presiona "Iniciar Sesión", *entonces* el sistema valida las credenciales, verifica el rol y abre una sesión segura con token JWT, redirigiendo al panel correspondiente según su rol.
- **Escenario 2 — Credenciales inválidas:** *Dado* que ingresa un correo o contraseña incorrectos, *cuando* el sistema detecta que no coinciden, *entonces* muestra "Correo o contraseña incorrectos" y registra el intento fallido.
- **Escenario 3 — Bloqueo temporal:** *Dado* que el usuario acumula tres intentos fallidos consecutivos, *cuando* intenta autenticarse de nuevo, *entonces* el sistema bloquea la cuenta durante 15 minutos y muestra un temporizador de cuenta regresiva.

**HU02 — Registrar un nuevo usuario**
- **COMO** Jefe de TI **QUIERO** registrar un nuevo usuario **PARA** otorgarle acceso a la plataforma con su rol correspondiente.
- **Actor:** Jefe de TI · **Endpoint:** `POST /api/v1/users` · **Estado:** ✅

**HU03 — Consultar los usuarios**
- **COMO** Jefe de TI **QUIERO** consultar los usuarios **PARA** monitorear las cuentas, roles y permisos activos en el sistema.
- **Actor:** Jefe de TI · **Endpoint:** `GET /api/v1/users` · **Estado:** ✅

**HU04 — Actualizar perfil de usuario**
- **COMO** Usuario **QUIERO** actualizar mi perfil **PARA** modificar mis datos vigentes.
- **Actor:** Usuario · **Endpoint:** `PATCH /api/v1/users/:id/profile` · **Estado:** ✅

### Sprint 2

**HU05 — Recuperar contraseña**
- **COMO** usuario **QUIERO** recuperar mi contraseña **PARA** volver a acceder.
- **Actor:** Usuario · **Estado:** 🚧 (existe restablecimiento por el Jefe de TI vía `PATCH /api/v1/users/:id/password`; falta la auto-recuperación).

**HU06 — Registrar un ticket de incidencia**
- **COMO** usuario **QUIERO** registrar un ticket de incidencia **PARA** reportar un problema.
- **Actor:** Usuario · **Endpoint:** `POST /api/v1/tickets` · **Estado:** ✅

**HU07 — Consultar tickets de incidencia**
- **COMO** usuario **QUIERO** consultar los tickets de incidencia **PARA** dar seguimiento a su estado.
- **Actor:** Todos · **Endpoint:** `GET /api/v1/tickets` · **Estado:** ✅

**HU08 — Actualizar el estado de un ticket**
- **COMO** técnico **QUIERO** actualizar el estado de un ticket **PARA** reflejar el avance de la atención.
- **Actor:** Técnico / Jefe de TI · **Endpoint:** `PATCH /api/v1/tickets/:id` · **Estado:** ✅

### Sprint 3

**HU09 — Registrar una prioridad de servicio (SLA)**
- **COMO** Jefe de TI **QUIERO** registrar una prioridad de servicio **PARA** definir tiempos de respuesta y resolución por nivel.
- **Actor:** Jefe de TI · **Endpoint:** `POST /api/v1/sla` · **Estado:** ✅

**HU10 — Registrar un artículo de conocimiento**
- **COMO** técnico **QUIERO** registrar un artículo de conocimiento **PARA** documentar soluciones reutilizables.
- **Actor:** Técnico / Jefe de TI · **Endpoint:** `POST /api/v1/knowledge-base` · **Estado:** ✅

**HU11 — Consultar la base de conocimientos**
- **COMO** usuario **QUIERO** consultar la base de conocimientos **PARA** resolver incidencias conocidas.
- **Actor:** Todos · **Endpoint:** `GET /api/v1/knowledge-base` · **Estado:** ✅

**HU12 — Registrar un equipo informático**
- **COMO** Jefe de TI **QUIERO** registrar un equipo informático **PARA** mantener el inventario actualizado.
- **Actor:** Jefe de TI · **Endpoint:** `POST /api/v1/equipments` · **Estado:** ✅

### Sprint 4

**HU13 — Consultar equipos informáticos**
- **COMO** Jefe de TI **QUIERO** consultar los equipos informáticos **PARA** conocer el inventario disponible.
- **Actor:** Jefe de TI · **Endpoint:** `GET /api/v1/equipments` · **Estado:** ✅

**HU14 — Actualizar la ficha de un equipo informático**
- **COMO** Jefe de TI **QUIERO** actualizar la ficha de un equipo **PARA** corregir sus datos.
- **Actor:** Jefe de TI · **Endpoint:** `PUT /api/v1/equipments/:id` · **Estado:** ✅

**HU15 — Registrar disponibilidad de técnicos**
- **COMO** técnico **QUIERO** registrar mi disponibilidad **PARA** que se me asignen turnos.
- **Actor:** Técnico / Jefe de TI · **Endpoint:** `POST /api/v1/availability` · **Estado:** ✅

**HU16 — Consultar la disponibilidad de los técnicos**
- **COMO** Jefe de TI **QUIERO** consultar la disponibilidad de los técnicos **PARA** asignar tickets eficientemente.
- **Actor:** Técnico / Jefe de TI · **Endpoint:** `GET /api/v1/availability` · **Estado:** ✅

### Sprint 5

**HU17 — Registrar una evaluación de servicio**
- **COMO** usuario **QUIERO** registrar una evaluación de servicio **PARA** calificar la atención recibida.
- **Actor:** Usuario / Jefe de TI · **Endpoint:** `POST /api/v1/evaluations` · **Estado:** ✅

**HU18 — Auditar y actualizar el estado final de un ticket**
- **COMO** Jefe de TI **QUIERO** auditar y actualizar el estado final de un ticket **PARA** cerrarlo formalmente.
- **Actor:** Jefe de TI · **Endpoint:** `PATCH /api/v1/tickets/:id` · **Estado:** ✅

**HU19 — Consultar las evaluaciones de servicio**
- **COMO** Jefe de TI **QUIERO** consultar las evaluaciones de servicio **PARA** medir la satisfacción.
- **Actor:** Usuario / Jefe de TI · **Endpoint:** `GET /api/v1/evaluations` · **Estado:** ✅

**HU20 — Generar reporte de cumplimiento de SLA**
- **COMO** Jefe de TI **QUIERO** generar un reporte de cumplimiento de SLA **PARA** verificar el cumplimiento de los acuerdos.
- **Actor:** Jefe de TI · **Estado:** ⬜
- **Reglas de negocio:** RN-01 solo el Jefe de TI accede; RN-02 tiempo de respuesta = `actualizado_en` − `creado_en`; RN-03 tiempo de resolución = `fecha_cierre` − `creado_en`; RN-04 "Cumple SLA" solo si satisface respuesta y resolución simultáneamente.

### Sprint 6

**HU21 — Reporte de carga de trabajo de técnicos**
- **COMO** Jefe de TI **QUIERO** generar un reporte de carga de trabajo de técnicos **PARA** balancear la asignación de tickets.
- **Actor:** Jefe de TI · **Estado:** ⬜

**HU22 — Reporte del historial de fallas por equipo**
- **COMO** Jefe de TI **QUIERO** generar un reporte del historial de fallas por equipo informático **PARA** detectar equipos problemáticos.
- **Actor:** Jefe de TI · **Estado:** ⬜

**HU23 — Reporte de evaluaciones de satisfacción**
- **COMO** Jefe de TI **QUIERO** generar un reporte de las evaluaciones de satisfacción **PARA** conocer el nivel de servicio percibido.
- **Actor:** Jefe de TI · **Endpoint:** `GET /api/v1/reports/summary` · **Estado:** 🚧 (incluye promedio y distribución por estrellas).

**HU24 — Reporte de artículos de conocimiento más consultados**
- **COMO** Jefe de TI **QUIERO** generar un reporte sobre los artículos de conocimiento más consultados **PARA** priorizar la documentación útil.
- **Actor:** Jefe de TI · **Estado:** ⬜

---

## 6. Trazabilidad código ↔ HU (resumen)

| Módulo backend | Router | HU relacionadas |
|---|---|---|
| Autenticación | `/auth` | HU01, HU05 |
| Usuarios | `/users` | HU02, HU03, HU04 |
| Tickets | `/tickets` | HU06, HU07, HU08, HU18 |
| SLA | `/sla` | HU09, HU20 |
| Base de conocimiento | `/knowledge-base` | HU10, HU11, HU24 |
| Equipos | `/equipments` | HU12, HU13, HU14, HU22 |
| Disponibilidad | `/availability` | HU15, HU16 |
| Evaluaciones | `/evaluations` | HU17, HU19, HU23 |
| Reportes | `/reports` | HU20–HU24 |
