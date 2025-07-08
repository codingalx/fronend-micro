
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
        name: "evaluationService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {
          "./CreateCategory": "./src/components/category/CreateCategory.jsx",
          "./DeleteCategory": "./src/components/category/DeleteCategory.jsx",
          "./UpdateCategory": "./src/components/category/UpdateCategory.jsx",

          "./CreateCriterial": "./src/components/criterial/CreateCriterial.jsx",
          "./DeleteCriterial": "./src/components/criterial/DeleteCriterial.jsx",
          "./UpdateCriterial": "./src/components/criterial/UpdateCriterial.jsx",

          "./CreateLevel": "./src/components/levels/CreateLevel.jsx",
          "./DeleteLevel": "./src/components/levels/DeleteLevel.jsx",
          "./UpdateLevel": "./src/components/levels/UpdateLevel.jsx",

          "./CreateSession": "./src/components/session/CreateSession.jsx",
          "./DeleteSession": "./src/components/session/DeleteSession.jsx",
          "./UpdateSession": "./src/components/session/UpdateSession.jsx",

          "./CreateResult": "./src/components/result/CreateResult.jsx",
          "./DeleteResult": "./src/components/result/DeleteResult.jsx",
          "./UpdateResult": "./src/components/result/UpdateResult.jsx",
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
      port: parseInt(getEnvVar("EVALUATION_SERVICE_PORT", "5008")),
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
