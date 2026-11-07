# Propuesta de pruebas con ISO/IEC 25010 — Help Desk TI

**Proyecto:** Sistema de Gestión de Incidencias con SLA para Quimesa.  
**Fecha de revisión:** 5 de noviembre de 2026.  
**Estado:** diagnóstico del repositorio y plan propuesto; pruebas todavía no implementadas ni ejecutadas para este informe.  
**Costo previsto:** S/ 0 en licencias y servicios, ejecutando las herramientas en equipos disponibles y PostgreSQL local.

## 1. Qué se puede hacer en este proyecto

Sí se puede aplicar ISO/IEC 25010 mediante una matriz que conecte cada característica con requisitos, casos de prueba, métricas y evidencias. Para la entrega solicitada propongo evaluar:

| Lo solicitado | Característica de referencia | Aplicación al proyecto |
|---|---|---|
| Funcionalidad | Adecuación funcional | Comprobar login, usuarios, tickets, reglas de estados, SLA y reportes contra resultados esperados. |
| Compatibilidad | Compatibilidad | Verificar intercambio de datos entre React, Express y PostgreSQL, y coexistencia en un entorno definido. Complementar con pruebas entre navegadores. |
| Interacción | Capacidad de interacción, edición 2023 | Evaluar si cada rol comprende y completa sus tareas; revisar formularios, errores, teclado, foco y accesibilidad. |

**Edición:** usar como referencia ISO/IEC 25010:2023. Si el curso exige la edición 2011, registrar esa edición y presentar el bloque de interacción bajo usabilidad, ajustando sus subcaracterísticas. No mezclar ambas taxonomías en la misma matriz. La ficha oficial de [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) presenta un modelo de nueve características; la [edición 2011](https://www.iso.org/obp/ui/?_escaped_fragment_=iso%3Astd%3Aiso-iec%3A25010%3Aed-1%3Av1%3Aen) incluye usabilidad.

ISO proporciona el modelo de calidad; no obliga a utilizar una herramienta específica ni establece los porcentajes de aprobación propuestos aquí. Esta evaluación académica de tres características no equivale a una certificación integral del producto.

**Sobre lo gratuito:** las pruebas de esta propuesta no requieren comprar software. El texto completo oficial de la norma sí se comercializa; la ficha pública permite consultar su alcance. Si se necesita el texto completo, consultar el acceso institucional de la universidad.

## 2. Qué encontré en el repositorio

Se revisaron los manifiestos de dependencias, la arquitectura documentada, rutas, autenticación, servicios de tickets y reportes, cliente HTTP, login, modal compartido y configuración de desarrollo. Es una revisión estática orientada a diseñar pruebas, no una auditoría exhaustiva ni una comprobación de funcionamiento en ejecución.

| Evidencia | Situación observada | Consecuencia para las pruebas |
|---|---|---|
| `package.json` y manifiestos de ambos paquetes | Monorepo npm; Node.js >= 24; React 19, Vite 8, TypeScript, Express 5 y cliente `pg`. | Diseñar pruebas para este stack. |
| `proyecto-integrador-back/src/services/auth.service.ts` | Login propio con verificación de contraseña, cuenta activa, rol y JWT de 8 horas. | Probar autenticación real de Express; no asumir Supabase Auth. |
| `proyecto-integrador-front/src/services/authApi.ts` | Envía correo, contraseña y rol a `/auth/login`; consulta `/auth/me`. | Verificar contrato de entrada y respuesta con el backend. |
| `proyecto-integrador-front/src/services/apiClient.ts` | Prefijo `/api/v1`, token Bearer, lectura de errores y limpieza del token ante 401 fuera del login. | Probar respuestas válidas, errores JSON/no JSON y sesión inválida. |
| `proyecto-integrador-back/src/services/ticket.service.ts` | Descripción mínima de 10 caracteres, prioridad válida y transiciones de estado controladas. Solo un técnico puede iniciar soporte. | Incluir límites de 9/10 caracteres y transiciones permitidas/prohibidas. |
| `proyecto-integrador-back/src/services/report.service.ts` | SLA sobre tickets cerrados, con marcas de inicio/cierre; separa registros sin SLA y sin datos. | Preparar datos controlados y calcular resultados esperados independientemente del código. |
| `proyecto-integrador-front/src/components/reportes/ReportActions.tsx` | Exportación CSV e impresión mediante `window.print()`. | Validar CSV e impresión/PDF; no afirmar que ya existe exportación XLSX nativa. |
| Manifiestos y archivos de pruebas buscados | No se identificó una suite propia configurada con Jest, Vitest o Playwright. El script `test` del backend es un marcador que termina en error. | Crear la infraestructura de pruebas antes de reportar cobertura. |
| Raíz del repositorio | No se encontró un directorio `.github/workflows`. | No dar por existente el pipeline descrito en `Avance.md`. |
| `Avance.md` frente al código | Menciona Next.js, Supabase Auth, Jest y cobertura >= 80 %, distintos de la implementación revisada. | Actualizar la documentación y sustentar con evidencias reales. |

### Brechas que conviene registrar desde el inicio

1. **HU01: bloqueo tras tres intentos por 15 minutos.** Está en `Avance.md`, pero no se identificó esa lógica en el servicio de autenticación ni temporizador en el login revisados. Mantener el caso en la matriz como requisito pendiente de verificación/implementación; no retirarlo para mejorar la tasa de aprobación.
2. **HU05: recuperación de contraseña.** La pantalla indica contactar al Jefe TI. La aceptación debe distinguir restablecimiento administrativo de recuperación autónoma por correo. Comprobar el flujo completo, incluida la obligación de cambiar la contraseña temporal.
3. **Modal compartido.** `BaseModal.tsx` incorpora `role="dialog"`, `aria-modal` y Escape; en ese componente no se observó gestión explícita de foco inicial, confinamiento/restauración de foco ni nombre accesible. Revisar el DOM final de cada modal antes de declarar un defecto.
4. **Selector de rol del login.** Los botones cambian de apariencia; revisar si la selección se comunica también a tecnologías de asistencia.
5. **Reglas SLA.** El código usa `iniciadoEn` y `cerradoEn`; `Avance.md` describe otras marcas temporales. Acordar y documentar la regla vigente antes de fijar el resultado esperado.

Estos puntos son observaciones estáticas o discrepancias documentales. Su severidad y reproducción deben confirmarse al ejecutar los casos.

## 3. Herramientas gratuitas recomendadas

| Herramienta | Para qué utilizarla aquí | Evidencia que produce | Costo y alcance |
|---|---|---|---|
| **Playwright Test** | Automatizar login, tickets, navegación, contratos HTTP y descargas en Chromium, Firefox y WebKit. | Reporte HTML, capturas, trazas y videos configurables. | Código abierto, Apache-2.0; ejecución local sin cuenta ni servicio de pago. |
| **axe-core + `@axe-core/playwright`** | Detectar problemas de accesibilidad en login, formularios, tablas y modales. | Violaciones con regla, impacto y elementos afectados. | Motor de código abierto; no requiere suscripción a la plataforma comercial de Deque. |
| **Vitest** | Probar reglas de negocio, cálculos SLA y cliente API; simular errores y dependencias. | Casos aprobados/fallidos y cobertura con proveedor compatible. | Código abierto, MIT; ejecución local. |
| **Supertest**, opcional | Probar la aplicación Express exportada desde `src/app.ts`, sin abrir un servidor externo. | Aserciones sobre estado HTTP, cabeceras y JSON dentro del reporte del runner. | Código abierto, MIT. Se puede omitir inicialmente si Playwright cubre la API por HTTP. |
| **Herramientas de desarrollo del navegador** | Inspección de red, tamaños de pantalla, consola y comportamiento de interfaz. | Capturas y registros de solicitudes/errores. | Incluidas en navegadores gratuitos. |
| **Prueba manual con usuarios + CSV/Markdown** | Observar comprensión, errores y éxito de tareas. | Fichas de observación, tiempos y comentarios. | Sin plataformas de pago; usar equipos y participantes disponibles. |
| **PostgreSQL local** | Datos aislados y repetibles para integración real. | Consultas de comprobación y conjunto de datos de prueba. | Software gratuito; no depende de una cuota de alojamiento. |

**Elección inicial:** Playwright + axe-core + pruebas manuales. Añadir Vitest para las reglas de tickets y reportes SLA. Supertest es complementario, no una instalación obligatoria.

Las capacidades y condiciones se pueden contrastar en los repositorios oficiales de [Playwright](https://github.com/microsoft/playwright), [Vitest](https://github.com/vitest-dev/vitest) y [Supertest](https://github.com/forwardemail/supertest), y en la página de [axe-core](https://www.deque.com/axe/axe-core/). Playwright documenta sus [motores soportados](https://playwright.dev/docs/browsers), [reportes](https://playwright.dev/docs/test-reporters) e [integración con axe](https://playwright.dev/docs/accessibility-testing).

No se necesitan BrowserStack, planes comerciales de Postman ni servicios de ejecución en la nube. Tampoco es necesario Docker: PostgreSQL puede instalarse directamente. Si se utiliza Docker Desktop, revisar sus condiciones para la organización; no basar el costo cero en asumir que cualquier uso empresarial es gratuito.

## 4. Pruebas de funcionalidad — adecuación funcional

Evaluar tres aspectos: **completitud** respecto a las HU acordadas; **corrección** de resultados; y **pertinencia** de las funciones para completar las tareas de cada rol.

### Casos prioritarios propuestos

| ID | HU / módulo | Caso | Resultado esperado que debe comprobarse | Técnica |
|---|---|---|---|---|
| FUN-01 | HU01 | Login con cuenta activa y rol correcto. | Se entrega sesión y se accede al panel del rol. | API + E2E |
| FUN-02 | HU01 | Contraseña incorrecta, cuenta inactiva y rol distinto, en casos separados. | Se rechaza cada acceso; no se crea sesión válida. | API + E2E |
| FUN-03 | HU01 | Tres intentos incorrectos y nuevo intento durante bloqueo. | Si se mantiene el requisito, bloqueo durante 15 minutos y temporizador coherente con el servidor. Brecha detectada en revisión. | API + E2E |
| FUN-04 | Sesión | Token ausente, inválido o expirado; recarga y cierre de sesión. | API rechaza acceso; la interfaz limpia sesión inválida y vuelve al login cuando corresponde. | API + E2E |
| FUN-05 | HU02–HU03 | Jefe TI registra y consulta usuario; correo duplicado y campos inválidos. | Persistencia correcta y rechazo de entradas inválidas/duplicadas sin crear registros extra. | API + BD + E2E |
| FUN-06 | HU04 | Actualizar perfil y volver a consultar. | Se guardan los campos permitidos y se muestran al recargar. | API + E2E |
| FUN-07 | HU05 | Restablecimiento administrativo y primer acceso con clave temporal. | Cumple el flujo de recuperación acordado y sus restricciones; contrastar la promesa de la interfaz con el comportamiento real. | API + E2E |
| FUN-08 | HU06 | Crear ticket válido; descripción de 9 y 10 caracteres. | Se rechazan 9 y se aceptan 10 si el resto es válido; el ticket queda persistido. | Vitest + API |
| FUN-09 | HU07–HU08 | Consultar ticket, iniciar soporte y cambiar estado. | Listado coherente, técnico asignado y transiciones según el catálogo vigente. | API + E2E |
| FUN-10 | HU08 / HU18 | Usuario intenta iniciar soporte, transición inválida y ticket finalizado. | Se rechazan acciones no permitidas y no se altera el registro. | Vitest + API |
| FUN-11 | HU09 / HU20 | SLA en el límite, por debajo y por encima de respuesta/resolución. | Cumple solo si ambos tiempos están dentro del límite; comparar con cálculo manual. | Vitest + API |
| FUN-12 | HU20 | Tickets sin SLA, sin marcas temporales y conjunto sin evaluables. | Categorías y denominador correctos; sin división por cero ni porcentajes ficticios. | Vitest + API |
| FUN-13 | HU10–HU16 | Crear/consultar artículo, registrar/editar equipo y asignar/consultar disponibilidad. | Datos persistidos, filtros correctos y permisos acordes al rol. Desglosar por HU al implementar. | API + E2E |
| FUN-14 | HU17–HU19 | Registrar evaluación válida, duplicada y consultar por rol. | Aplicar las reglas acordadas para elegibilidad, puntuación, duplicados y visibilidad. | API + E2E |
| FUN-15 | HU21–HU24 | Carga de técnicos, fallas por equipo, satisfacción y artículos consultados. | Totales, promedios y rankings coinciden con un conjunto conocido. | Vitest + API |
| FUN-16 | Reportes | Descargar CSV e imprimir. | CSV contiene los datos esperados y caracteres legibles; vista de impresión conserva información relevante. | Playwright + manual |
| FUN-17 | Permisos | Acceder por URL y por API a funciones de otro rol. | Acceso denegado por el servidor y navegación coherente en la interfaz. | API + E2E |

Los casos de permisos y sesión también aportan evidencia de seguridad, pero aquí se usan para verificar requisitos funcionales. No constituyen una evaluación completa de seguridad.

**Ejemplo independiente de SLA:** fijar respuesta máxima de 30 minutos y resolución de 120. Un ticket creado a las 08:00, iniciado a las 08:20 y cerrado a las 09:40 cumple ambos límites. Si se inicia a las 08:31, incumple aunque cierre a las 09:40. Usar timestamps con zona horaria explícita. Con dos tickets evaluables y uno que cumple, el esperado es 50 %. Añadir un tercero sin SLA no debe aumentar el denominador de evaluables.

## 5. Pruebas de compatibilidad

La compatibilidad en ISO 25010 contempla **interoperabilidad** y **coexistencia**. Probar únicamente Chrome y Firefox no cubre toda esta característica. La adaptación a pantallas y entornos también se relaciona con flexibilidad en 2023; se incluye como comprobación complementaria, sin confundirla con interoperabilidad.

| ID | Aspecto | Prueba aplicada | Evidencia / aceptación propuesta |
|---|---|---|---|
| COM-01 | Interoperabilidad frontend–API | Login, `/auth/me`, lectura y creación de ticket a través del proxy `/api`. | Contratos JSON, tipos de datos, cabeceras y códigos esperados; UI interpreta las respuestas. |
| COM-02 | Interoperabilidad API–PostgreSQL | Crear, consultar y actualizar datos en BD de pruebas real. | Persistencia coherente y manejo definido de restricciones; no basta simular el repositorio. |
| COM-03 | Intercambio de archivos | Descargar CSV con tildes, comas, comillas y saltos de línea. | Columnas e información conservadas al abrirlo en una herramienta disponible; registrar cuál y su versión. |
| COM-04 | Coexistencia, alcance local | Ejecutar el sistema junto a otra aplicación web local disponible durante 15 minutos, con puertos distintos y usuarios en ambas. | Ambas completan tareas; sin interferencia en sesión/datos ni conflictos de recursos observables. Registrar equipo, aplicaciones y condiciones. Es evidencia limitada a ese entorno. |
| COM-05 | Navegadores, complementario | Repetir login, crear/consultar ticket y abrir reporte en Chromium, Firefox y WebKit. | Mismos resultados de negocio; sin errores que bloqueen el flujo. |
| COM-06 | Navegadores instalados, complementario | Repetir una prueba breve en Chrome y Edge instalados, si están disponibles. | Registrar versión exacta y resultado; no asumir equivalencia total con Chromium. |
| COM-07 | Presentación adaptable, complementario | Revisar 360×800, 768×1024 y 1366×768; zoom al 200 %. | Controles accesibles, contenido legible y sin superposiciones que impidan tareas; tablas anchas con desplazamiento utilizable. |

**Matriz mínima propuesta:** tres motores × tres tamaños = nueve combinaciones para login, tickets y reportes. Son 27 ejecuciones de flujo como mínimo, además de API, coexistencia y revisión manual. Registrar también sistema operativo y versión de cada motor.

WebKit automatizado no equivale a Safari real en un iPhone. La emulación de tamaño/táctil tampoco acredita funcionamiento en un dispositivo físico. Si ya hay un teléfono disponible, añadir una verificación manual real y documentar sus límites; no se necesita comprar equipos.

## 6. Pruebas de interacción

Evaluar aprendizaje, operación, prevención de errores, claridad de la información y acceso a las tareas. La accesibilidad automática aporta una parte de la evidencia; no mide por sí sola comprensión ni facilidad de uso.

| ID | Prueba | Aplicación concreta | Evidencia |
|---|---|---|---|
| INT-01 | Uso con teclado | Login y creación de ticket usando Tab, Shift+Tab, Enter y Escape. | Secuencia registrada; foco visible y acceso a controles necesarios. |
| INT-02 | Formularios y errores | Campos vacíos, correo inválido, ticket corto y error del servidor. | Mensaje comprensible, campo identificable y datos válidos conservados. |
| INT-03 | Modales | Abrir, recorrer, cancelar y cerrar registro de usuario o ticket. | Nombre accesible, foco inicial, recorrido dentro del modal y retorno al control de apertura. |
| INT-04 | Escaneo axe | Login, panel por rol, formulario de ticket y modal abierto. | Reporte de reglas y elementos afectados, incluyendo resultados que requieren revisión manual. |
| INT-05 | Estado y feedback | Envío pendiente, éxito, fallo de red y ausencia de resultados. | Usuario comprende qué sucede; no se duplica el envío y puede continuar o reintentar. |
| INT-06 | Comprensión por rol | Usuario registra incidencia; técnico inicia soporte; Jefe TI consulta SLA. | Observación de tareas, éxito, tiempo, errores y comentarios. |
| INT-07 | Selección de rol | Cambiar rol en login mediante teclado y revisar su anuncio accesible. | La selección no depende únicamente del color. |
| INT-08 | Lectura asistida, manual | Revisar etiquetas, alertas y modal con lector de pantalla disponible. | Registro de anuncios y obstáculos; no inferir el resultado solo desde el HTML. |

### Sesión manual propuesta

Convocar cinco participantes disponibles, procurando representar los tres roles. Es una muestra exploratoria de conveniencia; no permite generalizar estadísticamente a toda Quimesa.

1. Preparar cuentas y datos ficticios, dar un objetivo sin dictar dónde hacer clic.
2. Pedir iniciar sesión y completar una tarea del rol: registrar ticket, iniciar soporte o consultar SLA.
3. Registrar éxito sin ayuda, tiempo, errores y necesidad de asistencia.
4. Preguntar qué fue confuso y solicitar una valoración de facilidad de 1 a 5. Es una pregunta propia, no un cuestionario validado.
5. Consolidar problemas y repetir los casos afectados después de corregirlos.

## 7. Métricas y criterios de aprobación propuestos

**Son metas del proyecto para acordar antes de ejecutar; no valores exigidos por ISO.**

| Dimensión | Métrica | Meta inicial |
|---|---|---|
| Completitud | Requisitos/HU del alcance con todos sus criterios verificados y aprobados / total del alcance × 100. | 100 % de requisitos críticos; reportar el total general y las brechas. |
| Corrección funcional | Casos funcionales aprobados / casos funcionales ejecutados × 100. | 100 % de casos críticos; >= 95 % general y cero defectos bloqueantes abiertos. |
| Ejecución | Casos ejecutados / casos planificados × 100. | 100 % del alcance comprometido; informar bloqueados y no ejecutados. |
| Interoperabilidad | Casos COM-01–COM-03 aprobados / ejecutados × 100. | 100 % de contratos y persistencia críticos. |
| Coexistencia | Tareas completadas sin interferencia en el escenario COM-04. | Todas las tareas previstas; documentar incidencias y límites del entorno. |
| Navegadores | Ejecuciones de flujos aprobadas / ejecuciones planificadas × 100. | 100 % de flujos críticos en la matriz acordada. |
| Interacción | Tareas completadas sin ayuda / tareas intentadas × 100. | >= 80 % en la sesión exploratoria. |
| Teclado | Flujos críticos completables íntegramente con teclado. | 100 %, sin bloqueo de foco. |
| Accesibilidad automática | Hallazgos axe de impacto crítico/serio sin resolver en vistas evaluadas. | 0; revisar también los demás impactos. |
| Facilidad percibida | Media de valoraciones 1–5, mostrando además respuestas individuales. | >= 4/5 como señal exploratoria. |

Registrar siempre numeradores y denominadores. Un caso bloqueado o no ejecutado no es aprobado. Si el denominador es cero, informar «no evaluado». No juntar funcionalidad, compatibilidad y encuesta en un único porcentaje sin justificar el método.

La cobertura de código de Vitest es una métrica complementaria de pruebas: no equivale a completitud funcional ni a porcentaje de cumplimiento ISO. Una meta de 80 % puede acordarse para servicios críticos, pero no debe presentarse como obligación de la norma.

## 8. Cómo se podría implementar después

Este documento no instala paquetes ni modifica la aplicación. La implementación propuesta sería:

1. **Acordar alcance y requisitos:** resolver las diferencias sobre bloqueo, recuperación y SLA; identificar funciones pendientes sin excluirlas silenciosamente.
2. **Preparar entorno:** Node.js compatible con el repositorio, PostgreSQL local aislado y cuentas ficticias para Usuario, Técnico y Jefe TI. Usar una base específica de pruebas y restaurar sus datos entre ejecuciones; nunca limpiar la BD compartida de trabajo.
3. **Crear datos controlados:** usuarios activos/inactivos, tickets en distintos estados, prioridades SLA, equipos, artículos y evaluaciones. Los esperados se calculan fuera de las funciones que se prueban.
4. **Configurar Playwright:** servidor web, URL base, tres proyectos de navegador, autenticación por rol, capturas ante fallos y reporte HTML. El proxy de Vite apunta al backend en `localhost:3000`; registrar el puerto real del frontend al iniciar.
5. **Agregar axe:** examinar páginas completas y estados con modales abiertos; complementar con teclado y revisión manual.
6. **Agregar Vitest:** comenzar por límites de tickets y cálculos SLA. Aprovechar inyección de repositorios para pruebas unitarias; mantener pruebas de integración separadas con PostgreSQL real. Configurar entornos Node/DOM y alias según corresponda; verificar compatibilidad de versiones al instalar.
7. **Ejecutar y registrar:** distinguir pruebas simuladas de pruebas con API/BD reales; generar evidencias por caso y clasificar defectos.
8. **Corregir y repetir:** conservar el resultado inicial y el de verificación para mostrar la mejora.

Como controles previos ya disponibles se pueden ejecutar desde la raíz:

```powershell
npm run typecheck
npm run lint
npm run build
```

Estos comandos validan tipos, reglas estáticas y compilación. No sustituyen pruebas funcionales, de compatibilidad o interacción. No se ejecutaron como parte de esta revisión documental y no se afirma que actualmente pasen.

Comandos futuros como `test:e2e`, `test:unit` o `test:coverage` requerirán crear primero sus configuraciones y scripts; todavía no existen en el proyecto revisado. No es necesario configurar CI para realizar la primera evaluación gratuita en local.

## 9. Entregables para la sustentación

Estructura sugerida para una implementación posterior:

```text
docs/calidad/
  matriz-trazabilidad.md
  casos-prueba.md
  resultados.md
  defectos.md
  interaccion.csv
  evidencias/
tests/e2e/
playwright.config.ts
```

Las pruebas unitarias pueden vivir junto a cada servicio como `*.test.ts`. Los reportes y trazas pueden generarse fuera del control de versiones; adjuntar al informe únicamente las evidencias necesarias, sin tokens ni datos personales.

Cada registro de ejecución debe contener:

| Campo | Qué registrar |
|---|---|
| Identificación | ID del caso, HU, característica y criterio evaluado. |
| Entorno | Fecha, commit, SO, navegador/motor y versiones; datos y rol utilizados. |
| Procedimiento | Precondiciones, pasos y resultado esperado acordado. |
| Resultado | Comportamiento observado y estado: aprobado, fallido, bloqueado o no ejecutado. |
| Evidencia | Ruta a captura, reporte, traza, consulta o ficha manual. |
| Seguimiento | Defecto asociado, severidad, responsable y resultado de repetición. |

**Ejemplo de fila antes de ejecutar:**

| ID | HU | Característica | Esperado | Estado | Evidencia |
|---|---|---|---|---|---|
| FUN-08 | HU06 | Adecuación funcional / corrección | Descripción de 9 caracteres rechazada; 10 aceptada con restantes campos válidos. | No ejecutado | Pendiente |

Para sustentar: mostrar un flujo funcional, un caso negativo, la misma tarea en varios motores, una revisión de teclado/axe y la matriz con sus resultados reales. Presentar también brechas y correcciones, no solo capturas de éxitos.

## 10. Alcance recomendado para comenzar

Priorizar **HU01, HU06–HU08 y HU20**: autenticación, ciclo de tickets y reporte SLA. Este conjunto atraviesa UI, API, persistencia y reglas de negocio, y permite demostrar las tres dimensiones solicitadas. Después extender la matriz al resto de HU01–HU24.

La entrega inicial puede hacerse íntegramente en local con Playwright, axe-core, PostgreSQL y observación manual. Vitest aporta precisión adicional a las reglas de negocio. El resultado defendible será una evaluación trazable del alcance probado, con métricas y evidencias, sin afirmar cumplimiento de funciones que aún no se han comprobado.
