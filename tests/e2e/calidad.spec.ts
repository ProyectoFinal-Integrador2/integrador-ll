import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { Client } from 'pg';
import { mkdirSync, writeFileSync } from 'node:fs';

const carpeta = 'docs/calidad/evidencias';
const grupos: Record<string, string> = {
  P3: '03-funcionalidad-tickets', P4: '04-compatibilidad',
  P5: '05-interaccion-accesibilidad', P6: '06-exploratoria',
};
function rutaEvidencia(nombre: string): string {
  const directorio = carpeta + '/' + grupos[nombre.slice(0, 2)];
  mkdirSync(directorio, { recursive: true });
  return directorio + '/' + nombre;
}
async function entrar(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Correo electrónico').fill('qa.iso@example.test');
  await page.getByLabel('Contraseña', { exact: true }).fill('PruebaISO123!');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:5174/');
  await page.goto('/tickets');
  await expect(page.getByRole('button', { name: 'Nuevo ticket' })).toBeVisible();
}
async function foto(page: Page, nombre: string) {
  await page.screenshot({ path: rutaEvidencia(`${nombre}.png`), fullPage: true });
}

test('P3 funcional: datos incompletos y registro válido de ticket', async ({ page }, info) => {
  await entrar(page);
  await page.getByRole('button', { name: 'Nuevo ticket' }).click();
  const modal = page.getByRole('dialog');
  await modal.getByRole('button', { name: 'Registrar ticket', exact: true }).click();
  await expect(modal.getByRole('alert')).toContainText('10 caracteres');
  await foto(page, `P3-invalido-${info.project.name}`);
  const descripcion = `QA funcional ${info.project.name} ${Date.now()}`;
  await modal.getByLabel('Descripcion').fill(descripcion);
  await modal.getByLabel('Usuario', { exact: false }).fill('QA ISO');
  const respuesta = page.waitForResponse(r => r.url().endsWith('/api/v1/tickets') && r.request().method() === 'POST');
  await modal.getByRole('button', { name: 'Registrar ticket', exact: true }).click();
  const sinEquipo = await respuesta;
  const estadoSinEquipo = sinEquipo.status();
  writeFileSync(rutaEvidencia(`P3-sin-equipo-${info.project.name}.json`), JSON.stringify({
    esperado: 201, obtenido: estadoSinEquipo, respuesta: await sinEquipo.json(),
  }, null, 2));
  expect.soft(estadoSinEquipo, 'Equipo opcional: registrar sin equipo debe funcionar').toBe(201);
  if (estadoSinEquipo !== 201) {
    await foto(page, `P3-error-sin-equipo-${info.project.name}`);
    await modal.getByLabel('Equipo asignado').selectOption('1');
    const conEquipo = page.waitForResponse(r => r.url().endsWith('/api/v1/tickets') && r.request().method() === 'POST');
    await modal.getByRole('button', { name: 'Registrar ticket', exact: true }).click();
    expect((await conEquipo).status()).toBe(201);
  }
  await expect(modal).toBeHidden();
  await page.getByRole('searchbox', { name: 'Buscar tickets' }).fill(descripcion);
  await expect(page.getByText(descripcion, { exact: true })).toBeVisible();
  await foto(page, `P3-valido-${info.project.name}`);
});

test('P4 compatibilidad: pantalla API PostgreSQL y recarga', async ({ page }, info) => {
  await entrar(page);
  const descripcion = `QA interoperabilidad ${info.project.name} ${Date.now()}`;
  await page.getByRole('button', { name: 'Nuevo ticket' }).click();
  await page.getByLabel('Descripcion').fill(descripcion);
  await page.getByRole('dialog').getByLabel('Usuario', { exact: false }).fill('QA ISO');
  await page.getByLabel('Equipo asignado').selectOption('1');
  const respuesta = page.waitForResponse(r => r.url().endsWith('/api/v1/tickets') && r.request().method() === 'POST');
  await page.getByRole('dialog').getByRole('button', { name: 'Registrar ticket', exact: true }).click();
  const res = await respuesta;
  expect(res.status()).toBe(201);
  const ticket = await res.json();
  const url = process.env.DATABASE_URL!;
  const db = new Client({ connectionString: url, ssl: url.includes('sslmode=require') ? { rejectUnauthorized: false } : false });
  try {
    await db.connect();
    const { rows } = await db.query('SELECT descripcion, estado FROM tickets WHERE id = $1', [ticket.id]);
    expect(rows).toEqual([{ descripcion, estado: 'Abierto' }]);
  } finally { await db.end(); }
  await page.reload();
  await page.getByRole('searchbox', { name: 'Buscar tickets' }).fill(descripcion);
  await expect(page.getByText(descripcion, { exact: true })).toBeVisible();
  await foto(page, `P4-persistencia-${info.project.name}`);
  await info.attach('Motor', { body: `${info.project.name}: ${page.context().browser()?.version()}`, contentType: 'text/plain' });
});

test('P5 interacción: axe y recorrido de teclado', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'Accesibilidad evaluada en Chromium; P3/P4 cubren los tres motores.');
  await page.goto('/login');
  const login = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  await page.getByLabel('Correo electrónico').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Contraseña', { exact: true })).toBeFocused();
  await entrar(page);
  const apertura = page.getByRole('button', { name: 'Nuevo ticket' });
  await apertura.focus();
  await page.keyboard.press('Enter');
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.locator(':scope > div').last()).toHaveCSS('opacity', '1');
  const formulario = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const focoInicialDentro = await modal.evaluate(el => el.contains(document.activeElement));
  await page.getByRole('button', { name: 'Cerrar modal' }).focus();
  await page.keyboard.press('Shift+Tab');
  const focoConfinado = await modal.evaluate(el => el.contains(document.activeElement));
  const nombreModal = await modal.evaluate(el => el.getAttribute('aria-label') ?? el.getAttribute('aria-labelledby'));
  await foto(page, 'P5-modal');
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  const focoRestaurado = await apertura.evaluate(el => el === document.activeElement);
  const resumen = { login: login.violations, modal: formulario.violations, focoInicialDentro, focoConfinado, focoRestaurado, nombreModal };
  writeFileSync(rutaEvidencia('P5-accesibilidad.json'), JSON.stringify(resumen, null, 2));
  await info.attach('Accesibilidad', { body: JSON.stringify(resumen, null, 2), contentType: 'application/json' });
  const graves = [...login.violations, ...formulario.violations].filter(v => ['serious', 'critical'].includes(v.impact ?? ''));
  expect.soft(graves, 'Sin violaciones serias o críticas').toHaveLength(0);
  expect.soft(focoInicialDentro, 'Foco inicial dentro del modal').toBe(true);
  expect.soft(focoConfinado, 'Tab no sale del modal').toBe(true);
  expect.soft(focoRestaurado, 'Foco regresa a Nuevo ticket').toBe(true);
  expect.soft(nombreModal, 'El diálogo debe tener nombre accesible').toBeTruthy();
});

test('P6 exploración guiada: cambiar correo, recargar, cancelar y pantalla pequeña', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'Sesión exploratoria asistida en Chromium.');
  const inicio = new Date().toISOString();
  const observaciones: { accion: string; observado: string }[] = [];
  await page.goto('/login');
  const correoA = `explora.a.${Date.now()}@example.test`;
  const correoB = `explora.b.${Date.now()}@example.test`;
  await page.getByLabel('Correo electrónico').fill(correoA);
  await page.getByLabel('Contraseña', { exact: true }).fill('Incorrecta123!');
  for (let n = 1; n <= 3; n++) {
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText(n < 3 ? `Te quedan ${3 - n}` : 'bloqueado');
  }
  observaciones.push({ accion: 'Tres fallos en correo A', observado: await page.getByRole('alert').innerText() });
  await foto(page, 'P6-correo-A-bloqueado');
  await page.getByLabel('Correo electrónico').fill(correoB);
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Te quedan 2');
  observaciones.push({ accion: 'Cambiar a B y fallar', observado: await page.getByRole('alert').innerText() });
  await page.reload();
  observaciones.push({ accion: 'Recargar antes de volver a A', observado: `Alertas visibles antes de reenviar: ${await page.getByRole('alert').count()}` });
  await page.getByLabel('Correo electrónico').fill(correoA);
  await page.getByLabel('Contraseña', { exact: true }).fill('Incorrecta123!');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('bloqueado');
  observaciones.push({ accion: 'Reintentar A tras recargar', observado: await page.getByRole('alert').innerText() });
  await entrar(page);
  await page.getByRole('button', { name: 'Nuevo ticket' }).click();
  await page.getByLabel('Descripcion').fill('Borrador exploratorio, no guardar');
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Nuevo ticket' }).click();
  observaciones.push({ accion: 'Cancelar borrador y reabrir', observado: `Descripción al reabrir: ${JSON.stringify(await page.getByLabel('Descripcion').inputValue())}` });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('searchbox', { name: 'Buscar tickets' }).fill('sin-coincidencias-qa-93821');
  observaciones.push({ accion: 'Buscar texto inexistente', observado: (await page.locator('main').innerText()).slice(-600) });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.locator('aside').evaluate(async el => {
    await Promise.all(el.getAnimations().map(a => a.finished.catch(() => {})));
  });
  const dimensiones = await page.evaluate(() => ({ visible: innerWidth, contenido: document.documentElement.scrollWidth }));
  observaciones.push({ accion: 'Reducir pantalla a 360×800', observado: JSON.stringify(dimensiones) });
  await foto(page, 'P6-movil');
  writeFileSync(rutaEvidencia('P6-bitacora.json'), JSON.stringify({ inicio, fin: new Date().toISOString(),
    ejecutor: 'Agente mediante Playwright; exploración guiada sin participantes humanos', observaciones }, null, 2));
});
