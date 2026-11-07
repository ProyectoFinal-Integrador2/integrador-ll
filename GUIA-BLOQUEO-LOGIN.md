# Bloqueo de inicio de sesión por correo

Implementado: tres contraseñas incorrectas bloquean únicamente el correo utilizado durante 15 minutos. El correo se compara sin espacios exteriores y en minúsculas.

- Primer fallo: quedan dos intentos. Segundo: queda uno. Tercero: HTTP 429 y bloqueo.
- Otro correo tiene su propio contador; cambiar de correo no reinicia el anterior.
- Una contraseña correcta no permite entrar mientras el bloqueo siga activo.
- Los intentos durante el bloqueo no extienden los 15 minutos.
- Al vencer, se empieza desde cero. Un inicio de sesión exitoso también limpia el contador.
- El estado reside en PostgreSQL y sobrevive a recargas y reinicios del backend.
- La cuenta regresiva se muestra al recibir el bloqueo. Después de recargar, un nuevo envío consulta al servidor y recupera el tiempo restante.
- Seleccionar un rol incorrecto no cuenta como contraseña incorrecta; tampoco se cuentan campos vacíos o correo con formato inválido.
- Los correos no registrados reciben el mismo tratamiento para no revelar si existe una cuenta.

## Preparación

La migración `database/migraciones/2026-11-05_intentos_login.sql` se aplicó a la base configurada durante esta implementación. Para otra base existente, ejecutar ese archivo antes de usar el backend actualizado. Las bases nuevas incluyen la tabla en `database/integrador_BDD.sql`.

Reiniciar el backend si no está ejecutándose con recarga automática. Desde la raíz:

```powershell
npm.cmd run dev
```

## Comprobación manual breve

1. Abrir el login y usar una cuenta de prueba, correo A, con contraseña incorrecta. Debe indicar que quedan dos intentos.
2. Repetir con A: queda uno. Repetir por tercera vez: aparece el bloqueo y una cuenta regresiva próxima a 15:00.
3. Cambiar a un correo B sin fallos previos y escribir una contraseña incorrecta. Deben quedar dos intentos para B.
4. Volver a A: sigue bloqueado. Recargar y enviar la contraseña correcta de A: el servidor sigue rechazándolo y devuelve el tiempo restante.
5. Ingresar con otra cuenta no bloqueada y su contraseña correcta: debe permitir el acceso.
6. Una vez transcurridos 15 minutos, A puede entrar con su contraseña correcta; si escribe una incorrecta, cuenta como su primer fallo nuevo.

No es necesario esperar realmente 15 minutos para comprobar la lógica en código: las pruebas específicas inyectan un reloj y verifican también el instante exacto de vencimiento.

```powershell
npm.cmd run test:auth -w proyecto-integrador-back
```

Esas cuatro pruebas son verificaciones de esta implementación, separadas de las seis pruebas de evaluación que se prepararán posteriormente. Usan repositorios simulados y no modifican cuentas reales; no sustituyen una prueba de interfaz ni de integración con PostgreSQL.
