import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
        '/socket.io': {
          target: 'http://localhost:5001',
          ws: true,
        },
      },
    },
    define: {
      'import.meta.env.VITE_ROLLBAR_TOKEN': JSON.stringify(env.VITE_ROLLBAR_TOKEN),
    },
  };
});
