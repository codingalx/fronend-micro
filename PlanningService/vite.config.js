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
        name: "planningService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {
          "./CreateNeedRequest":
            "./src/components/NeedRequest/CreateNeedRequest.jsx",
          "./DeleteNeedRequest":
            "./src/components/NeedRequest/DeleteNeedRequest.jsx",
          "./EditNeedRequest":
            "./src/components/NeedRequest/EditNeedRequest.jsx",
          "./ListNeedRequest":
            "./src/components/NeedRequest/ListNeedRequest.jsx",

          "./CreateHrAnalisis":
            "./src/components/HrAnalisis/CreateHrAnalisis.jsx",
          "./DeleteHrAnalisis":
            "./src/components/HrAnalisis/DeleteHrAnalisis.jsx",
          "./ListHrAnalisis": "./src/components/HrAnalisis/ListHrAnalisis.jsx",
          "./UpdateHrAnalisis":
            "./src/components/HrAnalisis/UpdateHrAnalisis.jsx",

          "./CreateAnnualRecruitmentPromotion":
            "./src/components/AnnualRecruitmentandPromotion/CreateAnnualRecruitmentPromotion.jsx",
          "./DeleteAnnualRecruitmentPromotion":
            "./src/components/AnnualRecruitmentandPromotion/DeleteAnnualRecruitmentPromotion.jsx",
          "./ListAnnualRecruitmentPromotion":
            "./src/components/AnnualRecruitmentandPromotion/ListAnnualRecruitmentPromotion.jsx",
          "./UpdateAnnualRecruitmentPromotion":
            "./src/components/AnnualRecruitmentandPromotion/UpdateAnnualRecruitmentPromotion.jsx",
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
      port: parseInt(getEnvVar("PLANNING_SERVICE_PORT", "5003")),
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