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
        name: "storeMovementService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {

          "./CreateGatePassInformation": "./src/components/GatePassInformation/CreateGatePassInformation.jsx",
          "./DecisionGatePassInformation": "./src/components/GatePassInformation/DecisionGatePassInformation.jsx",
          "./DeleteGatePassInformation": "./src/components/GatePassInformation/DeleteGatePassInformation.jsx",
          "./UpdateGatePassInformation": "./src/components/GatePassInformation/UpdateGatePassInformation.jsx",
          "./GetAllGatePassInformation": "./src/components/GatePassInformation/GetAllGatePassInformation.jsx",

          "./CreateGoodReceivingNote": "./src/components/GoodReceivingNote/CreateGoodReceivingNote.jsx",
          "./DeleteGoodReceivingNote": "./src/components/GoodReceivingNote/DeleteGoodReceivingNote.jsx",
          "./GetAllGoodReceivingNote": "./src/components/GoodReceivingNote/GetAllGoodReceivingNote.jsx",
          "./UpdateGoodReceivingNote": "./src/components/GoodReceivingNote/UpdateGoodReceivingNote.jsx",

          "./CreateInterStoreIssueVoucherForIssue": "./src/components/InterStoreIssueVoucherForIssue/CreateInterStoreIssueVoucherForIssue.jsx",
          "./DecisionInterStoreIssueVoucherForIssue": "./src/components/InterStoreIssueVoucherForIssue/DecisionInterStoreIssueVoucherForIssue.jsx",
          "./DeleteInterStoreIssueVoucherForIssue": "./src/components/InterStoreIssueVoucherForIssue/DeleteInterStoreIssueVoucherForIssue.jsx",
          "./GetAllInterStoreIssueVoucherForIssue": "./src/components/InterStoreIssueVoucherForIssue/GetAllInterStoreIssueVoucherForIssue.jsx",
          "./UpdateInterStoreIssueVoucherForIssue": "./src/components/InterStoreIssueVoucherForIssue/UpdateInterStoreIssueVoucherForIssue.jsx",



          "./CreateInterStoreIssueVoucherForReceiving": "./src/components/InterStoreIssueVoucherForReceiving/CreateInterStoreIssueVoucherForReceiving.jsx",
          "./DeleteInterStoreIssueVoucherForReceiving": "./src/components/InterStoreIssueVoucherForReceiving/DeleteInterStoreIssueVoucherForReceiving.jsx",
          "./GetAllInterStoreIssueVoucherForReceiving": "./src/components/InterStoreIssueVoucherForReceiving/GetAllInterStoreIssueVoucherForReceiving.jsx",
          "./UpdateInterStoreIssueVoucherForReceiving": "./src/components/InterStoreIssueVoucherForReceiving/UpdateInterStoreIssueVoucherForReceiving.jsx",

          "./CreateStoreIssueVoucher": "./src/components/StoreIssueVoucher/CreateStoreIssueVoucher.jsx",
          "./DeleteStoreIssueVoucher": "./src/components/StoreIssueVoucher/DeleteStoreIssueVoucher.jsx",
          "./GetAllStoreIssueVoucher": "./src/components/StoreIssueVoucher/GetAllStoreIssueVoucher.jsx",
          "./UpdateStoreIssueVoucher": "./src/components/StoreIssueVoucher/UpdateStoreIssueVoucher.jsx",

          // "./LeaveRequestHrApprovance":
          //   "./src/components/LeaveRequestone/LeaveRequestHrApprovance.jsx",
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
      port: parseInt(getEnvVar("STOREMOVEMENT_SERVICE_PORT", "5020")),
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