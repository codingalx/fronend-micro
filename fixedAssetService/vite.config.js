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
        name: "fixedAssetService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {
          "./CreateFixedAsset": "./src/components/FixedAsset/CreateFixedAsset.jsx",
          "./DeleteFixedAsset": "./src/components/FixedAsset/DeleteFixedAsset.jsx",
          "./UpdateFixedAsset": "./src/components/FixedAsset/UpdateFixedAsset.jsx",
          "./GetAllFixedAsset": "./src/components/FixedAsset/GetAllFixedAsset.jsx"
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
      port: parseInt(getEnvVar("FIXEDASSET_SERVICE_PORT", "5021")),
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