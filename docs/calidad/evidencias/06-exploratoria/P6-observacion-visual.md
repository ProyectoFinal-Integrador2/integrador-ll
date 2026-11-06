# Observación visual complementaria de P6

Se inspeccionó `P6-movil.png`, generada en Chromium con viewport de 360×800 después de la transición de cierre de la barra lateral.

- El documento informa ancho visible 360 y ancho de contenido 360.
- Aun así, la captura muestra contenido recortado a la derecha: el control de actualización y el mensaje de ausencia de resultados no se presentan completamente.
- No se considera aprobada la adaptación móvil solo porque no haya desplazamiento horizontal global. El contenedor principal puede ocultar contenido que excede su ancho.
- Mejora propuesta: revisar anchos mínimos, distribución de la barra de búsqueda y envoltura del texto dentro de los contenedores; repetir con 360×800 y 768×1024.

Es una observación de la captura, no una medición de satisfacción ni una prueba con dispositivo físico.
