# Laboratorio 11 — Calidad de compatibilidad: interoperabilidad y coexistencia

Este informe adapta las sesiones 21 y 22 de la guía al **Sistema de Gestión de Incidencias con SLA — Quimesa**, construido con React, Express, TypeScript y PostgreSQL. Se distingue la integración interna ya evaluada de los contratos externos y la coexistencia que aún requieren evidencia.

En la guía, Clínica Vida incorpora un proveedor de notificaciones y dos instancias Docker. En Quimesa, el equivalente de dominio sería notificar el registro o cambio de estado de un ticket. **No existe evidencia de ese proveedor ni de su adaptador implementado**; se presenta como trabajo pendiente, sin atribuirle resultados.

> Referencias: [Laboratorio 10](../Laboratorio%2010/README.md) · [Avance 3](../../AVANCE3.MD) · [Evidencias de compatibilidad](../../docs/calidad/evidencias/04-compatibilidad/).

---

## 1. Alcance y línea base

| Concepto | Aplicación en Quimesa | Evidencia necesaria |
|---|---|---|
| Interoperabilidad interna | Intercambiar y utilizar datos entre React, API Express y PostgreSQL | Registro, consulta y comprobación SQL |
| Interoperabilidad externa | Comunicar eventos de tickets a un proveedor de notificaciones | Contrato, adaptador, respuestas y fallos controlados |
| Coexistencia | Ejecutar versión base y candidata compartiendo host sin interferirse | Puertos, datos, volúmenes, logs y pruebas concurrentes |
| Compatibilidad entre navegadores | Repetir el recorrido en Chromium, Firefox y WebKit | Resultados por motor; evidencia complementaria |

Las pruebas entre navegadores no acreditan por sí solas coexistencia ni integración con un proveedor externo. Además, el gate funcional previo mantiene abierto el defecto de registro sin equipo, lo que impide declarar superados todos los prerrequisitos de la guía.

## 2. Intercambio de información implementado

El flujo real es:

```text
Página de tickets → ticketsApi → apiClient → /api/v1/tickets
→ rutas → controlador → servicio → repositorio → PostgreSQL
```

El [cliente HTTP](../../proyecto-integrador-front/src/services/apiClient.ts) consume la API; el [repositorio de tickets](../../proyecto-integrador-back/src/repositories/ticket.repository.ts) gestiona la persistencia. El bloque P4 registra un ticket con equipo, comprueba su existencia mediante SQL y lo recupera tras recargar la página.

| Motor | Resultado histórico P4 | Alcance |
|---|---|---|
| Chromium | Aprobado | Registro con equipo y persistencia |
| Firefox | Aprobado | Mismo recorrido |
| WebKit | Aprobado | Mismo recorrido |

Evidencia: [resumen de ejecución](../../docs/calidad/evidencias/00-reportes-generales/resumen.json), [pruebas E2E](../../tests/e2e/calidad.spec.ts) y capturas de la carpeta de compatibilidad. No se presenta como una nueva ejecución ni como cobertura de todos los roles y módulos.

## 3. Contrato externo adaptado al dominio

Para cubrir la intención de la guía se propone un proveedor simulado de **notificaciones de incidencias**, manteniendo el registro del ticket independiente de la entrega de la notificación.

| Requisito propuesto | Criterio observable | Estado |
|---|---|---|
| INT-01: contrato | Especificar método, ruta, cabeceras, JSON y respuesta para el evento de ticket | Pendiente de OpenAPI/JSON Schema |
| INT-02: éxito | Aceptación del evento y uso correcto de la respuesta | Pendiente de adaptador y prueba |
| INT-03: idempotencia | Repetir el mismo evento no genera una segunda notificación | Pendiente de clave estable y prueba |
| INT-04: errores 400 y 409 | Distinguir entrada inválida de duplicado según contrato | Pendiente |
| INT-05: 5xx y timeout | Tiempo máximo y reintentos acotados, con resultado registrado | Pendiente |
| INT-06: conservación | Si falla la notificación, el ticket permanece registrado una sola vez | Pendiente de integración real |

La clave idempotente debería identificar el evento, por ejemplo ticket y transición, para permitir varias notificaciones legítimas del mismo ticket. Es una decisión propuesta, no un contrato vigente. La guía usa WireMock; aquí no hay un stub equivalente configurado ni pruebas de resiliencia que puedan darse por aprobadas.

## 4. Coexistencia de versiones

### 4.1 Configuración existente

El [Compose](../../docker-compose.yml) declara PostgreSQL, backend y frontend con nombres fijos `integrador_db`, `integrador_backend` e `integrador_frontend`, y puertos publicados 5432, 3000 y 80. Una segunda ejecución sin adaptar esos valores produciría conflictos. Además, faltan los Dockerfiles referenciados, por lo que el despliegue completo no está acreditado.

El entorno E2E usa otros puertos y un esquema temporal; demuestra una estrategia de aislamiento para pruebas, pero no reemplaza el ensayo de dos versiones Docker solicitado por la guía.

### 4.2 Matriz de coexistencia pendiente

| ID | Comprobación | Criterio de aceptación |
|---|---|---|
| COE-01 | Arranque simultáneo de base y candidata | Sin colisiones de nombres ni puertos |
| COE-02 | Salud independiente | Ambos endpoints de salud responden con su BD disponible |
| COE-03 | Aislamiento de datos | Un ticket creado en A no aparece en B |
| COE-04 | Volúmenes y logs separados | Datos y registros atribuibles a cada instancia |
| COE-05 | Operación concurrente | Ambas completan registro y consulta durante la misma ventana |
| COE-06 | Detención independiente | Detener B permite que A siga operativa |

Para ejecutarla se necesitan proyectos Compose separados, puertos diferenciados, eliminación o parametrización de nombres fijos, bases y volúmenes independientes e identificación del commit de cada versión. Esta tabla describe el ensayo pendiente; no contiene mediciones de degradación ni resultados inventados.

## 5. Regresión, gate y uso supervisado de IA

La regresión existente se reproduce con `npm.cmd run test:unit` y `npm.cmd run test:e2e`, después de preparar el entorno descrito en el [Laboratorio 10](../Laboratorio%2010/README.md). Un gate de compatibilidad completo deberá añadir pruebas de contrato externo y coexistencia, conservar sus reportes y fallar si alguna comprobación obligatoria falla o queda omitida.

No hay un workflow de compatibilidad ni un script específico de gate de semana 11. La IA puede proponer escenarios de duplicación, timeout o interferencia; el equipo debe definir el oráculo, revisar el código y contrastar la ejecución con datos sintéticos. No consta una bitácora de esa actividad específica para el proveedor propuesto.

## 6. Decisión de compatibilidad

Se acredita **integración interna para el recorrido P4 con equipo en tres motores**. La interoperabilidad externa, la idempotencia de notificaciones y la coexistencia de dos versiones quedan pendientes. El laboratorio no puede cerrarse como aprobado global hasta ejecutar y documentar esos bloques y resolver el bloqueo funcional previo.
