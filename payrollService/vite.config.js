import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from 'path';

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "../");
  const localEnv = loadEnv(mode, envDir, "");

  const getEnvVar = (key, fallback = "") =>
    process.env[key] || localEnv[key] || fallback;

  return {
    plugins: [
      react(),
      federation({
        name: "payrollService",
        filename: "remoteEntry.js",
        remotes: {
          // shell: getEnvVar("SHELL_URL"),
          shell:" http://172.20.136.101:5000/dist/assets/remoteEntry.js"

        },

        exposes: {
          // "./AddBudgetYear": "./src/components/budgetYear/AddBudgetYear.jsx",
         
        },
        shared: [
          "react",
          "react-dom",
          "@mui/material",
          "@mui/x-data-grid",
          "react-router-dom",
          "jotai",
        ],
        dev: true,
      }),
    ],
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },

    server: {
      port: parseInt(getEnvVar("PAYROLL_SERVICE_PORT", "3000")),
      cors: true,
      strictPort: true,
      host: "0.0.0.0",
      proxy: {
        '/v1/esignet': {
          target: 'https://esignet.ida.fayda.et',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
 

  };
});