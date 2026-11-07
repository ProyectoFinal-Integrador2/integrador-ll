# Laboratorio 9 — Consolidación y demostración técnica de la versión 1

Este informe adapta la guía de la semana 9 al **Sistema de Gestión de Incidencias con SLA — Quimesa**. El objetivo es reunir evidencia de acceso a datos, seguridad, validación y preparación de entrega sobre la aplicación existente: **React + Vite + TypeScript**, **Express + TypeScript** y **PostgreSQL**, coordinados mediante npm workspaces.

La guía utiliza Clínica Vida, Angular y Spring Boot como caso de referencia. Aquí el recorrido crítico es **iniciar sesión → registrar una incidencia → consultar su persistencia → atenderla y evaluar su SLA**. Los resultados citados proceden de los reportes guardados en el repositorio; este README no acredita una nueva ejecución ni un despliegue productivo.

> Referencias: [Laboratorio 8](../Laboratorio%208/README.md) · [Requerimientos](../../REQUERIMIENTOS.md) · [Avance 3](../../AVANCE3.MD) · [Evidencias](../../docs/calidad/README.md).

---

## 1. Diagnóstico y línea base de la versión candidata

### 1.1 Alcance consolidado

| Área | Aplicación en Quimesa | Evidencia |
|---|---|---|
| Acceso a datos | Repositorios PostgreSQL, consultas parametrizadas y mapeo a tipos de dominio | [Repositorios](../../proyecto-integrador-back/src/repositories/) |
| Identidad y permisos | JWT, contraseñas BCrypt y autorización por rol | [Autenticación](../../proyecto-integrador-back/src/services/auth.service.ts), [middleware](../../proyecto-integrador-back/src/middlewares/auth.ts) |
| Protección del login | Tres intentos fallidos bloquean el correo durante 15 minutos | [Guía del bloqueo](../../GUIA-BLOQUEO-LOGIN.md) |
| Integración | React consume `/api/v1`; Express consulta PostgreSQL | [Cliente HTTP](../../proyecto-integrador-front/src/services/apiClient.ts) |
| Salud | `GET /api/v1/health` consulta `select 1`; devuelve 200 o 503 | [Ruta de salud](../../proyecto-integrador-back/src/routes/health.routes.ts) |

### 1.2 Identificación reproducible

La guía solicita vincular código, artefacto y despliegue. Para preparar una entrega se debe registrar el commit concreto, el estado del árbol de trabajo, la versión de Node y el lockfile utilizado:

```powershell
git rev-parse HEAD
git status --short
node --version
npm.cmd ci
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Estos comandos son un procedimiento de reproducción. No se asigna una etiqueta de versión ni se afirma que existe una imagen inmutable publicada: falta incorporar esa evidencia a la entrega.

## 2. Gate de calidad y defectos observables

| Comprobación | Resultado documentado | Decisión |
|---|---|---|
| Bloqueo por correo | 4/4 unitarias aprobadas | Aceptado en el alcance probado |
| Cálculo de cumplimiento SLA | 7/7 unitarias aprobadas | Aceptado en el alcance probado |
| Ticket con equipo | Creación y recuperación verificadas en tres motores | Demostrable |
| Ticket sin equipo opcional | HTTP 500 en lugar de 201 en tres motores | Falló; requiere corrección |
| Persistencia después de recargar | 3/3 recorridos aprobados | Aceptado para ese escenario |
| Accesibilidad del modal | Fallos de contraste, nombre accesible y gestión de foco | Falló |

Fuente: [resumen de ejecución](../../docs/calidad/evidencias/00-reportes-generales/resumen.json). El gate global **no está aprobado**: existen cuatro ejecuciones de navegador fallidas, cuatro aprobadas y cuatro combinaciones omitidas por diseño. Las omitidas no cuentan como aprobadas.

### 2.1 Defecto reproducible que impide cerrar la versión

En el registro sin equipo, la evidencia identifica que un valor `undefined` alcanza una conversión numérica y produce `NaN`, rechazado por PostgreSQL. El flujo esperado es guardar la ausencia de equipo como `NULL` y responder 201.

La corrección debe acompañarse de una regresión del caso sin equipo y del caso con equipo en Chromium, Firefox y WebKit. El presente laboratorio documenta el defecto y su criterio de cierre; no declara que ya fue corregido.

## 3. Persistencia, integridad y seguridad

La base se define en [integrador_BDD.sql](../../database/integrador_BDD.sql) y cuenta con [migraciones SQL](../../database/migraciones/). Esto adapta la intención de versionar cambios de datos de la guía, aunque el proyecto no utiliza Flyway.

El bloqueo de autenticación persiste sus intentos por correo mediante el [repositorio de intentos](../../proyecto-integrador-back/src/repositories/loginAttempts.repository.ts). Los JWT duran ocho horas y las rutas aplican autenticación y permisos según el rol. Estos controles no equivalen a una auditoría completa de seguridad ni a una prueba de todos los permisos.

La demostración de persistencia debe mostrar el dato registrado, su consulta después de recargar y su existencia en PostgreSQL. El endpoint de salud acredita conectividad con el motor; por sí solo no acredita persistencia de un ticket.

## 4. Empaquetado y preparación del despliegue

El [docker-compose.yml](../../docker-compose.yml) declara PostgreSQL 17, backend, frontend y un volumen `postgres_data`. También existe [configuración Nginx](../../proyecto-integrador-front/nginx.conf). Sin embargo, Compose referencia Dockerfiles que no están presentes en las carpetas de ambos paquetes; la configuración no constituye evidencia de un despliegue ejecutable completo.

| Exigencia de la guía | Situación del proyecto |
|---|---|
| Build de la aplicación | Scripts npm disponibles; resultados de una nueva entrega por registrar |
| Imágenes identificadas por commit | Pendiente de construcción y evidencia |
| Despliegue cloud y HTTPS | Sin evidencia de ejecución en esta entrega |
| Smoke sobre la versión desplegada | Endpoint de salud disponible; comprobación remota pendiente |
| Respaldo y restauración | Sin evidencia de una restauración ensayada |
| Reversión a versión anterior | Procedimiento y ensayo pendientes |

Para cerrar este bloque se requieren los Dockerfiles, imágenes identificadas, configuración de entorno, comprobaciones posteriores al despliegue y ensayo de restauración. Los secretos deben permanecer fuera de los reportes.

## 5. Demostración y cadena de evidencia

1. Identificar el commit y levantar el entorno de demostración.
2. Consultar `/api/v1/health` y mostrar el resultado.
3. Iniciar sesión y registrar una incidencia con equipo, aclarando el defecto pendiente del equipo opcional.
4. Recargar y consultar la incidencia; contrastarla con la evidencia de PostgreSQL.
5. Mostrar las pruebas de bloqueo y SLA, junto con los fallos abiertos.
6. Presentar los artefactos de despliegue únicamente cuando exista evidencia de su ejecución.

## 6. Decisión de entrega y retrospectiva técnica

El proyecto dispone de una base funcional y evidencias para una **demostración académica con limitaciones declaradas**. No se acredita una versión productiva aprobada: continúan abiertos el registro sin equipo, la accesibilidad y la validación del despliegue.

La retrospectiva se concentra en una lección verificable: un campo opcional debe conservar su significado entre UI, API y base de datos. El cierre requiere corregir la conversión, conservar la prueba que detectó el problema y repetir el gate sin relajar su resultado esperado.
