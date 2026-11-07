# Laboratorio 12 — Calidad de la capacidad de interacción

Este informe adapta las sesiones 23 y 24 de la guía al **Sistema de Gestión de Incidencias con SLA — Quimesa**. El escenario crítico es comprender el formulario «Nuevo ticket», registrar una incidencia, reconocer el resultado y recuperarse de errores, sobre el frontend React conectado a la API Express.

La reserva de citas de Clínica Vida se sustituye por el registro de tickets. Se conservan los ejes de la guía: **facilidad de aprendizaje, protección contra errores, asistencia y compromiso del usuario**. Se documenta la implementación y la evaluación existentes; las mejoras pendientes no se presentan como realizadas.

> Referencias: [Laboratorio 11](../Laboratorio%2011/README.md) · [Avance 3](../../AVANCE3.MD) · [Evidencias de interacción](../../docs/calidad/evidencias/05-interaccion-accesibilidad/) · [Exploración](../../docs/calidad/evidencias/06-exploratoria/).

---

## 1. Escenario y matriz de criterios de interacción

**Tarea:** iniciar sesión, abrir Tickets, registrar una incidencia con descripción suficiente y volver a consultarla. El alcance automatizado de registro y persistencia utiliza una cuenta sintética de Jefe TI; no acredita todos los perfiles.

| ID | Eje de la guía | Criterio aplicado a Quimesa | Evidencia / situación |
|---|---|---|---|
| I-01 | Aprendizaje | Identificar dónde registrar un ticket y comprender sus campos | Formulario existente; comprensión humana pendiente |
| I-02 | Prevención | Rechazar descripción con menos de 10 caracteres y explicar el error | P3 comprueba datos incompletos |
| I-03 | Recuperación | Poder registrar sin equipo cuando se indica como opcional | P3 falla: HTTP 500 |
| I-04 | Asistencia | Informar carga, error y resultado del registro | Estados en página y modal; requiere revisión de claridad con usuarios |
| I-05 | Accesibilidad | Diálogo con nombre accesible y foco inicial, confinado y restaurado | P5 falla en los cuatro aspectos |
| I-06 | Percepción | Sin hallazgos axe serios o críticos en las vistas evaluadas | P5 falla por contraste |
| I-07 | Continuidad | Comprender el bloqueo del correo después de recargar | P6 observa pérdida del aviso visible |
| I-08 | Pantalla pequeña | Acciones y contenido utilizables sin recortes | P6 registra recorte visual |

Son criterios locales trazables a login y HU06–HU07. No representan cumplimiento completo de ISO/IEC 25010 ni de WCAG. El análisis automático debe complementarse con revisión manual y usuarios.

## 2. Facilidad de aprendizaje y asistencia

El acceso al registro, la lista y la consulta se implementa en [TicketsPage.tsx](../../proyecto-integrador-front/src/pages/TicketsPage.tsx) y [CreateTicketModal.tsx](../../proyecto-integrador-front/src/components/tickets/CreateTicketModal.tsx). La interfaz separa campos del formulario y presenta estados asociados al envío.

Para adaptar el flujo guiado de la guía se deben revisar instrucciones breves, distinción entre campos obligatorios y opcionales, ejemplos de descripción y confirmación con identificación del ticket. No se ha realizado una microprueba que permita afirmar que las personas comprenden esas señales o que disminuyó su tiempo de aprendizaje.

La asistencia debe indicar qué ocurrió y cómo continuar. El error técnico de registro sin equipo impide completar una combinación válida del formulario; mejorar el mensaje sin corregir la persistencia no satisface el criterio I-03.

## 3. Protección y recuperación ante errores

### 3.1 Evidencia disponible

- La prueba P3 envía datos incompletos y comprueba la regla de descripción mínima.
- El recorrido con equipo permite completar el registro y consultar el ticket tras recargar.
- El caso sin equipo opcional devuelve 500, aunque el resultado esperado es 201.
- La exploración P6 documenta el cambio de correo y la recarga durante el bloqueo de autenticación.

### 3.2 Mejoras y comprobaciones pendientes

| Prioridad | Acción | Cierre verificable |
|---|---|---|
| Alta | Corregir el equipo opcional en el recorrido API/BD | Crear sin equipo devuelve 201 y persiste `NULL` |
| Alta | Garantizar operación del diálogo por teclado | Foco entra, permanece y vuelve al activador al cerrar |
| Alta | Resolver contraste y nombre accesible | Repetir axe y comprobación manual sin los fallos registrados |
| Media | Conservar o recuperar el estado visible de bloqueo | Recarga comunica el bloqueo vigente sin confundir al usuario |
| Media | Evitar doble envío durante una solicitud | Doble activación crea un único ticket; prueba específica pendiente |
| Media | Mantener datos corregibles tras un error | El usuario corrige y reintenta sin repetir toda la captura |
| Media | Corregir el recorte en pantalla pequeña | Revisión visual y de acciones en el tamaño documentado |

Estas acciones son criterios de mejora. No se atribuye al código una garantía de idempotencia ni de doble envío sin una prueba específica.

## 4. Pruebas automatizadas y revisión manual

La suite [calidad.spec.ts](../../tests/e2e/calidad.spec.ts) usa Playwright y `@axe-core/playwright`. P5 analiza login y la página con el modal abierto en Chromium, y comprueba foco inicial, recorrido con Tab, restauración al cierre y nombre accesible del diálogo.

| Bloque | Resultado guardado | Interpretación |
|---|---|---|
| P5: axe | Hallazgos de contraste | Criterio local incumplido |
| P5: diálogo | Fallan foco inicial, confinamiento, restauración y nombre | Requiere corrección |
| P5 en Firefox y WebKit | Omitido por diseño | Sin evidencia en esos motores |
| P6: exploración Chromium | Ejecución completada con observaciones | No equivale a ausencia de defectos |

Evidencias: [reporte de accesibilidad](../../docs/calidad/evidencias/05-interaccion-accesibilidad/P5-accesibilidad.json), [captura del modal](../../docs/calidad/evidencias/05-interaccion-accesibilidad/P5-modal.png), [bitácora exploratoria](../../docs/calidad/evidencias/06-exploratoria/P6-bitacora.json) y [observación visual](../../docs/calidad/evidencias/06-exploratoria/P6-observacion-visual.md).

Para reproducir la suite, preparar el entorno de pruebas indicado en el [Laboratorio 10](../Laboratorio%2010/README.md), ejecutar `npm.cmd run test:e2e` y consultar `npm.cmd run test:report`. Los resultados de este informe corresponden a la evidencia conservada, no a una nueva ejecución.

La revisión manual debe completar teclado, foco visible, lectura de etiquetas y errores, zoom y pantalla pequeña. Una revisión axe favorable por sí sola no demuestra accesibilidad completa.

## 5. Microprueba con usuarios y compromiso

La guía solicita una microprueba controlada. En el repositorio existe exploración asistida P6, pero **no resultados de participantes humanos**. No se asignan tasas de éxito, tiempos medios ni satisfacción a partir de un navegador automatizado.

Procedimiento propuesto para completar ese bloque:

1. Entregar la tarea de registrar y consultar una incidencia con datos sintéticos, sin indicar cada clic.
2. Registrar de forma anónima participante, éxito, tiempo, errores, ayuda solicitada y punto de abandono.
3. Preguntar qué entendió del resultado y qué le impidió continuar.
4. Priorizar hallazgos, aplicar mejoras y repetir la tarea para comparar resultados.

El compromiso se evaluará mediante continuidad de la tarea y claridad de la respuesta del sistema. No se deduce de una preferencia visual ni de la presencia de animaciones.

## 6. IA supervisada, entregables y decisión

La exploración asistida disponible apoya la detección de problemas y conserva una bitácora. No sustituye la microprueba humana ni la decisión del equipo. Cada recomendación debe contrastarse con el componente, el recorrido y una prueba reproducible.

| Entregable de la guía | Adaptación disponible |
|---|---|
| E1: matriz | Criterios I-01 a I-08 de este informe |
| E2: flujo mejorado | Flujo existente; correcciones pendientes |
| E3: pruebas de comportamiento | P3, P5 y P6, con límites declarados |
| E4: auditoría de accesibilidad | Reporte axe y comprobaciones de foco; fallidos |
| E5: microprueba | Pendiente con participantes humanos |
| E6: informe IA y gate | Exploración documentada; gate de interacción sin aprobar |

La capacidad de interacción queda **evaluada con hallazgos abiertos**. El cierre requiere corregir los defectos, repetir P3/P5/P6, realizar la microprueba y conservar resultados comparables. No se declara aprobado el gate mientras persistan los fallos de accesibilidad y registro.
