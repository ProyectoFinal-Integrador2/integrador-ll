# Migración manual `dev-nueva` → `dev` (por HU)

Guía para pasar **todo lo avanzado** de `dev-nueva` a `dev` **manualmente**, sin `merge`
ni Pull Request, **separado por HU/issue/persona** para que cada integrante suba su parte.

- Rama origen: `dev-nueva`
- Rama destino: `dev`
- Método de copia: `git checkout dev-nueva -- <ruta>` y commit en `dev`.
- Orden obligatorio: **P2 → P17** (cada paquete asume los anteriores).

---

## Estado

- **P1 — ✅ ya ejecutado** (base, infraestructura y reescritura de HU01–HU04 + HU05).
- **P2 → P17 — pendientes** (se detallan abajo).
- Verificar al final que P1 incluyó:
  `proyecto-integrador-front/src/services/dashboardApi.ts` y
  `proyecto-integrador-front/src/types/dashboard.types.ts` (los usa `DashboardPage`).
  Si faltaron, agregarlos con el primer paquete que los use (P2).

## Regla para archivos compartidos

Varios archivos sirven a más de una HU del mismo módulo (p. ej. `ticket.controller.ts`
tiene `listar`=HU07, `crear`=HU06, `cambiarEstado`=HU08/HU18 en un solo archivo).

**Regla:** el "módulo compartido" (backend + `Page` + `services/*Api.ts` + `types/*` +
estilos) se asigna a la **primera HU del módulo** (dueña). Las demás HU del módulo solo
suben sus **componentes exclusivos** y dependen del paquete dueño.

> Consecuencia: cada paquete con "requiere Px" no compila solo; subirlo después del dueño.

## Advertencia de compilación

`routes/index.ts` y `App.tsx` (P1) ya importan **todos** los módulos. `dev` no compilará
completo hasta subir P2–P16. Es esperado con esta estrategia.

---

## P2 · HU06 — Registrar ticket de incidencia (dueño módulo Tickets)

Sube el **módulo tickets completo** + su componente exclusivo.

### Backend
```
proyecto-integrador-back/src/controllers/ticket.controller.ts
proyecto-integrador-back/src/services/ticket.service.ts
proyecto-integrador-back/src/repositories/ticket.repository.ts
proyecto-integrador-back/src/routes/ticket.routes.ts
proyecto-integrador-back/src/types/ticket.types.ts
```

### Frontend
```
proyecto-integrador-front/src/pages/TicketsPage.tsx
proyecto-integrador-front/src/services/ticketsApi.ts
proyecto-integrador-front/src/types/ticket.types.ts
proyecto-integrador-front/src/utils/ticketStyles.ts
proyecto-integrador-front/src/components/tickets/CreateTicketModal.tsx
proyecto-integrador-front/src/components/tickets/TicketList.tsx
proyecto-integrador-front/src/components/tickets/TicketFilters.tsx
proyecto-integrador-front/src/components/tickets/TicketsToolbar.tsx
proyecto-integrador-front/src/components/tickets/TicketDetailModal.tsx
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/ticket.controller.ts proyecto-integrador-back/src/services/ticket.service.ts proyecto-integrador-back/src/repositories/ticket.repository.ts proyecto-integrador-back/src/routes/ticket.routes.ts proyecto-integrador-back/src/types/ticket.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/TicketsPage.tsx proyecto-integrador-front/src/services/ticketsApi.ts proyecto-integrador-front/src/types/ticket.types.ts proyecto-integrador-front/src/utils/ticketStyles.ts
git checkout dev-nueva -- proyecto-integrador-front/src/components/tickets
git add -A
git commit -m "feat(HU06): registrar ticket de incidencia"
git push
```

> Al abrir el PR, vincula la **issue HU06**.

---

## P3 · HU07 — Consultar tickets de incidencia

Solo componentes exclusivos de consulta (requiere P2).
```
proyecto-integrador-front/src/components/tickets/TicketList.tsx
proyecto-integrador-front/src/components/tickets/TicketFilters.tsx
proyecto-integrador-front/src/components/tickets/TicketsToolbar.tsx
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-front/src/components/tickets/TicketList.tsx proyecto-integrador-front/src/components/tickets/TicketFilters.tsx proyecto-integrador-front/src/components/tickets/TicketsToolbar.tsx
git add -A
git commit -m "feat(HU07): consultar tickets de incidencia"
git push
```

---

## P4 · HU08 — Actualizar el estado de un ticket

Componente exclusivo del detalle/cambio de estado (requiere P2). Lo comparte con HU18.
```
proyecto-integrador-front/src/components/tickets/TicketDetailModal.tsx
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-front/src/components/tickets/TicketDetailModal.tsx
git add -A
git commit -m "feat(HU08): actualizar estado de ticket"
git push
```

---

## P5 · HU09 — Registrar prioridad de servicio (SLA)

Módulo completo (única HU de SLA).
```
proyecto-integrador-back/src/controllers/sla.controller.ts
proyecto-integrador-back/src/services/sla.service.ts
proyecto-integrador-back/src/repositories/sla.repository.ts
proyecto-integrador-back/src/routes/sla.routes.ts
proyecto-integrador-back/src/types/sla.types.ts
proyecto-integrador-front/src/pages/SlaPage.tsx
proyecto-integrador-front/src/components/sla/SlaCommitmentPanel.tsx
proyecto-integrador-front/src/components/sla/SlaLevelBadge.tsx
proyecto-integrador-front/src/components/sla/SlaPriorityModal.tsx
proyecto-integrador-front/src/components/sla/SlaTable.tsx
proyecto-integrador-front/src/components/sla/SlaToolbar.tsx
proyecto-integrador-front/src/services/slasApi.ts
proyecto-integrador-front/src/types/sla.types.ts
proyecto-integrador-front/src/utils/slaTime.ts
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/sla.controller.ts proyecto-integrador-back/src/services/sla.service.ts proyecto-integrador-back/src/repositories/sla.repository.ts proyecto-integrador-back/src/routes/sla.routes.ts proyecto-integrador-back/src/types/sla.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/SlaPage.tsx proyecto-integrador-front/src/components/sla proyecto-integrador-front/src/services/slasApi.ts proyecto-integrador-front/src/types/sla.types.ts proyecto-integrador-front/src/utils/slaTime.ts
git add -A
git commit -m "feat(HU09): registrar prioridad de servicio (SLA)"
git push
```

---

## P6 · HU10 — Registrar artículo de conocimiento (dueño módulo Knowledge)

Módulo knowledge completo + componente exclusivo.
```
proyecto-integrador-back/src/controllers/knowledge.controller.ts
proyecto-integrador-back/src/services/knowledge.service.ts
proyecto-integrador-back/src/repositories/knowledge.repository.ts
proyecto-integrador-back/src/routes/knowledge.routes.ts
proyecto-integrador-back/src/types/knowledge.types.ts
proyecto-integrador-front/src/pages/KnowledgeBasePage.tsx
proyecto-integrador-front/src/services/knowledgeApi.ts
proyecto-integrador-front/src/types/knowledge.types.ts
proyecto-integrador-front/src/components/conocimiento/RegisterArticleModal.tsx
proyecto-integrador-front/src/components/conocimiento/KnowledgeCard.tsx
proyecto-integrador-front/src/components/conocimiento/KnowledgeFilters.tsx
proyecto-integrador-front/src/components/conocimiento/KnowledgeToolbar.tsx
proyecto-integrador-front/src/components/conocimiento/knowledgeCategoryStyles.ts
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/knowledge.controller.ts proyecto-integrador-back/src/services/knowledge.service.ts proyecto-integrador-back/src/repositories/knowledge.repository.ts proyecto-integrador-back/src/routes/knowledge.routes.ts proyecto-integrador-back/src/types/knowledge.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/KnowledgeBasePage.tsx proyecto-integrador-front/src/services/knowledgeApi.ts proyecto-integrador-front/src/types/knowledge.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/components/conocimiento
git add -A
git commit -m "feat(HU10): registrar articulo de conocimiento"
git push
```

---

## P7 · HU11 — Consultar la base de conocimientos

Componentes exclusivos de consulta (requiere P6).
```
proyecto-integrador-front/src/components/conocimiento/KnowledgeCard.tsx
proyecto-integrador-front/src/components/conocimiento/KnowledgeFilters.tsx
proyecto-integrador-front/src/components/conocimiento/KnowledgeToolbar.tsx
proyecto-integrador-front/src/components/conocimiento/knowledgeCategoryStyles.ts
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-front/src/components/conocimiento/KnowledgeCard.tsx proyecto-integrador-front/src/components/conocimiento/KnowledgeFilters.tsx proyecto-integrador-front/src/components/conocimiento/KnowledgeToolbar.tsx proyecto-integrador-front/src/components/conocimiento/knowledgeCategoryStyles.ts
git add -A
git commit -m "feat(HU11): consultar base de conocimientos"
git push
```

---

## P8 · HU12 — Registrar equipo informático (dueño módulo Equipos)

Módulo equipment completo + componente exclusivo.
```
proyecto-integrador-back/src/controllers/equipment.controller.ts
proyecto-integrador-back/src/services/equipment.service.ts
proyecto-integrador-back/src/repositories/equipment.repository.ts
proyecto-integrador-back/src/routes/equipment.routes.ts
proyecto-integrador-back/src/types/equipment.types.ts
proyecto-integrador-front/src/pages/EquipmentsPage.tsx
proyecto-integrador-front/src/services/equipmentsApi.ts
proyecto-integrador-front/src/types/equipment.types.ts
proyecto-integrador-front/src/components/equipos/RegisterEquipmentModal.tsx
proyecto-integrador-front/src/components/equipos/EquipmentList.tsx
proyecto-integrador-front/src/components/equipos/EquipmentFilters.tsx
proyecto-integrador-front/src/components/equipos/EquipmentToolbar.tsx
proyecto-integrador-front/src/components/equipos/EquipmentStatusBadge.tsx
proyecto-integrador-front/src/components/equipos/EditEquipmentModal.tsx
proyecto-integrador-front/src/components/equipos/equipmentStyles.ts
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/equipment.controller.ts proyecto-integrador-back/src/services/equipment.service.ts proyecto-integrador-back/src/repositories/equipment.repository.ts proyecto-integrador-back/src/routes/equipment.routes.ts proyecto-integrador-back/src/types/equipment.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/EquipmentsPage.tsx proyecto-integrador-front/src/services/equipmentsApi.ts proyecto-integrador-front/src/types/equipment.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/components/equipos
git add -A
git commit -m "feat(HU12): registrar equipo informatico"
git push
```

---

## P9 · HU13 — Consultar equipos informáticos

Componentes exclusivos de consulta (requiere P8).
```
proyecto-integrador-front/src/components/equipos/EquipmentList.tsx
proyecto-integrador-front/src/components/equipos/EquipmentFilters.tsx
proyecto-integrador-front/src/components/equipos/EquipmentToolbar.tsx
proyecto-integrador-front/src/components/equipos/EquipmentStatusBadge.tsx
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-front/src/components/equipos/EquipmentList.tsx proyecto-integrador-front/src/components/equipos/EquipmentFilters.tsx proyecto-integrador-front/src/components/equipos/EquipmentToolbar.tsx proyecto-integrador-front/src/components/equipos/EquipmentStatusBadge.tsx
git add -A
git commit -m "feat(HU13): consultar equipos informaticos"
git push
```

---

## P10 · HU14 — Actualizar la ficha de un equipo

Componente exclusivo de edición (requiere P8).
```
proyecto-integrador-front/src/components/equipos/EditEquipmentModal.tsx
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-front/src/components/equipos/EditEquipmentModal.tsx
git add -A
git commit -m "feat(HU14): actualizar ficha de equipo"
git push
```

---

## P11 · HU15 — Registrar disponibilidad de técnicos (dueño módulo Disponibilidad)

Módulo availability completo + componente exclusivo.
```
proyecto-integrador-back/src/controllers/availability.controller.ts
proyecto-integrador-back/src/services/availability.service.ts
proyecto-integrador-back/src/repositories/availability.repository.ts
proyecto-integrador-back/src/routes/availability.routes.ts
proyecto-integrador-back/src/types/availability.types.ts
proyecto-integrador-front/src/pages/AvailabilityPage.tsx
proyecto-integrador-front/src/services/availabilityApi.ts
proyecto-integrador-front/src/types/availability.types.ts
proyecto-integrador-front/src/utils/horario.ts
proyecto-integrador-front/src/components/disponibilidad/AsignarTurnoModal.tsx
proyecto-integrador-front/src/components/disponibilidad/AvailabilityToolbar.tsx
proyecto-integrador-front/src/components/disponibilidad/TechnicianCard.tsx
proyecto-integrador-front/src/components/disponibilidad/TechnicianAvailabilityPanel.tsx
proyecto-integrador-front/src/components/disponibilidad/TecnicoStatusPanel.tsx
proyecto-integrador-front/src/components/disponibilidad/technicianStatusStyles.ts
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/availability.controller.ts proyecto-integrador-back/src/services/availability.service.ts proyecto-integrador-back/src/repositories/availability.repository.ts proyecto-integrador-back/src/routes/availability.routes.ts proyecto-integrador-back/src/types/availability.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/AvailabilityPage.tsx proyecto-integrador-front/src/services/availabilityApi.ts proyecto-integrador-front/src/types/availability.types.ts proyecto-integrador-front/src/utils/horario.ts
git checkout dev-nueva -- proyecto-integrador-front/src/components/disponibilidad
git add -A
git commit -m "feat(HU15): registrar disponibilidad de tecnicos"
git push
```

---

## P12 · HU16 — Consultar la disponibilidad de los técnicos

Componentes exclusivos de consulta (requiere P11).
```
proyecto-integrador-front/src/components/disponibilidad/AvailabilityToolbar.tsx
proyecto-integrador-front/src/components/disponibilidad/TechnicianCard.tsx
proyecto-integrador-front/src/components/disponibilidad/TechnicianAvailabilityPanel.tsx
proyecto-integrador-front/src/components/disponibilidad/TecnicoStatusPanel.tsx
proyecto-integrador-front/src/components/disponibilidad/technicianStatusStyles.ts
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-front/src/components/disponibilidad/AvailabilityToolbar.tsx proyecto-integrador-front/src/components/disponibilidad/TechnicianCard.tsx proyecto-integrador-front/src/components/disponibilidad/TechnicianAvailabilityPanel.tsx proyecto-integrador-front/src/components/disponibilidad/TecnicoStatusPanel.tsx proyecto-integrador-front/src/components/disponibilidad/technicianStatusStyles.ts
git add -A
git commit -m "feat(HU16): consultar disponibilidad de tecnicos"
git push
```

---

## P13 · HU17 — Registrar una evaluación de servicio (dueño módulo Evaluaciones)

Módulo evaluation completo + componentes exclusivos.
```
proyecto-integrador-back/src/controllers/evaluation.controller.ts
proyecto-integrador-back/src/services/evaluation.service.ts
proyecto-integrador-back/src/repositories/evaluation.repository.ts
proyecto-integrador-back/src/routes/evaluation.routes.ts
proyecto-integrador-back/src/types/evaluation.types.ts
proyecto-integrador-front/src/pages/EvaluationsPage.tsx
proyecto-integrador-front/src/services/evaluationsApi.ts
proyecto-integrador-front/src/types/evaluation.types.ts
proyecto-integrador-front/src/components/evaluaciones/EvaluationForm.tsx
proyecto-integrador-front/src/components/evaluaciones/StarRatingInput.tsx
proyecto-integrador-front/src/components/evaluaciones/EvaluationCard.tsx
proyecto-integrador-front/src/components/evaluaciones/EvaluationsToolbar.tsx
proyecto-integrador-front/src/components/evaluaciones/MyEvaluationsView.tsx
proyecto-integrador-front/src/components/evaluaciones/TecnicoEvaluationsPanel.tsx
proyecto-integrador-front/src/components/evaluaciones/StarRating.tsx
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/evaluation.controller.ts proyecto-integrador-back/src/services/evaluation.service.ts proyecto-integrador-back/src/repositories/evaluation.repository.ts proyecto-integrador-back/src/routes/evaluation.routes.ts proyecto-integrador-back/src/types/evaluation.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/EvaluationsPage.tsx proyecto-integrador-front/src/services/evaluationsApi.ts proyecto-integrador-front/src/types/evaluation.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/components/evaluaciones
git add -A
git commit -m "feat(HU17): registrar evaluacion de servicio"
git push
```

---

## P14 · HU18 — Auditar y actualizar el estado final de un ticket

> ⚠ **Sin archivos exclusivos.** HU18 es un flujo sobre el módulo de tickets ya subido
> en P2 y el `TicketDetailModal` de P4. No tiene componente/endpoint propio.

Opciones:
- Que el PR de HU18 **referencie** los archivos de P2/P4 (cerrar la issue sin commit nuevo), o
- Fusionar la issue HU18 con el PR de HU08 (P4).

No hay comando de copia para este paquete.

---

## P15 · HU19 — Consultar las evaluaciones de servicio

Componentes exclusivos de consulta (requiere P13).
```
proyecto-integrador-front/src/components/evaluaciones/EvaluationCard.tsx
proyecto-integrador-front/src/components/evaluaciones/EvaluationsToolbar.tsx
proyecto-integrador-front/src/components/evaluaciones/MyEvaluationsView.tsx
proyecto-integrador-front/src/components/evaluaciones/TecnicoEvaluationsPanel.tsx
proyecto-integrador-front/src/components/evaluaciones/StarRating.tsx
```

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-front/src/components/evaluaciones/EvaluationCard.tsx proyecto-integrador-front/src/components/evaluaciones/EvaluationsToolbar.tsx proyecto-integrador-front/src/components/evaluaciones/MyEvaluationsView.tsx proyecto-integrador-front/src/components/evaluaciones/TecnicoEvaluationsPanel.tsx proyecto-integrador-front/src/components/evaluaciones/StarRating.tsx
git add -A
git commit -m "feat(HU19): consultar evaluaciones de servicio"
git push
```

---

## P16 · HU20–HU24 — Reportes

Módulo `report` completo (no separable por HU, es un archivo por capa).
```
proyecto-integrador-back/src/controllers/report.controller.ts
proyecto-integrador-back/src/services/report.service.ts
proyecto-integrador-back/src/repositories/report.repository.ts
proyecto-integrador-back/src/routes/report.routes.ts
proyecto-integrador-back/src/types/report.types.ts
proyecto-integrador-front/src/pages/ReportsPage.tsx
proyecto-integrador-front/src/components/reportes/RecentTicketsPanel.tsx
proyecto-integrador-front/src/components/reportes/ReportBarList.tsx
proyecto-integrador-front/src/components/reportes/ReportStatCard.tsx
proyecto-integrador-front/src/components/reportes/WeeklyTicketsChart.tsx
proyecto-integrador-front/src/components/reportes/reportBarStyles.ts
proyecto-integrador-front/src/services/reportsApi.ts
proyecto-integrador-front/src/types/report.types.ts
```

> `components/reportes/*` importa `@/types/dashboard.types` (ya en P1).
> `routes/index.ts` y `App.tsx` ya importan este módulo, por eso es necesario subirlo.

```powershell
git checkout dev
git pull
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/report.controller.ts proyecto-integrador-back/src/services/report.service.ts proyecto-integrador-back/src/repositories/report.repository.ts proyecto-integrador-back/src/routes/report.routes.ts proyecto-integrador-back/src/types/report.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/ReportsPage.tsx proyecto-integrador-front/src/components/reportes proyecto-integrador-front/src/services/reportsApi.ts proyecto-integrador-front/src/types/report.types.ts
git add -A
git commit -m "feat(HU20-HU24): reportes"
git push
```

---

## P17 · Docker y base de datos

```
docker-compose.yml
docker.compose.yml
database/integrador_BDD.sql
proyecto-integrador-back/.dockerignore
proyecto-integrador-back/dockerfile
proyecto-integrador-front/.dockerignore
proyecto-integrador-front/dockerfile
proyecto-integrador-front/nginx.conf
```

> `docker.compose.yml` existe en `dev-nueva` pero está vacío (0 bytes). Opcional.

```powershell
git checkout dev
git pull
git checkout dev-nueva -- docker-compose.yml docker.compose.yml database/integrador_BDD.sql
git checkout dev-nueva -- proyecto-integrador-back/.dockerignore proyecto-integrador-back/dockerfile
git checkout dev-nueva -- proyecto-integrador-front/.dockerignore proyecto-integrador-front/dockerfile proyecto-integrador-front/nginx.conf
git add -A
git commit -m "chore: docker y base de datos"
git push
```

---

# Referencia · P1 (✅ ya ejecutado)

Se deja documentado para verificación. No volver a subir.

- Raíz: `package.json`, `package-lock.json`, `.nvmrc`, `.gitignore`, `.gitattributes`, `.env.example`
- Back infra: `config/{db,env}.ts`, `middlewares/{auth,errorHandler,notFound}.ts`, `utils/{httpError,password,avatar}.ts`, `app.ts`, `server.ts`, `routes/index.ts`, `routes/health.routes.ts`, `.env.example`, `package.json`, `tsconfig.json`
- Back módulos: `auth.*`, `user.*` (incluye reset password = HU05), `dashboard.*`
- Front infra: `App.tsx`, `main.tsx`, `index.css`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`, `package.json`
- Front base: `components/layout/*`, `components/autenticacion/*`, `components/common/BaseModal.tsx`, `context/*`, `services/{apiClient,authApi,sessionStore}.ts`, `types/roles.ts`, `utils/{avatarStyles,date,roleStyles,text}.ts`
- Front HU01–05: `pages/{LoginPage,DashboardPage,UsersPage,EditProfilePage}.tsx`, `components/usuarios/*`, `components/dashboard/*`, `services/{usersApi,dashboardApi}.ts`, `types/{user,dashboard}.types.ts`
- **Borrados**: `README.md`, `Roles.md`, `proyecto-integrador-back/package-lock.json`, `proyecto-integrador-back/src/.env.example`, `proyecto-integrador-front/.gitignore`, `proyecto-integrador-front/package-lock.json`, `proyecto-integrador-front/public/icons.svg`, `proyecto-integrador-front/src/App.css`, `proyecto-integrador-front/src/assets`, `proyecto-integrador-front/src/components/{index.ts,layouts,modals}`, `proyecto-integrador-front/src/features`, `proyecto-integrador-front/src/layout`, `proyecto-integrador-front/src/routes`

---

## Apéndice · Documentación y evidencias (opcional)

No es código. Subir en un commit aparte.

```
ARQUITECTURA.md
Avance.md
Avance_2.md
Init_Proyect.md
REQUERIMIENTOS.md
Arquitectura Docker para Soporte TI.png
"Arquitectura web moderna con autenticación JWT.png"
Diagrama de flujo Login.jpeg
Diagrama de flujo.png
Diagrama.jpeg
Laboratorios/Laboratorio 5/README.md
Laboratorios/Laboratorio 6/README.md
Laboratorios/Laboratorio 7/README.md
Laboratorios/Laboratorio 8/README.md
```

> `Sesiones/` fue renombrada en `dev-nueva` (guion bajo → espacio). Reemplazar la carpeta completa.

```powershell
git checkout dev
git pull
git checkout dev-nueva -- ARQUITECTURA.md Avance.md Avance_2.md Init_Proyect.md REQUERIMIENTOS.md
git checkout dev-nueva -- "Arquitectura Docker para Soporte TI.png" "Arquitectura web moderna con autenticación JWT.png" "Diagrama de flujo Login.jpeg" "Diagrama de flujo.png" Diagrama.jpeg
git checkout dev-nueva -- "Laboratorios/Laboratorio 5" "Laboratorios/Laboratorio 6" "Laboratorios/Laboratorio 7" "Laboratorios/Laboratorio 8"
git rm -r Sesiones
git checkout dev-nueva -- Sesiones
git add -A
git commit -m "docs: actualizar documentacion y evidencias"
git push
```

---

## Verificación final

Con todo subido, parado en `dev`:

```powershell
git diff --name-status dev dev-nueva
```

Debe devolver **vacío** (o solo diferencias esperadas). Luego:

```powershell
npm install
npm run typecheck
npm run lint
npm run build
```

Todo debe pasar. Si aparece un `import` sin resolver, falta subir el paquete de ese módulo.

---

## Notas sobre renombrados (ya cubiertos en P1)

| Antes en `dev` | Ahora en `dev-nueva` |
|---|---|
| `src/components/layouts/Header.tsx` | `src/components/layout/Header.tsx` |
| `src/components/layouts/Sidebar.tsx` | `src/components/layout/Sidebar.tsx` |
| `src/components/modals/BaseModal.tsx` | `src/components/common/BaseModal.tsx` |
| `src/layout/MainLayout.tsx` | `src/components/layout/MainLayout.tsx` |
| `src/features/users/**` | `src/components/usuarios/**`, `src/pages/UsersPage.tsx`, `src/pages/EditProfilePage.tsx` |
| `src/routes/router.tsx` | enrutado dentro de `src/App.tsx` |
