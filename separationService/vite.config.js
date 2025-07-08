
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
        // Clearance Components
        './CreateClearance': './src/components/Clearance/CreateClearance',
        './ListClearance': './src/components/Clearance/ListClearance',
        './UpdateClearance': './src/components/Clearance/UpdateClearance',
        './DeleteClearance': './src/components/Clearance/DeleteClearance',
        './CreateClearanceRetirement': './src/components/Clearance/CreateClearanceRetirement',
        './CreateClearanceTermination': './src/components/Clearance/CreateClearanceTermination',
        
        // Clearance Department Components
        './CreateClearanceDepartment': './src/components/ClearanceDepartment/CreateClearanceDepartment',
        './ListClearanceDepartment': './src/components/ClearanceDepartment/ListClearanceDepartment',
        './UpdateClearanceDepartment': './src/components/ClearanceDepartment/UpdateClearanceDepartment',
        './DeleteClearanceDepartment': './src/components/ClearanceDepartment/DeleteClearanceDepartment',
        
        // Exit Interview Components
        './CreateExitInterview': './src/components/ExitInterview/CreateExitInterview',
        './ListExitInterview': './src/components/ExitInterview/ListExitInterview',
        './UpdateExitInterview': './src/components/ExitInterview/UpdateExitInterview',
        './DeleteExitInterview': './src/components/ExitInterview/DeleteExitInterview',
        
        // Retirement Components
        './CreateRetirement': './src/components/Retirement/CreateRetirement',
        './ListRetirement': './src/components/Retirement/ListRetirement',
        './UpdateRetirement': './src/components/Retirement/UpdateRetirement',
        './DeleteRetirement': './src/components/Retirement/DeleteRetirement',
        './ApproveRetirement': './src/components/Retirement/ApproveRetirement',
        './ListRetirementUser': './src/components/Retirement/ListRetirementUser',
        
        // Termination Components
        './CreateTermination': './src/components/Termination/CreateTermination',
        './ListTermination': './src/components/Termination/ListTermination',
        './UpdateTermination': './src/components/Termination/UpdateTermination',
        './DeleteTermination': './src/components/Termination/DeleteTermination',
        './ApproveTermination': './src/components/Termination/ApproveTermination',
        './ListTerminationUser': './src/components/Termination/ListTerminationUser',

        // Termination Type Components
        './CreateTerminationType': './src/components/TerminationType/CreateTerminationType',
        './ListTerminationType': './src/components/TerminationType/ListTerminationType',
        './UpdateTerminationType': './src/components/TerminationType/UpdateTerminationType',
        './DeleteTerminationType': './src/components/TerminationType/DeleteTerminationType'
      
        
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
      port: parseInt(getEnvVar("SEPARATION_SERVICE_PORT", "5012")),

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


