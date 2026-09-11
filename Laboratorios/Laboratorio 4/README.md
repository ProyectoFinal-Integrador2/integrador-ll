```markdown
# Métricas, Niveles de Servicio (SLA) y Optimización de Rendimiento Web (WPO)

## 1. Catálogo de Indicadores (KPI, SLI, SLO)

### 1.1 Diferenciación Operativa de Indicadores
* **KPI (Key Performance Indicator):** Mide el avance hacia los objetivos de negocio o de producto (ej. tasa de tickets resueltos satisfactoriamente).
* **SLI (Service Level Indicator):** Medida cuantitativa de un aspecto técnico del servicio en un periodo determinado (ej. % de peticiones de tickets procesadas con éxito).
* **SLO (Service Level Objective):** Meta interna deseada para un SLI dentro de una ventana de tiempo (ej. SLI $\ge$ 99.5% durante 28 días).
* **SLA (Service Level Agreement):** Acuerdo formal con el cliente/stakeholder que define alcance, SLOs, medición, gestión de incidentes y consecuencias por incumplimiento.

---

### 1.2 Catálogo Maestro de Métricas del Sistema

| ID | Indicador | Tipo | Fórmula / Estadístico | Ventana | Objetivo Propuesto | Estado / Fuente |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **KPI-01** | Tasa de Resolución de Incidencias | KPI Producto | $\frac{\text{Tickets Resueltos}}{\text{Tickets Totales Creados}} \times 100$ | 28 días | $\ge 90.0\%$ | Muestra en Base de Datos |
| **SLI-01** | Tasa de Respuesta Correcta (API/Backend) | SLI Corrección | $\frac{\text{Respuestas 200 OK Válidas}}{\text{Solicitudes Elegibles Totales}} \times 100$ | 28 días móviles | $\ge 99.5\%$ | Telemetría / Logs Servidor |
| **SLI-02** | Latencia de Primera Respuesta | SLI Latencia | Percentil **p95** de duración $(\text{ms})$ en flujo crítico | 28 días móviles | $\le 2500\,\text{ms}$ | Performance API / RUM |
| **UX-01** | Largest Contentful Paint (LCP) | Core Web Vital | Carga del elemento visual principal (p75) | Perfil Incógnito / RUM | $\le 2.5\,\text{s}$ | Laboratorio / Chrome DevTools |
| **UX-02** | Interaction to Next Paint (INP) | Core Web Vital | Latencia de respuesta a interacciones (p75) | RUM Campo | $\le 200\,\text{ms}$ | Laboratorio / RUM |
| **UX-03** | Cumulative Layout Shift (CLS) | Core Web Vital | Estabilidad visual durante el renderizado (p75) | Perfil Incógnito | $\le 0.10$ | Laboratorio / Lighthouse |
| **DEL-01**| Tamaño de Paquete Inicial (Build) | Guardrail CI/CD | Bytes totales del bundle de producción | Por cada PR/Build | $\le 180\,\text{kB}$ | CLI Compiler / Next / Angular |

## 2. Fichas de Especificación de SLI (Medición Auditable)

### Ficha SLI-01: Tasa de Respuesta Correcta del Servicio
* **Propósito:** Garantizar la disponibilidad y la integridad en las operaciones de inicio de sesión, consulta y creación de incidencias.
* **Población Elegible:** Peticiones HTTP enviadas a la plataforma con parámetros sintácticamente válidos.
* **Evento Bueno:** Respuesta exitosa HTTP 200/201 con payload procesable o lista vacía válida.
* **Fórmula:**
  $$\text{SLI-01 (\%)} = \frac{\text{Eventos Buenos}}{\text{Eventos Elegibles}} \times 100$$
* **Fuente de Datos:** Logs del servidor de aplicaciones, Supabase Telemetry y eventos de cliente.
* **Ventana de Medición:** 28 días móviles con corte diario.
* **Exclusiones Auditables:** Peticiones rechazadas por validación perimetral Zod (HTTP 400), pruebas de carga sintéticas identificadas y tráfico malicioso de fuerza bruta bloqueado.
* **Responsable:** Equipo de Desarrollo / DevOps.

### Ficha SLI-02: Latencia de Respuesta de Servicios (p95)
* **Propósito:** Medir la velocidad de respuesta recibida por el usuario en el percentil 95 para evitar cuellos de botella en la cola de procesamiento.
* **Población Elegible:** Solicitudes de consulta de tickets y cambio de estado procesadas por el servidor.
* **Método de Cálculo (Percentil Nearest-Rank):**
  $$\text{Posición } p95 = \lceil 0.95 \times N \rceil$$
  *(Se ordenan las duraciones de menor a mayor y se selecciona el valor en la posición calculada).*
* **Ventana de Medición:** 28 días móviles.
* **Exclusiones Auditables:** Fallos de conectividad en la red local del cliente y latencias derivadas de latencia física de ISP demostrables.

## 3. SLO y Política de Presupuesto de Error (Error Budget)

### 3.1 Planteamiento Formal de SLOs
* **SLO-01 (Corrección):** Durante una ventana de 28 días móviles, al menos el **99.5%** de las solicitudes elegibles a la plataforma devolverán una respuesta correcta y utilizable.
* **SLO-02 (Latencia):** Durante una ventana de 28 días móviles, el percentil **p95** de la latencia de respuesta en la consulta de incidencias será **$\le 2500\,\text{ms}$**.

### 3.2 Tabla de Presupuesto de Error
Calculado sobre un volumen estimado de **10,000 eventos elegibles** en una ventana de 30 días:

| SLO | Presupuesto de Error (%) | Eventos Erróneos Permitidos (Muestra 10,000) | Equivalente en Tiempo (24x7 / 30 días) |
| :--- | :--- | :--- | :--- |
| **99.0%** | 1.0% | 100 eventos | 432 minutos (7.2 horas) |
| **99.5%** | 0.5% | 50 eventos | 216 minutos (3.6 horas) |
| **99.9%** | 0.1% | 10 eventos | 43.2 minutos |

### 3.3 Política de Consumo del Presupuesto de Error
* **Consumo al 50%:** Notificación automática al equipo, revisión de logs y tendencias sin congelar despliegues.
* **Consumo al 80%:** Priorización obligatoria de deudas técnicas y correcciones en el Sprint Backlog. Congelamiento de cambios de alto riesgo en producción.
* **Consumo al 100%:** Declaración de incumplimiento del SLO. Detención inmediata del despliegue de nuevas características (Feature Freeze), análisis de causa raíz (RCA) y ejecución del plan de recuperación.

---

## 4. Borrador del Acuerdo de Nivel de Servicio (SLA)

### 4.1 Alcance y Horario del Servicio
* **Partes:** Proveedor de TI (Equipo de Help Desk) y Consumidor (Personal Operativo y Administrativo de Quimesa).
* **Servicio Cubierto:** Sistema Web de Gestión de Incidencias (Autenticación, Registro/Consulta de Tickets, Inventario y Base de Conocimientos).
* **Horario Operativo:** Lunes a Sábado, de 07:00 a 21:00 horas (Zona horaria `America/Lima`).

### 4.2 Tiempos Objetivos por Severidad de Incidente

| Nivel de Prioridad | Tiempo Máximo de Primera Respuesta | Tiempo Máximo de Resolución | Frecuencia de Actualización |
| :--- | :--- | :--- | :--- |
| **Crítica** | $\le 15 \text{ minutos}$ | $\le 2 \text{ horas}$ | Cada 30 minutos |
| **Alta** | $\le 30 \text{ minutos}$ | $\le 4 \text{ horas}$ | Cada 1 hora |
| **Media** | $\le 2 \text{ horas}$ | $\le 12 \text{ horas}$ | Cada 4 horas |
| **Baja** | $\le 4 \text{ horas}$ | $\le 24 \text{ horas}$ | Diaria |

### 4.3 Acuerdos de Gestión y Excepciones
* **Regla de Cumplimiento:** Un ticket se considera "Cumple SLA" únicamente si satisface **simultáneamente** el tiempo de primera respuesta y el tiempo de resolución.
* **Exclusiones de SLA:** Ventanas de mantenimiento programado (notificadas con 48 horas de anticipación), interrupciones del proveedor de infraestructura cloud (Supabase/Vercel) e indisponibilidad por causas de fuerza mayor.
* **Consecuencia Técnica/Académica:** Si se incumple el SLA en un ciclo, el equipo debe presentar un informe causal, implementar las acciones correctivas en el siguiente Sprint y reajustar los presupuestos de tamaño y rendimiento.

## 5. Rendimiento Web (WPO) y Experimento reproducible

### 5.1 Condiciones de Medición: Laboratorio vs. Campo
* **Datos de Laboratorio:** Mediciones obtenidas bajo entornos controlados con Chrome DevTools / Lighthouse. Útiles para diagnosticar regresiones, depurar el hilo principal y establecer la línea base previa al despliegue.
* **Datos de Campo (RUM / CrUX):** Telemetría recolectada de usuarios reales navegando en diversos dispositivos y redes. Útiles para validar la experiencia final del servicio.

### 5.2 Estrategias de Optimización Aplicadas

1. **Presupuestos de Tamaño de Build:**
   Configuración de alertas en el empaquetado para evitar el crecimiento desmedido de los bundles JavaScript/CSS.
   ```json
   "budgets": [
     {
       "type": "initial",
       "maximumWarning": "150kB",
       "maximumError": "180kB"
     },
     {
       "type": "anyComponentStyle",
       "maximumWarning": "5kB",
       "maximumError": "7kB"
     }
   ]
   ```

2. **Carga Diferida (Lazy Loading / `@defer`):**
   Separación de componentes secundarios (como el panel de métricas o gráficos de reportes) del paquete principal mediante carga diferida sobre el viewport con placeholders estables para evitar saltos visuales (CLS).

3. **Optimización de Activos e Imágenes:**
   * Uso de dimensiones explícitas (`width` y `height`) o la propiedad `aspect-ratio`.
   * Priorización exclusiva mediante `priority` / `priorityFetch` al elemento candidato a **LCP**.
   * Carga diferida (`loading="lazy"`) para imágenes fuera de la pantalla inicial.

4. **Optimización de Interacción y Búsqueda:**
   * Implementación de **debounce** de 300 ms a 500 ms en cajas de búsqueda y filtros de tablas para reducir las solicitudes redundantes hacia la API.
