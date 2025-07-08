
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
        name: "RecruitmentService", // Replace with your service name
        filename: "remoteEntry.js",
        remotes: {
          shell: getEnvVar("SHELL_URL"),
        },

        exposes: {
          "./CreateRecruitment":
            "./src/components/Recruitment/CreateRecruitment.jsx",
          "./ListRecruitment":
            "./src/components/Recruitment/ListRecruitment.jsx",
          "./DeleteRecruitment":
            "./src/components/Recruitment/DeleteRecruitment.jsx",
          "./EditRecruitment":
            "./src/components/Recruitment/EditRecruitment.jsx",
          "./EditRecruitmentbyapprove":
            "./src/components/Recruitment/EditRecruitmentbyapprove.jsx",

          "./CreateAdvertisment":
            "./src/components/Advertisement/CreateAdvertisment.jsx",
          "./DeleteAdvertisment":
            "./src/components/Advertisement/DeleteAdvertisment.jsx",
          "./ListAdvertisment":
            "./src/components/Advertisement/ListAdvertisment.jsx",
          "./EditAdvertisement":
            "./src/components/Advertisement/EditAdvertisement.jsx",

          "./EditShortListCriterial":
            "./src/components/ShortListCriterial/EditShortListCriterial.jsx",
          "./DeleteShortListCriterial":
            "./src/components/ShortListCriterial/DeleteShortListCriterial.jsx",
          "./ListShortListCriterial":
            "./src/components/ShortListCriterial/ListShortListCriterial.jsx",
          "./CreateShortListCriterial":
            "./src/components/ShortListCriterial/CreateShortListCriterial.jsx",
          "./ShortListCriterialError":
            "./src/components/ShortListCriterial/ShortListCriterialError.jsx",

          "./CreateAssessmentWeight":
            "./src/components/AssessementWeight/CreateAssessementWeight.jsx",
          "./DeleteAssessementWeight":
            "./src/components/AssessementWeight/DeleteAssessementWeight.jsx",
          "./EditAssessementWeight":
            "./src/components/AssessementWeight/EditAssessementWeight.jsx",
          "./ListAssessementWeight":
            "./src/components/AssessementWeight/ListAssessementWeight.jsx",
          "./AssessimentError":
            "./src/components/AssessementWeight/AssessimentError.jsx",

          "./CreateApplicant": "./src/components/Applicant/CreateApplicant.jsx",
          "./DeleteApplicant": "./src/components/Applicant/DeleteApplicant.jsx",
          "./EditApplicant": "./src/components/Applicant/EditApplicant.jsx",
          "./ListApplicant": "./src/components/Applicant/ListApplicant.jsx",

          "./CreateApplicantEducation":
            "./src/components/ApplicantEducation/CreateApplicantEducation.jsx",

          "./DeleteApplicantEducation":
            "./src/components/ApplicantEducation/DeleteApplicantEducation.jsx",
          "./EditApplicantEducation":
            "./src/components/ApplicantEducation/EditApplicantEducation.jsx",

          "./ListApplicantEducation":
            "./src/components/ApplicantEducation/ListApplicantEducation.jsx",

          "./CreateApplicantExperience":
            "./src/components/ApplicantExperience/CreateApplicantExperience.jsx",
          "./EditApplicantExperience":
            "./src/components/ApplicantExperience/EditApplicantExperience.jsx",
          "./DeleteApplicantExperience":
            "./src/components/ApplicantExperience/DeleteApplicantExperience.jsx",

          "./ListApplicantExperience":
            "./src/components/ApplicantExperience/ListApplicantExperience.jsx",

          "./CreateApplicantLanguage":
            "./src/components/ApplicantLanguage/CreateApplicantLanguage.jsx",

          "./DeleteApplicantLanguage":
            "./src/components/ApplicantLanguage/DeleteApplicantLanguage.jsx",

          "./ListApplicantLanguage":
            "./src/components/ApplicantLanguage/ListApplicantLanguage.jsx",

          "./EditApplicantLanguage":
            "./src/components/ApplicantLanguage/EditApplicantLanguage.jsx",

          "./CreateApplicantReference":
            "./src/components/ApplicantReference/CreateApplicantReference.jsx",

          "./DeleteApplicantReference":
            "./src/components/ApplicantReference/DeleteApplicantReference.jsx",
          "./EditApplicantReference":
            "./src/components/ApplicantReference/EditApplicantReference.jsx",
          "./ListApplicantReference":
            "./src/components/ApplicantReference/ListApplicantReference.jsx",

          "./CreateApplicantCertificate":
            "./src/components/ApplicantTraining/CreateApplicantCertificate.jsx",

          "./DeleteApplicantCertificate":
            "./src/components/ApplicantTraining/DeleteApplicantCertificate.jsx",

          "./EditApplicantCertificate":
            "./src/components/ApplicantTraining/EditApplicantCertificate.jsx",

          "./ListApplicantCertificate":
            "./src/components/ApplicantTraining/ListApplicantCertificate.jsx",

          "./CreateExamResult":
            "./src/components/ExamResultOfApplicant/CreateExamResult.jsx",
          "./DeleteApplicantExamResult":
            "./src/components/ExamResultOfApplicant/DeleteApplicantExamResult.jsx",

          "./EditExamResult":
            "./src/components/ExamResultOfApplicant/EditExamResult.jsx",
          "./ListExamResult":
            "./src/components/ExamResultOfApplicant/ListExamResult.jsx",
          "./ApplicantExamResultAlreadyCreated":
            "./src/components/ExamResultOfApplicant/ApplicantExamResultAlreadyCreated.jsx",

          "./CreateMediaType": "./src/components/MediaType/CreateMediaType.jsx",
          "./DeleteMediaType": "./src/components/MediaType/DeleteMediaType.jsx",
          "./UpdateMediaType": "./src/components/MediaType/UpdateMediaType.jsx",
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
      port: parseInt(getEnvVar("RECRUITMENT_SERVICE_PORT", "5002")),
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
