-- ============================================================
-- Sprint 5 y 6 — reportes
-- Aplica este script sobre una base que ya tiene el esquema previo.
-- ============================================================

begin;

-- HU20: marcas reales para medir respuesta y resolucion contra el SLA.
alter table tickets add column if not exists iniciado_en timestamptz;
alter table tickets add column if not exists cerrado_en  timestamptz;

-- Índices usados por los reportes de SLA, carga, fallas y satisfaccion.
create index if not exists idx_tickets_tecnico on tickets (tecnico_id);
create index if not exists idx_tickets_equipo on tickets (equipo_id);
create index if not exists idx_tickets_estado on tickets (estado);
create index if not exists idx_evaluaciones_tecnico on evaluaciones (tecnico_id);
create index if not exists idx_articulos_vistas on articulos_conocimiento (vistas desc);

-- Nota: los tickets historicos no tienen iniciado_en/cerrado_en.
-- HU20 los muestra como "Sin datos" en lugar de inventar tiempos.

commit;
