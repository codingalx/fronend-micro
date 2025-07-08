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
        name: "disciplineService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),

        },

        exposes: {
          // Appeal components

          "./CreateAppeal": "./src/components/Appeal/CreateAppeal.jsx",
          "./DeleteAppeal": "./src/components/Appeal/DeleteAppeal.jsx",
          "./ListAppeal": "./src/components/Appeal/ListAppeal.jsx",
          "./UpdateAppeal": "./src/components/Appeal/UpdateAppeal.jsx",

          // Discipline components
          "./ApproveDiscipline":
            "./src/components/Discipline/ApproveDiscipline.jsx",
          "./CreateDiscipline": "./src/components/Discipline/CreateDiscipline.jsx",
          "./DeleteDiscipline":
            "./src/components/Discipline/DeleteDiscipline.jsx",
          "./ListDiscipline":
            "./src/components/Discipline/ListDiscipline.jsx",
          "./ListDisciplineUser":
            "./src/components/Discipline/ListDisciplineUser.jsx",
          "./ListDisciplineForUser":
            "./src/components/Discipline/ListDisciplineForUser.jsx",
          "./UpdateDiscipline":
            "./src/components/Discipline/UpdateDiscipline.jsx",

          // Offense components
          "./CreateOffense":
            "./src/components/Offense/CreateOffense.jsx",
          "./DeleteOffense":
            "./src/components/Offense/DeleteOffense.jsx",
          "./ListOffense": "./src/components/Offense/ListOffense.jsx",
          "./UpdateOffense":
            "./src/components/Offense/UpdateOffense.jsx",

          // Penalty components
          "./CreatePenalty":
            "./src/components/Penalty/CreatePenalty.jsx",
          "./DeletePenalty":
            "./src/components/Penalty/DeletePenalty.jsx",
          "./ListPenalty": "./src/components/Penalty/ListPenalty.jsx",
          "./UpdatePenalty":
            "./src/components/Penalty/UpdatePenalty.jsx",
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
      port: parseInt(getEnvVar("DISCIPLINE_SERVICE_PORT", "5014")),
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


