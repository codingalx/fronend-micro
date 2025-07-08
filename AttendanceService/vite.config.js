import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";


export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "planning",
      filename: "remoteEntry.js",
      remotes: {
        shell: "http://172.20.136.101:5000/dist/assets/remoteEntry.js",
      },

      exposes: {
        "./CreateShift": "./src/components/Shift/CreateShift.jsx",
        "./UpdateShift": "./src/components/Shift/UpdateShift.jsx",
        "./ListShifts": "./src/components/Shift/ListShifts.jsx",
        "./DeleteShift": "./src/components/Shift/DeleteShift.jsx",

        "./CreateWeekend": "./src/components/Weekend/CreateWeekend.jsx",
        "./UpdateWeekend": "./src/components/Weekend/UpdateWeekend.jsx",
        "./ListDays": "./src/components/Weekend/ListDays.jsx",
        "./DeleteWeekend": "./src/components/Weekend/DeleteWeekend.jsx",
        

        "./CreateTimeTolerance":
          "./src/components/TimeTolerance/CreateTimeTolerance.jsx",
        "./UpdateTimeTolerance":
          "./src/components/TimeTolerance/UpdateTimeTolerance.jsx",
        "./ListTimeTolerance":
          "./src/components/TimeTolerance/ListTimeTolerance.jsx",
        "./DeleteTimeTolerance":
          "./src/components/TimeTolerance/DeleteTimeTolerance.jsx",

        "./CreateOvertime": "./src/components/Overtime/CreateOvertime.jsx",
        "./UpdateOverTime": "./src/components/Overtime/UpdateOverTime.jsx",
        "./ListOvertime": "./src/components/Overtime/ListOvertime.jsx",
        "./DeleteOverTime": "./src/components/Overtime/DeleteOverTime.jsx",


        

        "./CreateExcuse": "./src/components/Excuse/CreateExcuse.jsx",
        "./UpdateExcuse": "./src/components/Excuse/UpdateExcuse.jsx",
        "./ListExcuse": "./src/components/Excuse/ListExcuse.jsx",
        "./DeleteExcuse": "./src/components/Excuse/DeleteExcuse.jsx",

        "./AttendanceApproval":
          "./src/components/AttendaceResult/AttendanceApproval.jsx",
        "./CreateAttendanceResult":
          "./src/components/AttendaceResult/CreateAttendanceResult.jsx",
        "./HrApproval": "./src/components/AttendaceResult/HrApproval.jsx",
        "./EmployeeAttendanceView":
          "./src/components/AttendaceResult/EmployeeAttendanceView.jsx",

         


        "./CreateAttendanceLog":
          "./src/components/AttendanceLog/CreateAttendanceLog.jsx",
          
                    './AppLogin': './src/components/AppLogin.jsx',

      },
      shared: [
        "react",
        "react-dom",
        "@mui/material",
        // '@mui/icons-material',
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
    port: 5016,
    hmr: true,
  },
});
