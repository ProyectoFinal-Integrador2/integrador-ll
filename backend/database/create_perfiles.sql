-- ==============================================================================
-- Script: create_perfiles.sql
-- Ubicación: backend/database/create_perfiles.sql
-- Descripción: Creación del esquema 'bd_sistema_incidencia', tabla 'perfiles',
--              índices, permisos y políticas de seguridad (RLS).
-- Contexto: HU-001 - Gestión de Usuarios y Perfiles
-- Motor: PostgreSQL 15 (Supabase)
-- ==============================================================================

-- 1. CREACIÓN Y CONFIGURACIÓN DEL ESQUEMA
-- ------------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS bd_sistema_incidencia;

-- Otorgar permisos de uso en el esquema para los roles estándar de Supabase
GRANT USAGE ON SCHEMA bd_sistema_incidencia TO anon, authenticated, service_role;

-- 2. CREACIÓN DE LA TABLA 'perfiles'
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bd_sistema_incidencia.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario' 
        CONSTRAINT chk_perfiles_rol CHECK (rol IN ('usuario', 'jefe_ti', 'tecnico')),
    nombre_completo VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comentarios descriptivos de catálogo
COMMENT ON TABLE bd_sistema_incidencia.perfiles IS 'Almacena la información de perfil y roles de los usuarios del sistema.';
COMMENT ON COLUMN bd_sistema_incidencia.perfiles.id IS 'Identificador único vinculado 1:1 con la tabla auth.users de Supabase.';
COMMENT ON COLUMN bd_sistema_incidencia.perfiles.rol IS 'Rol del usuario en el sistema. Valores permitidos: usuario, jefe_ti, tecnico.';
COMMENT ON COLUMN bd_sistema_incidencia.perfiles.nombre_completo IS 'Nombre y apellidos completos del usuario.';

-- Otorgar privilegios a nivel de tabla para roles de Supabase
GRANT ALL ON bd_sistema_incidencia.perfiles TO service_role;
GRANT SELECT, UPDATE ON bd_sistema_incidencia.perfiles TO authenticated;

-- 3. CREACIÓN DE ÍNDICES
-- ------------------------------------------------------------------------------
-- Optimiza consultas de filtrado y búsquedas por rol
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON bd_sistema_incidencia.perfiles (rol);

-- 4. SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
-- ------------------------------------------------------------------------------
-- Habilitar RLS de forma estricta en la tabla
ALTER TABLE bd_sistema_incidencia.perfiles ENABLE ROW LEVEL SECURITY;

-- 4.1 POLÍTICA DE LECTURA (SELECT)
-- Cada usuario autenticado únicamente tiene permisos para consultar su propio registro.
CREATE POLICY "Los usuarios pueden consultar su propio perfil"
    ON bd_sistema_incidencia.perfiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- 4.2 POLÍTICA DE INSERCIÓN (INSERT)
-- Bloquear inserciones directas de clientes públicos (anon/authenticated).
-- La creación de registros se delega exclusivamente a Edge Functions / backend seguro con service_role.
CREATE POLICY "Bloquear inserciones publicas directas"
    ON bd_sistema_incidencia.perfiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (false);

-- Permitir inserción mediante service_role (Edge Functions / Backend)
CREATE POLICY "Permitir insercion solo a service_role o procesos internos"
    ON bd_sistema_incidencia.perfiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- 4.3 POLÍTICA DE ACTUALIZACIÓN (UPDATE)
-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
    ON bd_sistema_incidencia.perfiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
