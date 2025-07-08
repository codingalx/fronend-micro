
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

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
          "./AddNewuser": "./src/components/User/AddNewuser.jsx",
          "./ListUsers": "./src/components/User/ListUsers.jsx",
          "./ManageTenantRole": "./src/components/User/ManageTenantRole.jsx",
          "./UpdateUsersRole": "./src/components/User/UpdateUsersRole.jsx",
          "./ResetPassWord": "./src/components/User/ResetPassWord.jsx",
          "./ListResourseName": "./src/components/User/ListResourseName.jsx",
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
      port: parseInt(getEnvVar("USER_SERVICE_PORT", "5007")),
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
