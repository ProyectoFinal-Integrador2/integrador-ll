
# Laboratorio 1 

Este informe primero organiza los temas centrales de la Semana 1 y luego revisa, **solo para esos temas**, qué evidencia existe dentro de SLAFINAL. No se agregan temas ajenos a la guía (modelado físico de base de datos, cobertura de código, pipelines, etc.), aunque SLAFINAL los desarrolle con detalle.

# Problema

La empresa Quimesa abarca la industria de insumos quimicos y de la fabricacion de productos, sin embargo sus procesos de gestion de incidencias son manuales y no existe un programa de automatizacion de ello. Esta necesidad nos lleva a crear un sistema de gestion de incidencias para facilitar y agilizar los procesos en la empresa.

### 2.1 Requerimientos por categoría

SLAFINAL no presenta un catálogo consolidado de requerimientos de negocio/stakeholder como pide la guía, pero sí documenta, **dispersos por historia**, los tres tipos más técnicos:

- **No funcionales:** por ejemplo, "RNF-01: Tiempo de respuesta ≤ 500 ms" en una de las historias de consulta.
- **Reglas de negocio:** documentadas de forma explícita en varias HU, como las del módulo de cumplimiento SLA (HU-020): *"Un ticket cumple SLA solo si satisface simultáneamente el tiempo de respuesta y el de resolución"*, o el control de unicidad de niveles de prioridad en HU-009.
- **Restricciones:** trasladadas directamente al modelo físico (restricciones `CHECK`, `NOT NULL`, `UNIQUE`) en la sección de base de datos de cada Sprint.

### 2.2 Historias de usuario — en formato de Caso de Uso, no de "Como/Quiero/Para"

Cada HU de SLAFINAL se especifica mediante una **ficha de Caso de Uso UML** (Actor, Descripción, Precondición, Postcondición, Flujo Normal, Flujo Alterno) en lugar de la redacción "Como [rol], quiero [capacidad] para [beneficio]" y la técnica de las 3 C's que propone la guía. Cumple el mismo propósito de la guía —expresar comportamiento esperado y excepciones— pero con otra notación:

- **Ejemplo (HU-001 — CU-001 Inicia Sesión):** Actor "Jefe TI, Técnico, Usuario"; Flujo Normal de 7 pasos (ingreso de credenciales → validación → verificación de rol → token JWT → redirección); Flujo Alterno 4a (credenciales inválidas) y 3a/3b (bloqueo tras 3 intentos fallidos).

### 2.3 Criterios de aceptación

SLAFINAL usa profusamente la columna **"Criterio de Aceptación"** dentro de sus matrices de casos de prueba (una por cada HU), y detalla resultados esperados vs. resultados obtenidos. Sin embargo, **no se redactan en el formato Dado–Cuando–Entonces** que pide la guía; se expresan como afirmaciones de comportamiento esperado ligadas a un caso de prueba técnico (unitario, de integración, caja negra/blanca).

### 2.4 Calidad no funcional alineada a un estándar (ISO/IEC 25010)

A diferencia de RescueLink u otros proyectos, SLAFINAL sí ancla explícitamente su estrategia de pruebas a la **norma ISO/IEC 25010** (la misma que la guía cita en su sección de fuentes recomendadas), con una "Matriz de Casos de Prueba alineada a ISO/IEC 25010" repetida en varios Sprints, mapeando cada caso de prueba a un atributo de calidad de la norma (usabilidad, seguridad, fiabilidad, etc.).

### 2.5 Backlog ordenado por Sprints (equivalente parcial de "Product Backlog priorizado")

El documento organiza las 21 HU documentadas (HU-001 a HU-024, con HU-005 y HU-021 ausentes) en **6 Sprints consecutivos**, lo que constituye un orden de entrega — equivalente funcional a un backlog ya priorizado y dividido en incrementos:

| Sprint | Historias |
|---|---|
| 1 | HU-001 a HU-004 (acceso y gestión de usuarios) |
| 2 | HU-006 a HU-008 (registro y gestión de tickets) |
| 3 | HU-009 a HU-012 (prioridades SLA, conocimiento, equipos) |
| 4 | HU-013 a HU-016 (equipos informáticos y disponibilidad de técnicos) |
| 5 | HU-017 a HU-020 (evaluación de servicio y reporte de cumplimiento SLA) |
| 6 | HU-022 a HU-024 (reportes de fallas, satisfacción y conocimiento) |
