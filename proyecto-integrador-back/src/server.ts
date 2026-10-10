import app from '../../../proyecto-integrador-back/src/app';
import { env } from '../#8/back/src/config/env';

app.listen(env.port, () => {
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
});
