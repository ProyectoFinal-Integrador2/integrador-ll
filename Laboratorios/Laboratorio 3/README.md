
# Laboratorio 3 - Sistema de Gestión de Incidencias

## 1. Gestión de Identidad, Accesos y Seguridad
El servicio garantiza mecanismos rigurosos para la protección de las cuentas de usuario y la autenticación.
*   **Proveedor de Identidad:** Los accesos y la emisión de tokens JWT estarán gestionados mediante **Supabase Auth**, asegurando alta disponibilidad en el inicio de sesión.
*   **Políticas de Bloqueo Automático:** Para mitigar ataques de fuerza bruta, el sistema suspenderá temporalmente cualquier cuenta por un lapso exacto de **15 minutos** tras detectar 3 intentos fallidos consecutivos.
*   **Gestión de Roles:** El acceso a los módulos está estrictamente segmentado por el catálogo de roles: *Jefe de TI, Técnico y Usuario*.

## 2. Arquitectura Base y Rendimiento
El sistema operará bajo una arquitectura multicapa moderna diseñada para la alta disponibilidad y baja latencia.
*   **Stack Tecnológico:** La plataforma operará bajo el framework **Next.js 15** (con Server Components y SSR), garantizando renderizados rápidos y transacciones seguras mediante la abstracción del backend.
*   **Entorno de Producción (Vercel):** El despliegue se ejecutará en infraestructura Serverless utilizando **Vercel**. Esto asegura una distribución global rápida, el uso eficiente de Edge Functions y una respuesta optimizada ante picos de concurrencia.
*   **Diseño de Interfaz:** La experiencia visual está garantizada por el estándar estricto estructurado en **Tailwind CSS**, priorizando el acceso responsivo e interacciones sin demoras (ej. temporizadores debounced de 500ms en búsquedas).

## 3. Integridad y Privacidad de la Base de Datos
El resguardo transaccional operará bajo los siguientes estándares normativos:
*   **Aislamiento de Datos (RLS):** La seguridad a nivel de motor de base de datos (**PostgreSQL**) implementará políticas *Row Level Security (RLS)*. Esto garantiza físicamente que las operaciones de lectura o actualización (UPDATE) estén restringidas al propietario de los datos o al rol administrativo (Jefe de TI).
*   **Sincronización Atómica:** La coherencia entre el proveedor de credenciales y los perfiles de la organización será garantizada por *Triggers DDL*, evitando inconsistencias o registros de usuarios huérfanos.

## 4. Calidad del Software y Aseguramiento (QA)
Para garantizar la estabilidad del software ante cada actualización o Sprint, se establecen los siguientes compromisos de calidad:
*   **Cobertura de Código (Code Coverage):** Es un mandato técnico estricto que toda nueva característica supere un mínimo del **80% de cobertura** en las suites de pruebas automatizadas (unitarias e integración).
*   **Marcos Normativos:** La certificación de calidad de los módulos de software se regirá bajo las especificaciones internacionales de evaluación de software:
    *   **ISO/IEC/IEEE 29119-3:** Para la especificación de casos de prueba y reportes.
    *   **ISO/IEC 25010:** Para la verificación de adecuación funcional, fiabilidad, seguridad y usabilidad.

## 5. Integración Continua y Despliegues (CI/CD)
Los compromisos para la liberación de nuevas versiones (updates) al entorno de producción son los siguientes:
*   **Validación Automatizada:** Todo cambio de código será procesado obligatoriamente por un pipeline de integración continua mediante **GitHub Actions**. El pipeline abortará cualquier pase a producción si se detectan errores de tipado en TypeScript o si falla alguna aserción en Jest.
*   **Gobernanza y Aprobación:** Ningún pase al entorno de Vercel será liberado sin la verificación de funcionalidad en el entorno Staging y la firma de conformidad expresa del **Product Owner**.
