
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
        name: "trainingService", // Replace with your service name
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {
          "./CreateAnnualTrainingPlan":
            "./src/components/AnnualTrainingPlan/CreateAnnualTrainingPlan.jsx",
          "./UpdateAnnualTrainingPlan":
            "./src/components/AnnualTrainingPlan/UpdateAnnualTrainingPlan.jsx",

          "./DeleteAnnualTrainingPlan":
            "./src/components/AnnualTrainingPlan/DeleteAnnualTrainingPlan.jsx",

          "./CraeteTrainingCategory":
            "./src/components/TrainingCategory/CraeteTrainingCategory.jsx",
          "./DeleteTrainingCourseCategory":
            "./src/components/TrainingCategory/DeleteTrainingCourseCategory.jsx",
          "./EditCourseCategory":
            "./src/components/TrainingCategory/EditCourseCategory.jsx",
          "./ListCourseCategory":
            "./src/components/TrainingCategory/ListCourseCategory.jsx",

          "./CreatetrainingCourse":
            "./src/components/TrainingCourse/CreatetrainingCourse.jsx",
          "./ListTrainingCourse":
            "./src/components/TrainingCourse/ListTrainingCourse.jsx",
          "./UpdateTrainingCourse":
            "./src/components/TrainingCourse/UpdateTrainingCourse.jsx",

          "./CreateTraineDocument":
            "./src/components/CheckDocument/CreateTraineDocument.jsx",
          "./DeleteTraineeDocument":
            "./src/components/CheckDocument/DeleteTraineeDocument.jsx",
          "./ListTraineDocument":
            "./src/components/CheckDocument/ListTraineDocument.jsx",
          "./UpdateTraineDocument":
            "./src/components/CheckDocument/UpdateTraineDocument.jsx",

          "./CreateTrainingInstitution":
            "./src/components/Training Institution/CreateTrainingInstitution.jsx",

          "./UpdateTrainingInstution":
            "./src/components/Training Institution/UpdateTrainingInstution.jsx",

          "./ListTrainingInstution":
            "./src/components/Training Institution/ListTrainingInstution.jsx",

          "./DeleteTrainingInstitution":
            "./src/components/Training Institution/DeleteTrainingInstitution.jsx",

          "./CreateAnnualTrainingRequest":
            "./src/components/AnnualTrainingRequest/CreateAnnualTrainingRequest.jsx",
          "./DeleteAnnualTrainingRequest":
            "./src/components/AnnualTrainingRequest/DeleteAnnualTrainingRequest.jsx",
          "./EditAnnualTrainingRequest":
            "./src/components/AnnualTrainingRequest/EditAnnualTrainingRequest.jsx",
          "./ListAnnualTrainingRequest":
            "./src/components/AnnualTrainingRequest/ListAnnualTrainingRequest.jsx",
          "./TrainingStatus":
            "./src/components/AnnualTrainingRequest/TrainingStatus.jsx",

          "./CreateAnnualTrainingTrainingPlan":
            "./src/components/AnnualTrainingRequest/TrainingStatus.jsx",

          "./CreatePreServiceCourse":
            "./src/components/PreServiceCourse/CreatePreServiceCourse.jsx",
          "./DeletePreServiceCourse":
            "./src/components/PreServiceCourse/DeletePreServiceCourse.jsx",
          "./ListOfPresServiceCourse":
            "./src/components/PreServiceCourse/ListOfPresServiceCourse.jsx",
          "./UpdatePreServiceCourse":
            "./src/components/PreServiceCourse/UpdatePreServiceCourse.jsx",

          "./CreatePreserviceCourseType":
            "./src/components/PreServiceCourseCategory/CreatePreserviceCourseType.jsx",

          "./DeletePreserviceCourseType":
            "./src/components/PreServiceCourseCategory/DeletePreserviceCourseType.jsx",
          "./ListPreserviceCourseType":
            "./src/components/PreServiceCourseCategory/ListPreserviceCourseType.jsx",

          "./UpdatePresserviceCourseType":
            "./src/components/PreServiceCourseCategory/UpdatePresserviceCourseType.jsx",

          "./CreateUniversity":
            "./src/components/University/CreateUniversity.jsx",
          "./DeleteUniversity":
            "./src/components/University/DeleteUniversity.jsx",
          "./ListOfUniversity":
            "./src/components/University/ListOfUniversity.jsx",
          "./UpdateUniversity":
            "./src/components/University/UpdateUniversity.jsx",

          "./CreateTrainingparticipant":
            "./src/components/Training participant/CreateTrainingparticipant.jsx",

          "./ListTrainingParticipant":
            "./src/components/Training participant/ListTrainingParticipant.jsx",

          "./UpdateTrainingParticipants":
            "./src/components/Training participant/UpdateTrainingParticipants.jsx",

          "./DeleteTrainingparticipant":
            "./src/components/Training participant/DeleteTrainingparticipant.jsx",

          "./AssignDepartement":
            "./src/components/Student/AssignDepartement.jsx",
          "./CreateInternshipStudents":
            "./src/components/Student/CreateInternshipStudents.jsx",
          "./DeleteInternStudent":
            "./src/components/Student/DeleteInternStudent.jsx",
          "./InternStudentStatus":
            "./src/components/Student/InternStudentStatus.jsx",
          "./ListInternshipStudents":
            "./src/components/Student/ListInternshipStudents.jsx",
          "./UpdateInternshipStudents":
            "./src/components/Student/UpdateInternshipStudents.jsx",

          "./CoursesForTrainee":
            "./src/components/PreServiceTraining/CoursesForTrainee.jsx",
          "./CreatePreServiceTraining":
            "./src/components/PreServiceTraining/CreatePreServiceTraining.jsx",

          "./DeletePreServiceTraining":
            "./src/components/PreServiceTraining/DeletePreServiceTraining.jsx",

          "./ListOfPreserviceTraining":
            "./src/components/PreServiceTraining/ListOfPreserviceTraining.jsx",

          "./UpdatePreServiceTraining":
            "./src/components/PreServiceTraining/UpdatePreServiceTraining.jsx",

          "./CreatePreServiceTraineeResult":
            "./src/components/PreServiceTraineeResult/CreatePreServiceTraineeResult.jsx",

          "./ListPreCourseTraineeResult":
            "./src/components/PreServiceTraineeResult/ListPreCourseTraineeResult.jsx",

          "./UpdatePreServiceCourseTraineeResult":
            "./src/components/PreServiceTraineeResult/UpdatePreServiceCourseTraineeResult.jsx",

          "./DeletePreServiceTraineeResult":
            "./src/components/PreServiceTraineeResult/DeletePreServiceTraineeResult.jsx",

          "./CreateInterbshipPayment":
            "./src/components/InternshipPayment/CreateInterbshipPayment.jsx",
          "./DeleteInternPayment":
            "./src/components/InternshipPayment/DeleteInternPayment.jsx",

          "./ListInternshipPayment":
            "./src/components/InternshipPayment/ListInternshipPayment.jsx",

          "./UpdateInternPayment":
            "./src/components/InternshipPayment/UpdateInternPayment.jsx",

          "./CreateEductionOpportunity":
            "./src/components/Education Opportunity/CreateEducationOpportunity.jsx",

          "./DeleteEducationOpportunity":
            "./src/components/Education Opportunity/DeleteEducationOpportunity.jsx",

          "./ListEducationOpportunity":
            "./src/components/Education Opportunity/ListEducationOpportunity.jsx",

          "./UpdateEductionOpportunity":
            "./src/components/Education Opportunity/UpdateEductionOpportunity.jsx",
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
      port: parseInt(getEnvVar("TRAINING_SERVICE_PORT", "5004")),
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
