# Laboratorio 2

### 2.1 Selección de línea tecnológica con criterios explícitos

Cada Historia de Usuario abre su apartado de diseño con una **"Decisión Formal de Arquitectura y Stack Tecnológico"**, justificando cada herramienta por su función técnica y no por preferencia:

- **Next.js 15** (SSR, Server Actions) — justificado por seguridad de sesión (cookies `HttpOnly`, prevención de XSS).
- **TypeScript 5.x** — tipado estático como "contrato de datos autodescriptivo".
- **Tailwind CSS 4.x** — consistencia visual y responsividad.
- **PostgreSQL + Supabase (BaaS)** — integridad referencial, transacciones ACID y autenticación gestionada.

Esta sección se repite en todos los Sprints (HU-001, HU-002, HU-006, HU-013, etc.), lo que muestra una línea tecnológica sostenida a lo largo del proyecto, equivalente a la "línea tecnológica de referencia" que pide la guía.

### 2.2 Arquitectura como decisión explícita

SLAFINAL define una **arquitectura multicapas** (Presentación → Lógica de negocio/Servicios → Acceso a datos/Repositorios → Base de datos), documentada con Diagramas de Paquetes UML en cada Sprint. Es el equivalente funcional al "Monolito modular + API REST" que propone la guía como línea base: un único proyecto Next.js concentra frontend y backend, evitando la complejidad de microservicios.

### 2.3 Control de versiones y colaboración con GitHub

La colaboración vía GitHub aparece integrada al pipeline, no como sección aparte:

- **Rama principal protegida:** todo cambio llega a `main` mediante *pull request*; el pipeline de CI se dispara "en cada confirmación de cambios (push) o al crearse una solicitud de fusión (pull_request) orientada a la rama principal (main)".
- **Gobernanza de aprobación (HU-001, §6.3):** ningún cambio se integra a producción sin que el pipeline de CI pase al 100 %, la cobertura sea ≥80 % y el Product Owner audite los criterios de aceptación en Staging antes de firmar la conformidad — un control de revisión más estricto que el "al menos una aprobación" que pide la guía.
- Referencias recurrentes a bloqueo de *merge* si las pruebas fallan (HU-006, HU-008: "bloqueando el merge si la tasa de éxito es menor al 100 % o la cobertura global...").

### 2.4 Reproducibilidad de la construcción (equivalente a "configuración como código")

En lugar de Docker Compose local, la reproducibilidad se resuelve en el pipeline de CI (GitHub Actions), repetido en cada HU:

1. *Checkout* del repositorio.
2. Configuración del entorno: **Node.js LTS 24**.
3. Instalación limpia de dependencias (`npm ci` / instalación limpia).
4. Ejecución de pruebas automatizadas (Jest).
5. Verificación de compilación de producción (Next.js + TypeScript).

Todo se ejecuta "sobre una máquina virtual aislada con sistema operativo Ubuntu Linux", cumpliendo el mismo principio de "otro integrante puede levantar el entorno sin depender de conocimiento privado" que exige la guía.

Las variables de entorno (credenciales de Supabase) se gestionan de forma aislada en el panel de Vercel para evitar fugas en el código fuente — equivalente al `.env.example` sin secretos reales.

### 2.5 Concepto de "Ambiente" (desarrollo, pruebas, producción)

SLAFINAL distingue explícitamente:

- **Entorno de CI** (máquina virtual efímera de GitHub Actions).
- **Staging** ("entorno intermedio de pruebas") donde el Product Owner valida criterios de aceptación antes de aprobar.
- **Producción** en Vercel, con despliegue continuo tras la fusión a `main`.

Esto corresponde directamente al concepto de la guía: *"Ambiente: configuración separada para un propósito del ciclo — desarrollo, pruebas y producción."*

### 2.6 Trazabilidad de requerimiento a evidencia técnica

Cada Historia de Usuario mantiene una cadena consistente: **HU → diagrama de actividades/caso de uso → diseño → implementación → pruebas → despliegue**, repetida de forma idéntica en los 15 HU del documento. Es una trazabilidad de alcance más amplio (documental) que la de la guía (issue → rama → commit → PR → pantalla → prueba), pero cumple el mismo propósito: que cada decisión sea rastreable hasta la necesidad que la origina.

### 2.7 Del requerimiento a la interfaz: mockups en Figma

La sección **"Figma y Pautas de Interfaz de Usuario (UI)"** (presente en HU-001 y replicada con variaciones en HU-002, HU-007, HU-009, HU-010, etc.) documenta decisiones visuales de fidelidad media/alta:

- Paleta corporativa (azul primario `#2563eb`, rojo de error `#ef4444`).
- Tipografía y jerarquías (Inter/Outfit, pesos *bold/medium/regular*).
- Radios, espaciados y estados de foco (`rounded-2xl`, `focus:ring-2`).
- Componentes reutilizables (alertas de error, contadores, tarjetas, modales emergentes).
