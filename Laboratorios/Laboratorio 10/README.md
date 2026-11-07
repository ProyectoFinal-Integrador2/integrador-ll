# Laboratorio 10 — Calidad funcional y validación automatizada

Este informe adapta las sesiones 19 y 20 de la guía al **Sistema de Gestión de Incidencias con SLA — Quimesa**. Se evalúan la completitud, corrección e idoneidad funcional del acceso, registro de incidencias y cálculo SLA, utilizando las pruebas existentes en **Vitest y Playwright**.

El flujo de reserva de Clínica Vida se sustituye por el registro y consulta de tickets. JUnit y las capas Java se corresponden aquí con pruebas de servicios TypeScript y recorridos React → Express → PostgreSQL. Los resultados son históricos, tomados del [Avance 3](../../AVANCE3.MD), no una nueva ejecución.

> Referencias: [Laboratorio 9](../Laboratorio%209/README.md) · [Plan de pruebas](../../PLAN-PRUEBAS-ISO-25010.md) · [Requerimientos](../../REQUERIMIENTOS.md).

---

## 1. Alcance de la adecuación funcional

| Dimensión de la guía | Pregunta aplicada al proyecto | Evaluación disponible |
|---|---|---|
| Completitud | ¿El flujo permite registrar la incidencia con los datos admitidos? | Parcial: falla el equipo opcional |
| Corrección | ¿El bloqueo y el SLA producen los valores esperados? | 11 casos unitarios aprobados |
| Idoneidad | ¿El usuario puede registrar y volver a consultar su incidencia? | Recorrido con equipo completado en tres motores |

El alcance probado no representa todos los módulos ni las 24 historias de usuario. Tampoco constituye certificación de ISO/IEC 25010. Se adopta la interpretación del modelo documentada en el informe del proyecto.

## 2. Matriz de trazabilidad funcional

| ID / HU | Criterio observable | Prueba y oráculo | Evidencia / estado |
|---|---|---|---|
| P1 / HU01 | Bloquear un correo tras tres fallos durante 15 minutos, sin afectar otros correos | Reloj controlado, credenciales simuladas y estados esperados explícitos | [login-lockout.test.ts](../../proyecto-integrador-back/tests/login-lockout.test.ts): 4/4 |
| P2 / HU20 | Calcular cumplimiento de respuesta y resolución, incluidos límites y datos incompletos | Tiempos conocidos: 30 min de respuesta y 120 de resolución | [sla.vitest.ts](../../proyecto-integrador-back/tests/sla.vitest.ts): 7/7 |
| P3 / HU06–HU07 | Rechazar descripción inválida y crear ticket válido, con o sin equipo | Error de validación; HTTP 201 para datos válidos | [calidad.spec.ts](../../tests/e2e/calidad.spec.ts): falla sin equipo en tres motores |
| P4 / HU06–HU07 | Recuperar el ticket tras recargar y comprobarlo en PostgreSQL | Coincidencia entre UI, respuesta de API y consulta SQL | Mismo archivo E2E: 3/3 aprobados |

Los oráculos son resultados esperados definidos antes de comparar la ejecución: un HTTP 500 no se acepta como respuesta válida para un ticket cuyo equipo es opcional.

## 3. Pruebas de backend y aislamiento

### 3.1 Bloqueo de autenticación

Se prueba independencia entre correos, vencimiento exacto a los 15 minutos, reinicio del contador después de un acceso correcto y aplicación de mensajes genéricos a correos inexistentes. La prueba usa repositorios simulados y reloj controlado; no demuestra concurrencia real en PostgreSQL.

### 3.2 Cálculo SLA

Los siete casos verifican cumplimiento, límite exacto, exceso de respuesta, exceso de resolución, exceso de ambos, ausencia de tickets evaluables y conjunto mixto. En el caso mixto, uno de dos tickets evaluables cumple y el resultado es 50 %; los registros sin datos suficientes se contabilizan aparte.

La [configuración Vitest](../../vitest.config.mts) reúne ambas pruebas. No hay evidencia de porcentaje de cobertura ni de puntuación de mutación; 11/11 casos aprobados no significa cobertura total.

## 4. Validación del flujo real y contrato HTTP

El [ejecutor E2E](../../tests/run-e2e.cjs) prepara un esquema PostgreSQL temporal, datos sintéticos y procesos de pruebas en los puertos 3100 y 5174. El esquema se elimina al finalizar. Esta es la adaptación existente al aislamiento de datos de la guía; no se utiliza Testcontainers.

El recorrido funcional abre «Nuevo ticket», comprueba datos incompletos, intenta guardar sin equipo y repite con equipo seleccionado. Las pruebas conservan el fallo del campo opcional y continúan con el recorrido válido para reunir evidencia adicional.

La API tiene contratos expresados mediante tipos y rutas TypeScript. **No se encontró un contrato OpenAPI ni una ejecución Schemathesis** que permita acreditar validación automática del esquema HTTP. Las aserciones puntuales de Playwright no sustituyen esa cobertura.

## 5. Reproducción y gate funcional

Desde la raíz, con Node compatible, dependencias instaladas, navegadores de Playwright disponibles y `DATABASE_URL` configurada para un entorno de pruebas:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run test:unit
npm.cmd run test:e2e
npm.cmd run test:report
```

`test:e2e` también contiene bloques de compatibilidad e interacción; deben interpretarse por separado al evaluar la funcionalidad de esta semana. No existe un gate específico de semana 10 ni un workflow CI que consolide estas comprobaciones.

| Resultado registrado | Lectura correcta |
|---|---|
| Unitarias: 11/11 | Reglas seleccionadas aprobadas |
| P3: falla en Chromium, Firefox y WebKit | El gate funcional sigue fallido |
| P4: aprueba en los tres motores | Persistencia válida en el recorrido con equipo |
| Mutación y contrato automatizado | Pendientes; no se asigna puntuación |

Fuente: [resumen](../../docs/calidad/evidencias/00-reportes-generales/resumen.json) y [reporte unitario](../../docs/calidad/evidencias/01-02-pruebas-unitarias/unitarias.json).

## 6. Verificación, validación e IA supervisada

La verificación compara reglas concretas: HTTP esperado, duración del bloqueo y porcentaje SLA. La validación comprueba si el recorrido permite resolver la necesidad de registrar y consultar una incidencia; su evidencia disponible es automatizada y debe complementarse con usuarios.

La guía propone IA para ampliar escenarios. En este proyecto se documenta exploración asistida, pero no una bitácora completa de aceptación y rechazo de propuestas para cada prueba. Como siguiente actividad, se pueden revisar propuestas de fechas incoherentes, límites temporales y campos opcionales, fijar el oráculo humano y ejecutar las pruebas antes de incorporarlas al gate.

## 7. Conclusión y criterios de cierre

La adecuación funcional queda **parcialmente acreditada**. Para cerrar el laboratorio deben corregirse y repetirse los casos de ticket sin equipo, ampliar la trazabilidad al alcance acordado y completar las comprobaciones de contrato, mutación y automatización requeridas por la guía. No se modifica el resultado esperado para ocultar el defecto.
