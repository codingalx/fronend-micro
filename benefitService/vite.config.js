import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';


export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '');


  return {
    plugins: [
      react(),
      federation({
        name: 'benefitService',
        filename: 'remoteEntry.js',
        remotes: {
          shell: env.SHELL_URL, // Use environment variable
        },
        exposes: {
        
        },
        shared: [
          'react',
          'react-dom',
          '@mui/material',
          '@mui/x-data-grid',
          'react-router-dom',
          'jotai'
        ],
        dev: true,
      }),
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
    server: {
      port: 5014,
      cors: true,
      strictPort: true,
      host: '0.0.0.0',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
    },
  };
});