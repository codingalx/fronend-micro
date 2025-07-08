
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
          './CreateCandidateEvaluation': './src/components/CandidateEvaluation/CreateCandidateEvaluation.jsx',
          './EditCandidateEvaluation': './src/components/CandidateEvaluation/EditCandidateEvaluation.jsx',
          './ListCandidateEvaluation': './src/components/CandidateEvaluation/ListCandidateEvaluation.jsx',
          './DeletCandidateEvaluation': './src/components/CandidateEvaluation/DeletCandidateEvaluation.jsx',
          './CreatePromotionCandidate': './src/components/PromotionCandidate/CreatePromotionCandidate.jsx',
          './UpdatePromotionCandidate': './src/components/PromotionCandidate/UpdatePromotionCandidate.jsx',
          './ListPromotionCandidate': './src/components/PromotionCandidate/ListPromotionCandidate.jsx',
          './DeletePromotionCandidate': './src/components/PromotionCandidate/DeletePromotionCandidate.jsx',

          './CreateName': './src/components/PromoCriteriaName/CreateName.jsx',
          './UpdateCriteria': './src/components/PromoCriteriaName/UpdateCriteria.jsx',
          './DeleteCriteria': './src/components/PromoCriteriaName/DeleteCriteria.jsx',
          './ListPromotion': './src/components/PromoCriteriaName/ListPromotion.jsx',
          './NestedCriteria': './src/components/PromoCriteriaName/NestedCriteria.jsx',
          './EditNestedCriteria': './src/components/PromoCriteriaName/EditNestedCriteria.jsx',
          './DeleteChildCriteria': './src/components/PromoCriteriaName/DeleteChildCriteria.jsx',
          './ListNestedCriteria': './src/components/PromoCriteriaName/ListNestedCriteria.jsx',

              
          './CreatePromotionCriteria': './src/components/PromotionCriteria/CreatePromotionCriteria.jsx',
          './ListPromotionCriteria': './src/components/PromotionCriteria/ListPromotionCriteria.jsx',
          './UpdatePromotionCriteria': './src/components/PromotionCriteria/UpdatePromotionCriteria.jsx',
          './DeletePromotionCriteria': './src/components/PromotionCriteria/DeletePromotionCriteria.jsx',

           './CreatePromoteCandidate': './src/components/PromoteCandidate/CreatePromoteCandidate.jsx',
           './ListPromoteCandidate': './src/components/PromoteCandidate/ListPromoteCandidate.jsx',
           './AppLogin': './src/components/AppLogin.jsx',
    
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
      port: parseInt(getEnvVar("PROMOTION_SERVICE_PORT", "5011")),
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

