// Cada ejecución usa su propio esquema. Nunca borra tablas de la aplicación.
const { Client } = require('pg');
const { readFileSync, mkdirSync, writeFileSync } = require('node:fs');
const { spawn } = require('node:child_process');
require('dotenv').config({ path: 'proyecto-integrador-back/.env', quiet: true });
const esquema = `qa_iso_${Date.now()}`;
const original = process.env.DATABASE_URL;
const client = new Client({ connectionString: original,
  ssl: original?.includes('sslmode=require') ? { rejectUnauthorized: false } : false });
(async () => {
  let creado = false;
  try {
    await client.connect();
    await client.query(`CREATE SCHEMA ${esquema}`); creado = true;
    await client.query(`SET search_path TO ${esquema}`);
    await client.query(readFileSync('database/integrador_BDD.sql', 'utf8'));
    await client.query("INSERT INTO usuarios (nombre,correo,rol,area,password_hash) VALUES ('QA ISO','qa.iso@example.test','Jefe TI','TI',$1)",
      [require('bcryptjs').hashSync('PruebaISO123!', 10)]);
    const url = new URL(original);
    url.searchParams.set('options', `-c search_path=${esquema}`);
    mkdirSync('docs/calidad/evidencias/00-reportes-generales', { recursive: true });
    writeFileSync('docs/calidad/evidencias/00-reportes-generales/entorno.json', JSON.stringify({ fechaUTC: new Date().toISOString(),
      node: process.version, plataforma: process.platform, arquitectura: process.arch, esquema,
      playwright: require('@playwright/test/package.json').version,
      axe: require('axe-core/package.json').version,
      vitest: require('vitest/package.json').version,
      aislamiento: 'Esquema PostgreSQL exclusivo, eliminado al finalizar', viewport: '1366x768' }, null, 2));
    const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], {
      stdio: 'inherit', env: { ...process.env, DATABASE_URL: url.toString(), PORT: '3100' },
    });
    process.exitCode = await new Promise((resolve, reject) => {
      child.on('error', reject); child.on('exit', code => resolve(code ?? 1));
    });
  } catch (error) {
    console.error('Ejecución detenida:', error.code ?? error.message); process.exitCode = 1;
  } finally {
    if (creado && /^qa_iso_\d+$/.test(esquema)) await client.query(`DROP SCHEMA ${esquema} CASCADE`);
    await client.end();
  }
})();
