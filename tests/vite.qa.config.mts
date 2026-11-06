import { mergeConfig } from 'vite';
import original from '../proyecto-integrador-front/vite.config.ts';
export default mergeConfig(original, {
  root: 'proyecto-integrador-front',
  server: { host: '127.0.0.1', port: 5174, strictPort: true,
    proxy: { '/api': { target: 'http://127.0.0.1:3100', changeOrigin: true } } },
});
