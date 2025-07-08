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
        name: "EmployeeService",
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {
          "./CreateCountry": "./src/components/Country/CreateCountry.jsx",
          "./DeleteCountry": "./src/components/Country/DeleteCountry.jsx",
          "./ListCountry": "./src/components/Country/ListCountry.jsx",
          "./UpdateCountry": "./src/components/Country/UpdateCountry.jsx",

          "./CreateDutyStation":
            "./src/components/DutyStation/CreateDutyStation.jsx",
          "./ListDutyStation":
            "./src/components/DutyStation/ListDutyStation.jsx",
          "./UpdateDutyStation":
            "./src/components/DutyStation/UpdateDutyStation.jsx",
          "./DeleteDutyStation":
            "./src/components/DutyStation/DeleteDutyStation.jsx",

          "./CreateTitleName": "./src/components/TitleName/CreateTitleName.jsx",
          "./ListTitleName": "./src/components/TitleName/ListTitleName.jsx",
          "./DeleteTitleName": "./src/components/TitleName/DeleteTitleName.jsx",
          "./UpdateTitleName": "./src/components/TitleName/UpdateTitleName.jsx",

          "./CreateLangugaeName":
            "./src/components/LanguageName/CreateLangugaeName.jsx",
          "./ListLanguageName":
            "./src/components/LanguageName/ListLanguageName.jsx",
          "./DeleteLanguageName":
            "./src/components/LanguageName/DeleteLanguageName.jsx",
          "./UpdateLanguageName":
            "./src/components/LanguageName/UpdateLanguageName.jsx",

          "./ListEmployee": "./src/components/Employee/ListEmployee.jsx",
          "./CreateEmployee": "./src/components/Employee/CreateEmployee.jsx",
          "./DeleteEmployee": "./src/components/Employee/DeleteEmployee.jsx",
          "./EditEmployee": "./src/components/Employee/EditEmployee.jsx",
          "./ViewEmployee": "./src/components/Employee/ViewEmployee.jsx",

          "./CreateAddress": "./src/components/Address/CreateAddress.jsx",
          "./ListAddress": "./src/components/Address/ListAddress.jsx",
          "./DeleteAddress": "./src/components/Address/DeleteAddress.jsx",
          "./EditAddress": "./src/components/Address/EditAddress.jsx",

          "./CreateEducation": "./src/components/Education/CreateEducation.jsx",
          "./ListEducation": "./src/components/Education/ListEducation.jsx",
          "./EditEducation": "./src/components/Education/EditEducation.jsx",
          "./DeleteEducation": "./src/components/Education/DeleteEducation.jsx",

          "./EditSkill": "./src/components/Skill/EditSkill.jsx",
          "./CreateSkill": "./src/components/Skill/CreateSkill.jsx",
          "./DeleteSkill": "./src/components/Skill/DeleteSkill.jsx",
          "./ListSkill": "./src/components/Skill/ListSkill.jsx",

          "./CreateTraining": "./src/components/Training/CreateTraining.jsx",
          "./DeleteTraining": "./src/components/Training/DeleteTraining.jsx",
          "./EditTraining": "./src/components/Training/EditTraining.jsx",
          "./ListTraining": "./src/components/Training/ListTraining.jsx",

          "./CreateFamily": "./src/components/Family/CreateFamily.jsx",
          "./DeleteFamily": "./src/components/Family/DeleteFamily.jsx",
          "./EditFamily": "./src/components/Family/EditFamily.jsx",
          "./ListFamily": "./src/components/Family/ListFamily.jsx",

          "./CreateReference": "./src/components/Reference/CreateReference.jsx",
          "./DeleteReference": "./src/components/Reference/DeleteReference.jsx",
          "./EditReference": "./src/components/Reference/EditReference.jsx",
          "./ListReference": "./src/components/Reference/ListReference.jsx",

          "./CreateLanguage": "./src/components/Language/CreateLanguage.jsx",
          "./DeleteLanguage": "./src/components/Language/DeleteLanguage.jsx",
          "./EditLanguage": "./src/components/Language/EditLanguage.jsx",
          "./ListLanguage": "./src/components/Language/ListLanguage.jsx",

          "./ListExperence": "./src/components/Experence/ListExperence.jsx",
          "./CreateExperience":
            "./src/components/Experence/CreateExperience.jsx",
          "./EditExperence": "./src/components/Experence/EditExperence.jsx",
          "./DeleteExperience":
            "./src/components/Experence/DeleteExperience.jsx",
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
      port: parseInt(getEnvVar("EMPLOYEE_SERVICE_PORT", "5001")),
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