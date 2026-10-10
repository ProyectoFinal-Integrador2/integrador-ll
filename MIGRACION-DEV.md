# Migración `dev-nueva` → `dev` · HU09 a HU19

Reparto **sin repetición** de los archivos que faltan por subir a `dev`.
Cada archivo aparece **una sola vez**; cada issue sube su parte (aunque no tenga
relación con la HU, como acordamos).

- Rama origen: `dev-nueva` · Rama destino: `dev`
- **Ya subido**: P1 (base + HU01–HU05) y HU06–HU08. No volver a subir.
- Total restante: **93 archivos** repartidos en **HU09 → HU19**.

## Flujo por issue (rama + push, y el PO hace el PR)

```powershell
git switch dev
git pull
git switch -c feat/HU-009-sla
git checkout dev-nueva -- <rutas del issue>
git add -A
git commit -m "feat(HU09): <descripcion> (closes #<nro>)"
git push -u origin feat/HU-009-sla
```

> Reemplazá `<nro>` por el número real de la issue. Si preferís commitear directo a
> `dev`, omití la rama y hacé `git add -A; git commit; git push` en `dev`.

---
## HU05 — Registrar ticket de incidencia (dueño módulo Tickets) · 7 archivos

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
```

```powershell
git switch dev; git pull; git switch -c feat/HU-005-registrar-ticket
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/ticket.controller.ts proyecto-integrador-back/src/services/ticket.service.ts proyecto-integrador-back/src/repositories/ticket.repository.ts proyecto-integrador-back/src/routes/ticket.routes.ts proyecto-integrador-back/src/types/ticket.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/TicketsPage.tsx proyecto-integrador-front/src/services/ticketsApi.ts proyecto-integrador-front/src/types/ticket.types.ts proyecto-integrador-front/src/utils/ticketStyles.ts proyecto-integrador-front/src/components/tickets/CreateTicketModal.tsx
git add -A; git commit -m "feat(HU05): registrar ticket de incidencia (closes #<nro>)"; git push -u origin feat/HU-005-registrar-ticket
```

> `TicketsPage.tsx` importa los componentes que llegan en HU07/HU08; no compila solo.

---

## HU06 — Consultar tickets de incidencia · 3 archivos

```
proyecto-integrador-front/src/components/tickets/TicketList.tsx
proyecto-integrador-front/src/components/tickets/TicketFilters.tsx
proyecto-integrador-front/src/components/tickets/TicketsToolbar.tsx
```

```powershell
git switch dev; git pull; git switch -c feat/HU-006-consultar-tickets
git checkout dev-nueva -- proyecto-integrador-front/src/components/tickets/TicketList.tsx proyecto-integrador-front/src/components/tickets/TicketFilters.tsx proyecto-integrador-front/src/components/tickets/TicketsToolbar.tsx
git add -A; git commit -m "feat(HU06): consultar tickets de incidencia (closes #<nro>)"; git push -u origin feat/HU-006-consultar-tickets
```

---

## HU07 — Actualizar el estado de un ticket · 1 archivo

```
proyecto-integrador-front/src/components/tickets/TicketDetailModal.tsx
```

```powershell
git switch dev; git pull; git switch -c feat/HU-007-actualizar-ticket
git checkout dev-nueva -- proyecto-integrador-front/src/components/tickets/TicketDetailModal.tsx
git add -A; git commit -m "feat(HU07): actualizar el estado de un ticket (closes #<nro>)"; git push -u origin feat/HU-007-actualizar-ticket
```

> HU18 (auditoría) usa este mismo modal; no tiene archivos propios.

---
## HU08 YA ESTA SUBIDO, ES LA BASE DE TODO XD

## HU09 — Registrar prioridad de servicio (SLA) · 14 archivos

### Backend
```
proyecto-integrador-back/src/controllers/sla.controller.ts
proyecto-integrador-back/src/services/sla.service.ts
proyecto-integrador-back/src/repositories/sla.repository.ts
proyecto-integrador-back/src/routes/sla.routes.ts
proyecto-integrador-back/src/types/sla.types.ts
```

### Frontend
```
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
git switch dev; git pull; git switch -c feat/HU-009-sla
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/sla.controller.ts proyecto-integrador-back/src/services/sla.service.ts proyecto-integrador-back/src/repositories/sla.repository.ts proyecto-integrador-back/src/routes/sla.routes.ts proyecto-integrador-back/src/types/sla.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/SlaPage.tsx proyecto-integrador-front/src/components/sla proyecto-integrador-front/src/services/slasApi.ts proyecto-integrador-front/src/types/sla.types.ts proyecto-integrador-front/src/utils/slaTime.ts
git add -A; git commit -m "feat(HU09): registrar prioridad de servicio (closes #<nro>)"; git push -u origin feat/HU-009-sla
```

---

## HU10 — Base de conocimiento: alta · 9 archivos

### Backend
```
proyecto-integrador-back/src/controllers/knowledge.controller.ts
proyecto-integrador-back/src/services/knowledge.service.ts
proyecto-integrador-back/src/repositories/knowledge.repository.ts
proyecto-integrador-back/src/routes/knowledge.routes.ts
proyecto-integrador-back/src/types/knowledge.types.ts
```

### Frontend
```
proyecto-integrador-front/src/pages/KnowledgeBasePage.tsx
proyecto-integrador-front/src/components/conocimiento/RegisterArticleModal.tsx
proyecto-integrador-front/src/services/knowledgeApi.ts
proyecto-integrador-front/src/types/knowledge.types.ts
```

```powershell
git switch dev; git pull; git switch -c feat/HU-010-knowledge-alta
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/knowledge.controller.ts proyecto-integrador-back/src/services/knowledge.service.ts proyecto-integrador-back/src/repositories/knowledge.repository.ts proyecto-integrador-back/src/routes/knowledge.routes.ts proyecto-integrador-back/src/types/knowledge.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/KnowledgeBasePage.tsx proyecto-integrador-front/src/components/conocimiento/RegisterArticleModal.tsx proyecto-integrador-front/src/services/knowledgeApi.ts proyecto-integrador-front/src/types/knowledge.types.ts
git add -A; git commit -m "feat(HU10): registrar articulo de conocimiento (closes #<nro>)"; git push -u origin feat/HU-010-knowledge-alta
```

---

## HU11 — Conocimiento: consulta + reportes · 6 archivos

```
proyecto-integrador-front/src/components/conocimiento/KnowledgeCard.tsx
proyecto-integrador-front/src/components/conocimiento/KnowledgeFilters.tsx
proyecto-integrador-front/src/components/conocimiento/KnowledgeToolbar.tsx
proyecto-integrador-front/src/components/conocimiento/knowledgeCategoryStyles.ts
proyecto-integrador-front/src/pages/ReportsPage.tsx
proyecto-integrador-front/src/services/reportsApi.ts
```

```powershell
git switch dev; git pull; git switch -c feat/HU-011-knowledge-consulta
git checkout dev-nueva -- proyecto-integrador-front/src/components/conocimiento/KnowledgeCard.tsx proyecto-integrador-front/src/components/conocimiento/KnowledgeFilters.tsx proyecto-integrador-front/src/components/conocimiento/KnowledgeToolbar.tsx proyecto-integrador-front/src/components/conocimiento/knowledgeCategoryStyles.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/ReportsPage.tsx proyecto-integrador-front/src/services/reportsApi.ts
git add -A; git commit -m "feat(HU11): consultar base de conocimientos (closes #<nro>)"; git push -u origin feat/HU-011-knowledge-consulta
```

---

## HU12 — Equipos: alta · 10 archivos

> ⚠ **Nota de numeración:** en esta HU hubo un error de tipeo entre `012` y `12`.
> Verificá que la rama/commit queden con el mismo formato (el resto del doc usa
> `HU-012`), así el historial queda ordenado.

### Backend
```
proyecto-integrador-back/src/controllers/equipment.controller.ts
proyecto-integrador-back/src/services/equipment.service.ts
proyecto-integrador-back/src/repositories/equipment.repository.ts
proyecto-integrador-back/src/routes/equipment.routes.ts
proyecto-integrador-back/src/types/equipment.types.ts
```

### Frontend
```
proyecto-integrador-front/src/pages/EquipmentsPage.tsx
proyecto-integrador-front/src/components/equipos/RegisterEquipmentModal.tsx
proyecto-integrador-front/src/components/equipos/equipmentStyles.ts
proyecto-integrador-front/src/services/equipmentsApi.ts
proyecto-integrador-front/src/types/equipment.types.ts
```

```powershell
git switch dev; git pull; git switch -c feat/HU-012-equipos-alta
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/equipment.controller.ts proyecto-integrador-back/src/services/equipment.service.ts proyecto-integrador-back/src/repositories/equipment.repository.ts proyecto-integrador-back/src/routes/equipment.routes.ts proyecto-integrador-back/src/types/equipment.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/EquipmentsPage.tsx proyecto-integrador-front/src/components/equipos/RegisterEquipmentModal.tsx proyecto-integrador-front/src/components/equipos/equipmentStyles.ts proyecto-integrador-front/src/services/equipmentsApi.ts proyecto-integrador-front/src/types/equipment.types.ts
git add -A; git commit -m "feat(HU12): registrar equipo informatico (closes #<nro>)"; git push -u origin feat/HU-012-equipos-alta
```

---

## HU13 — Equipos: consulta + reportes · 6 archivos

```
proyecto-integrador-front/src/components/equipos/EquipmentList.tsx
proyecto-integrador-front/src/components/equipos/EquipmentFilters.tsx
proyecto-integrador-front/src/components/equipos/EquipmentToolbar.tsx
proyecto-integrador-front/src/components/equipos/EquipmentStatusBadge.tsx
proyecto-integrador-front/src/components/reportes/RecentTicketsPanel.tsx
proyecto-integrador-front/src/components/reportes/ReportBarList.tsx
```

```powershell
git switch dev; git pull; git switch -c feat/HU-013-equipos-consulta
git checkout dev-nueva -- proyecto-integrador-front/src/components/equipos/EquipmentList.tsx proyecto-integrador-front/src/components/equipos/EquipmentFilters.tsx proyecto-integrador-front/src/components/equipos/EquipmentToolbar.tsx proyecto-integrador-front/src/components/equipos/EquipmentStatusBadge.tsx
git checkout dev-nueva -- proyecto-integrador-front/src/components/reportes/RecentTicketsPanel.tsx proyecto-integrador-front/src/components/reportes/ReportBarList.tsx
git add -A; git commit -m "feat(HU13): consultar equipos informaticos (closes #<nro>)"; git push -u origin feat/HU-013-equipos-consulta
```

---

## HU14 — Equipos: edición + Docker/BD · 9 archivos

```
proyecto-integrador-front/src/components/equipos/EditEquipmentModal.tsx
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
git switch dev; git pull; git switch -c feat/HU-014-equipos-edicion
git checkout dev-nueva -- proyecto-integrador-front/src/components/equipos/EditEquipmentModal.tsx
git checkout dev-nueva -- docker-compose.yml docker.compose.yml database/integrador_BDD.sql proyecto-integrador-back/.dockerignore proyecto-integrador-back/dockerfile proyecto-integrador-front/.dockerignore proyecto-integrador-front/dockerfile proyecto-integrador-front/nginx.conf
git add -A; git commit -m "feat(HU14): actualizar ficha de equipo + docker (closes #<nro>)"; git push -u origin feat/HU-014-equipos-edicion
```

---

## HU15 — Disponibilidad: alta · 10 archivos

### Backend
```
proyecto-integrador-back/src/controllers/availability.controller.ts
proyecto-integrador-back/src/services/availability.service.ts
proyecto-integrador-back/src/repositories/availability.repository.ts
proyecto-integrador-back/src/routes/availability.routes.ts
proyecto-integrador-back/src/types/availability.types.ts
```

### Frontend
```
proyecto-integrador-front/src/pages/AvailabilityPage.tsx
proyecto-integrador-front/src/components/disponibilidad/AsignarTurnoModal.tsx
proyecto-integrador-front/src/services/availabilityApi.ts
proyecto-integrador-front/src/types/availability.types.ts
proyecto-integrador-front/src/utils/horario.ts
```

```powershell
git switch dev; git pull; git switch -c feat/HU-015-disponibilidad-alta
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/availability.controller.ts proyecto-integrador-back/src/services/availability.service.ts proyecto-integrador-back/src/repositories/availability.repository.ts proyecto-integrador-back/src/routes/availability.routes.ts proyecto-integrador-back/src/types/availability.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/AvailabilityPage.tsx proyecto-integrador-front/src/components/disponibilidad/AsignarTurnoModal.tsx proyecto-integrador-front/src/services/availabilityApi.ts proyecto-integrador-front/src/types/availability.types.ts proyecto-integrador-front/src/utils/horario.ts
git add -A; git commit -m "feat(HU15): registrar disponibilidad de tecnicos (closes #<nro>)"; git push -u origin feat/HU-015-disponibilidad-alta
```

---

## HU16 — Disponibilidad: consulta + reportes · 7 archivos

```
proyecto-integrador-front/src/components/disponibilidad/AvailabilityToolbar.tsx
proyecto-integrador-front/src/components/disponibilidad/TechnicianCard.tsx
proyecto-integrador-front/src/components/disponibilidad/TechnicianAvailabilityPanel.tsx
proyecto-integrador-front/src/components/disponibilidad/TecnicoStatusPanel.tsx
proyecto-integrador-front/src/components/disponibilidad/technicianStatusStyles.ts
proyecto-integrador-front/src/components/reportes/ReportStatCard.tsx
proyecto-integrador-front/src/components/reportes/WeeklyTicketsChart.tsx
```

```powershell
git switch dev; git pull; git switch -c feat/HU-016-disponibilidad-consulta
git checkout dev-nueva -- proyecto-integrador-front/src/components/disponibilidad/AvailabilityToolbar.tsx proyecto-integrador-front/src/components/disponibilidad/TechnicianCard.tsx proyecto-integrador-front/src/components/disponibilidad/TechnicianAvailabilityPanel.tsx proyecto-integrador-front/src/components/disponibilidad/TecnicoStatusPanel.tsx proyecto-integrador-front/src/components/disponibilidad/technicianStatusStyles.ts
git checkout dev-nueva -- proyecto-integrador-front/src/components/reportes/ReportStatCard.tsx proyecto-integrador-front/src/components/reportes/WeeklyTicketsChart.tsx
git add -A; git commit -m "feat(HU16): consultar disponibilidad de tecnicos (closes #<nro>)"; git push -u origin feat/HU-016-disponibilidad-consulta
```

---

## HU17 — Evaluaciones: alta · 10 archivos

### Backend
```
proyecto-integrador-back/src/controllers/evaluation.controller.ts
proyecto-integrador-back/src/services/evaluation.service.ts
proyecto-integrador-back/src/repositories/evaluation.repository.ts
proyecto-integrador-back/src/routes/evaluation.routes.ts
proyecto-integrador-back/src/types/evaluation.types.ts
```

### Frontend
```
proyecto-integrador-front/src/pages/EvaluationsPage.tsx
proyecto-integrador-front/src/components/evaluaciones/EvaluationForm.tsx
proyecto-integrador-front/src/components/evaluaciones/StarRatingInput.tsx
proyecto-integrador-front/src/services/evaluationsApi.ts
proyecto-integrador-front/src/types/evaluation.types.ts
```

```powershell
git switch dev; git pull; git switch -c feat/HU-017-evaluaciones-alta
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/evaluation.controller.ts proyecto-integrador-back/src/services/evaluation.service.ts proyecto-integrador-back/src/repositories/evaluation.repository.ts proyecto-integrador-back/src/routes/evaluation.routes.ts proyecto-integrador-back/src/types/evaluation.types.ts
git checkout dev-nueva -- proyecto-integrador-front/src/pages/EvaluationsPage.tsx proyecto-integrador-front/src/components/evaluaciones/EvaluationForm.tsx proyecto-integrador-front/src/components/evaluaciones/StarRatingInput.tsx proyecto-integrador-front/src/services/evaluationsApi.ts proyecto-integrador-front/src/types/evaluation.types.ts
git add -A; git commit -m "feat(HU17): registrar evaluacion de servicio (closes #<nro>)"; git push -u origin feat/HU-017-evaluaciones-alta
```

---

## HU18 — Reportes: backend · 5 archivos

```
proyecto-integrador-back/src/controllers/report.controller.ts
proyecto-integrador-back/src/services/report.service.ts
proyecto-integrador-back/src/repositories/report.repository.ts
proyecto-integrador-back/src/routes/report.routes.ts
proyecto-integrador-back/src/types/report.types.ts
```

```powershell
git switch dev; git pull; git switch -c feat/HU-018-reportes-backend
git checkout dev-nueva -- proyecto-integrador-back/src/controllers/report.controller.ts proyecto-integrador-back/src/services/report.service.ts proyecto-integrador-back/src/repositories/report.repository.ts proyecto-integrador-back/src/routes/report.routes.ts proyecto-integrador-back/src/types/report.types.ts
git add -A; git commit -m "feat(HU18): backend de reportes (closes #<nro>)"; git push -u origin feat/HU-018-reportes-backend
```

---

## HU19 — Evaluaciones: consulta + reportes · 7 archivos

```
proyecto-integrador-front/src/components/evaluaciones/EvaluationCard.tsx
proyecto-integrador-front/src/components/evaluaciones/EvaluationsToolbar.tsx
proyecto-integrador-front/src/components/evaluaciones/MyEvaluationsView.tsx
proyecto-integrador-front/src/components/evaluaciones/TecnicoEvaluationsPanel.tsx
proyecto-integrador-front/src/components/evaluaciones/StarRating.tsx
proyecto-integrador-front/src/components/reportes/reportBarStyles.ts
proyecto-integrador-front/src/types/report.types.ts
```

```powershell
git switch dev; git pull; git switch -c feat/HU-019-evaluaciones-consulta
git checkout dev-nueva -- proyecto-integrador-front/src/components/evaluaciones/EvaluationCard.tsx proyecto-integrador-front/src/components/evaluaciones/EvaluationsToolbar.tsx proyecto-integrador-front/src/components/evaluaciones/MyEvaluationsView.tsx proyecto-integrador-front/src/components/evaluaciones/TecnicoEvaluationsPanel.tsx proyecto-integrador-front/src/components/evaluaciones/StarRating.tsx
git checkout dev-nueva -- proyecto-integrador-front/src/components/reportes/reportBarStyles.ts proyecto-integrador-front/src/types/report.types.ts
git add -A; git commit -m "feat(HU19): consultar evaluaciones de servicio (closes #<nro>)"; git push -u origin feat/HU-019-evaluaciones-consulta
```

---

## Verificación final

Con todo subido a `dev`:

```powershell
git switch dev
git pull
git diff --name-status dev dev-nueva
```

Debe quedar **vacío** (o solo diferencias esperadas). Luego:

```powershell
npm install
npm run typecheck
npm run lint
npm run build
```

Todo debe pasar. Si aparece un `import` sin resolver, falta subir algún archivo de ese módulo.

---

## Apéndice · Documentación y evidencias (opcional)

No es código; subir en un commit aparte si se desea.

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

```powershell
git switch dev; git pull; git switch -c docs/evidencias
git checkout dev-nueva -- ARQUITECTURA.md Avance.md Avance_2.md Init_Proyect.md REQUERIMIENTOS.md
git checkout dev-nueva -- "Arquitectura Docker para Soporte TI.png" "Arquitectura web moderna con autenticación JWT.png" "Diagrama de flujo Login.jpeg" "Diagrama de flujo.png" Diagrama.jpeg
git checkout dev-nueva -- "Laboratorios/Laboratorio 5" "Laboratorios/Laboratorio 6" "Laboratorios/Laboratorio 7" "Laboratorios/Laboratorio 8"
git rm -r Sesiones
git checkout dev-nueva -- Sesiones
git add -A; git commit -m "docs: actualizar documentacion y evidencias"; git push -u origin docs/evidencias
```
