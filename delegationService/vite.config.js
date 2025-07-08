
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
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
        name: "delegationService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },
        exposes: {
          "./CreateDelegation":
            "./src/components/delegation/CreateDelegation.jsx",
          "./DeleteDelegation":
            "./src/components/delegation/DeleteDelegation.jsx",
          "./GetAllDelegationsByEmployee":
            "./src/components/delegation/GetAllDelegationsByEmployee.jsx",
          "./ListDelegation": "./src/components/delegation/ListDelegation.jsx",
          "./TerminateDelegation":
            "./src/components/delegation/TerminateDelegation.jsx",
          "./UpdateDelegation":
            "./src/components/delegation/UpdateDelegation.jsx",
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
      port: parseInt(getEnvVar("DELEGATION_SERVICE_PORT", "5009")),
      cors: true,
      strictPort: true,
      host: "0.0.0.0",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
  };
});
