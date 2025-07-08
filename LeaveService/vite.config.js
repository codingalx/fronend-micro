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
        name: "leaveService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {
          "./AddBudgetYear": "./src/components/budgetYear/AddBudgetYear.jsx",
          "./DetailsBudgetYear":
            "./src/components/budgetYear/DetailsBudgetYear.jsx",
          "./EditBudgetYear": "./src/components/budgetYear/EditBudgetYear.jsx",
          "./ManageBudgetYear":
            "./src/components/budgetYear/ManageBudgetYear.jsx",

          "./AddLeaveType": "./src/components/leaveType/AddLeaveType.jsx",
          "./DetailsLeaveType":
            "./src/components/leaveType/DetailsLeaveType.jsx",
          "./EditLeaveType": "./src/components/leaveType/EditLeaveType.jsx",
          "./ManageLeaveType": "./src/components/leaveType/ManageLeaveType.jsx",

          "./AddHoliday": "./src/components/holiday/AddHoliday.jsx",
          "./DetailsHoliday": "./src/components/holiday/DetailsHoliday.jsx",
          "./EditHoliday": "./src/components/holiday/EditHoliday.jsx",
          "./ManageHoliday": "./src/components/holiday/ManageHoliday.jsx",

          "./AddLeaveSettings":
            "./src/components/leaveSettings/AddLeaveSettings.jsx",
          "./DetailsLeaveSettings":
            "./src/components/leaveSettings/DetailsLeaveSettings.jsx",
          "./EditLeaveSettings":
            "./src/components/leaveSettings/EditLeaveSettings.jsx",
          "./ManageLeaveSettings":
            "./src/components/leaveSettings/ManageLeaveSettings.jsx",

          "./ManageLeaveSchedule":
            "./src/components/leaveSchedule/ManageLeaveSchedule.jsx",
          "./AddLeaveSchedule":
            "./src/components/leaveSchedule/AddLeaveSchedule.jsx",
          "./DeleteLeaveschedule":
            "./src/components/leaveSchedule/DeleteLeaveschedule.jsx",
          "./LeaveScheduleByEmploye":
            "./src/components/leaveSchedule/LeaveScheduleByEmploye.jsx",
          "./UpdateLeaveschedule":
            "./src/components/leaveSchedule/UpdateLeaveschedule.jsx",

          "./AddHolidayMgmt": "./src/components/holidayMgmt/AddHolidayMgmt.jsx",
          "./DetailsHolidayMgmt":
            "./src/components/holidayMgmt/DetailsHolidayMgmt.jsx",
          "./EditHolidayMgmt":
            "./src/components/holidayMgmt/EditHolidayMgmt.jsx",
          "./ManageHolidayMgmt":
            "./src/components/holidayMgmt/ManageHolidayMgmt.jsx",

          "./LeaveBalance": "./src/components/leaveBalance/LeaveBalance.jsx",
          "./CreateLeaveRequest":
            "./src/components/LeaveRequestone/CreateLeaveRequest.jsx",
          "./DeleteLeaveRequest":
            "./src/components/LeaveRequestone/DeleteLeaveRequest.jsx",
          "./LeaveRequestByEmployeeId":
            "./src/components/LeaveRequestone/LeaveRequestByEmployeeId.jsx",
          "./LeaveRequestDepartementApprovance":
            "./src/components/LeaveRequestone/LeaveRequestDepartementApprovance.jsx",
          "./ListLeaveRequest":
            "./src/components/LeaveRequestone/ListLeaveRequest.jsx",
          "./UpdateLeaveRequest":
            "./src/components/LeaveRequestone/UpdateLeaveRequest.jsx",
          "./LeaveRequestHrApprovance":
            "./src/components/LeaveRequestone/LeaveRequestHrApprovance.jsx",
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
      port: parseInt(getEnvVar("LEAVE_SERVICE_PORT", "5006")),
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