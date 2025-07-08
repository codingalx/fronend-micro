
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
        name: "userService", // Replace with your service name
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),

        },
              exposes: {
          "./CreateTransfer": "./src/components/Transfer/CreateTransfer.jsx",
        "./EditTransfer": "./src/components/Transfer/EditTransfer.jsx",
        "./DeleteTransfer": "./src/components/Transfer/DeleteTransfer.jsx",
        "./MakeDecision": "./src/components/Transfer/MakeDecision.jsx",

        "./ListTransfer": "./src/components/Transfer/ListTransfer.jsx",
        "./EmployeeTransfers":
          "./src/components/Transfer/EmployeeTransfers.jsx",
        "./CreateDirectAssignment":

          "./src/components/DirectAssignment/CreateDirectAssignment.jsx",
        "./EditDirectAssignment":
          "./src/components/DirectAssignment/EditDirectAssignment.tsx",
        "./DeleteDirectAssignment":
          "./src/components/DirectAssignment/DeleteDirectAssignment.jsx",
        "./ListDirectAssignment":
          "./src/components/DirectAssignment/ListDirectAssignment.jsx",

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
      port: parseInt(getEnvVar("TRANSFER_SERVICE_PORT", "5013")),

      cors: true,
      strictPort: true,
      host: "0.0.0.0",
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  };
});


