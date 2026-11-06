-- Ejecutar una vez en la base existente antes de iniciar el backend actualizado.
CREATE TABLE IF NOT EXISTS intentos_login (
  correo text PRIMARY KEY,
  intentos integer NOT NULL DEFAULT 0 CHECK (intentos BETWEEN 0 AND 3),
  bloqueado_hasta timestamptz
);
