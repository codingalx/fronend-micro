
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
        name: "organization", // Replace with your service name
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL") 
          
        },

        exposes: {
          "./CreateTenant": "./src/components/tenant/CreateTenant.jsx",
          "./DetailsTenant": "./src/components/tenant/DetailsTenant.jsx",
          "./ListTenant": "./src/components/tenant/ListTenant.jsx",
          "./EditTenant": "./src/components/tenant/EditTenant.jsx",

          "./DefaultResource": "./src/components/tenant/DefaultResource.jsx",

          "./CreateJobGrade": "./src/components/jobGrade/CreateJobGrade.jsx",
          "./EditJobGrade": "./src/components/jobGrade/EditJobGrade.jsx",
          "./ListJobGrade": "./src/components/jobGrade/ListJobGrade.jsx",

          "./CreateJobCategory":
            "./src/components/jobCategory/CreateJobCategory.jsx",
          "./EditJobCategory":
            "./src/components/jobCategory/EditJobCategory.jsx",
          "./ListJobCategory":
            "./src/components/jobCategory/ListJobCategory.jsx",

          "./CreateWorkUnit": "./src/components/workUnit/CreateWorkUnit.jsx",
          "./EditWorkUnit": "./src/components/workUnit/EditWorkUnit.jsx",
          "./ListWorkUnit": "./src/components/workUnit/ListWorkUnit.jsx",

          "./CreateEducationLevel":
            "./src/components/educationalLevel/CreateEducationLevel.jsx",
          "./ListEducationLevel":
            "./src/components/educationalLevel/ListEducationLevel.jsx",
          "./EditEducationLevel":
            "./src/components/educationalLevel/EditEducationLevel.jsx",

          "./CreateQualification":
            "./src/components/qualification/CreateQualification.jsx",
          "./EditQualification":
            "./src/components/qualification/EditQualification.jsx",
          "./ListQualification":
            "./src/components/qualification/ListQualification.jsx",

          "./CreatePayGrade": "./src/components/payGrade/CreatePayGrade.jsx",
          "./DetailsPayGrade": "./src/components/payGrade/DetailsPayGrade.jsx",
          "./EditPayGrade": "./src/components/payGrade/EditPayGrade.jsx",
          "./ListPayGrade": "./src/components/payGrade/ListPayGrade.jsx",

          "./CreateLocationType":
            "./src/components/locationType/CreateLocationType.jsx",
          "./EditLocationType":
            "./src/components/locationType/EditLocationType.jsx",
          "./ListLocationType":
            "./src/components/locationType/ListLocationType.jsx",

          "./CreateLocation": "./src/components/location/CreateLocation.jsx",
          "./DetailsLocation": "./src/components/location/DetailsLocation.jsx",
          "./EditLocation": "./src/components/location/EditLocation.jsx",
          "./ListLocation": "./src/components/location/ListLocation.jsx",

          "./CreateDepartementType":
            "./src/components/departmentType/CreateDepartementType.jsx",
          "./EditDepartmentType":
            "./src/components/departmentType/EditDepartmentType.jsx",
          "./ListDepartementType":
            "./src/components/departmentType/ListDepartementType.jsx",

          "./AddDepartement": "./src/components/department/AddDepartment.jsx",

          "./ChangeStructure":
            "./src/components/department/ChangeStructure.jsx",
          "./AddAddress": "./src/components/department/AddAddress.jsx",
          "./EditAddres": "./src/components/address/EditAddres.jsx",
          "./DetailsAddress": "./src/components/address/DetailsAddress.jsx",

          "./GetDepartemnet": "./src/components/department/GetDepartemnet.jsx",
          "./CreateJobRegistration":
            "./src/components/jobs/CreateJobRegistration.jsx",
          "./DetailsJobRegistration":
            "./src/components/jobs/DetailsJobRegistration.jsx",
          "./EditJobRegistration":
            "./src/components/jobs/EditJobRegistration.jsx",

          "./AddStaffPlan": "./src/components/department/AddStaffPlan.jsx",
          "./TreeOptional": "./src/components/common/TreeOptional.jsx",

          "./EditStaffPlan": "./src/components/staffPlan/EditStaffPlan.jsx",
          "./DetailsStaffPlan":
            "./src/components/staffPlan/DetailsStaffPlan.jsx",

          "./CreateFieldstudy":
            "./src/components/fieldStudy/CreateFieldstudy.jsx",
          "./UpdateFieldStudy":
            "./src/components/fieldStudy/UpdateFieldStudy.jsx",
          "./DeleteFieldstudy":
            "./src/components/fieldStudy/DeleteFieldstudy.jsx",
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
      port: parseInt(getEnvVar("ORGANIZATION_SERVICE_PORT", "5005")),
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
