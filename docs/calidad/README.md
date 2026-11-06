# Guía de evidencias para la sustentación

El informe principal está en [AVANCE3.MD](../../AVANCE3.MD). Los archivos de evidencia conservan su contenido original; solo se organizaron en carpetas.

| Orden | Carpeta | Qué presentar al profesor |
|---|---|---|
| 0 | [Reportes generales](evidencias/00-reportes-generales/) | Resumen de resultados, ejecución de navegadores, entorno y limpieza de datos temporales. |
| 1–2 | [Pruebas unitarias](evidencias/01-02-pruebas-unitarias/) | Reporte conjunto de P1: bloqueo por correo y P2: cálculo SLA. Contiene los 11 casos individuales. |
| 3 | [Funcionalidad de tickets](evidencias/03-funcionalidad-tickets/) | Capturas de datos inválidos, error sin equipo y registro válido; respuestas JSON por motor. |
| 4 | [Compatibilidad](evidencias/04-compatibilidad/) | Capturas del ticket persistido y recuperado en Chromium, Firefox y WebKit. |
| 5 | [Interacción y accesibilidad](evidencias/05-interaccion-accesibilidad/) | Captura del modal y reporte de contraste, nombre accesible y foco. |
| 6 | [Exploratoria](evidencias/06-exploratoria/) | Bitácora, bloqueo por correo, captura pequeña y observación visual. |

## Cómo explicarlo

1. Abrir `AVANCE3.MD` y presentar el cuadro de resultados de los seis bloques.
2. Seguir las carpetas en orden: explicar qué se probó, mostrar la evidencia y señalar el resultado.
3. Cerrar con las mejoras pendientes y los próximos pasos documentados en el informe.

**PNG:** captura de pantalla. **JSON:** resultado estructurado de las herramientas. **MD:** explicación escrita.

P1 y P2 comparten un reporte porque se ejecutaron juntas con Vitest. No se dividió ni modificó ese archivo para conservar la evidencia original.

El reporte HTML interactivo permanece en `playwright-report/index.html` y se abre desde la raíz con `npm.cmd run test:report`.
