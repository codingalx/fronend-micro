
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
        name: "shell",
        filename: "remoteEntry.js",
        remotes: {

          EmployeeService: 'http://172.20.136.101:5001/dist/assets/remoteEntry.js',
          RecruitmentService: getEnvVar("RECRUITMENT_SERVICE_URL"),
          planning: getEnvVar("PLANNING_SERVICE_URL"),
          trainingservice: getEnvVar("TRAINING_SERVICE_URL"),
          organization: 'http://172.20.136.101:5005/dist/assets/remoteEntry.js',
          leaveService: getEnvVar("LEAVE_SERVICE_URL"),
          userService: getEnvVar("USER_SERVICE_URL"),
          evaluationService: getEnvVar("EVALUATION_SERVICE_URL"),
          delegationService: getEnvVar("DELEGATION_SERVICE_URL"),
          documentService: getEnvVar("DOCUMENT_SERVICE_URL"),
          promotionService: getEnvVar("PROMOTION_SERVICE_URL"),
          separationService: getEnvVar("SEPARATION_SERVICE_URL"),
          transferService: getEnvVar("TRANSFER_SERVICE_URL"),
          disciplineService: getEnvVar("DISCIPLINE_SERVICE_URL"),
          complaintService: getEnvVar("COMPLAINT_SERVICE_URL"),
          attendanceService: 'http://172.20.136.101:5016/dist/assets/remoteEntry.js',
          itemService: 'http:localhost:5018/dist/assets/remoteEntry.js',
          storeService: 'http:localhost:5019/dist/assets/remoteEntry.js',
          storeMovementService: 'http:localhost:5020/dist/assets/remoteEntry.js',
          fixedAssetService: 'http:localhost:5021/dist/assets/remoteEntry.js'


        },
        exposes: {
          "./Exposed": "./src/components/Security/Exposed.jsx",
          "./AuthContext": "./src/components/Security/AuthContext.jsx",
          "./authAtom": "./src/components/Security/authAtom.js",
          "./RoleProtectedRoute":
            "./src/components/Security/RoleProtectedRoute.jsx",
        },
        shared: [
          "react",
          "react-dom",
          "@mui/material",
          "@mui/x-data-grid",
          "react-router-dom",
          "jotai",
        ],
      }),
    ],
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
    server: {
      port: parseInt(getEnvVar("SHELL_PORT", "5000")),
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
});;
;
