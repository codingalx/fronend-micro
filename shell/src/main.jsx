
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import NotFound from "./components/NotFound/NotFound.jsx";
import { AuthProvider } from "./components/Security/AuthContext.jsx";
import ProtectedRoute from "./components/Security/ProtectedRoute.jsx";
import AppLogin from "./components/Security/AppLogin.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import RoleProtectedRoute from "./components/Security/RoleProtectedRoute.jsx";
import AccessDenied from "./components/Security/AccessDenied.jsx";
import EmployeeServiceResourceName from "./components/Security/Resource/EmployeeServiceResourceName.js"
import HrPlanningServiceResourceName from './components/Security/Resource/HrPlanningServiceResourceName .js'
import ErrorBoundary from "./components/NotFound/ErrorBoundary.jsx";
import AddEmployee from "./components/Security/AddEmployee.jsx";
import EditDetails from "./components/Security/EditDetails.jsx";
import Details from "./components/Security/Details.jsx";
import RecruitmentServiceResourceName from './components/Security/Resource/RecruitmentServiceResourceName.js'
import LeaveServiceResourceName from './components/Security/Resource/LeaveServiceResourceName.js'
import OrganizationServiceResourceName from "./components/Security/Resource/OrganizationServiceResourceName.js";
import TrainingServiceResourceName from './components/Security/Resource/TrainingServiceResourceName.js'

import TranferserviceResourseName from './components/Security/Resource/TranferserviceResourseName.js'

import OrganizationTab from "./components/Tabs/OrganizationTab.jsx";
import StructureTab from "./components/Tabs/StructureTab.jsx";
import LeaveInfo from './components/Tabs/LeaveInfo.jsx'
import MoreAboutRecruitment from "./components/Tabs/MoreAboutRecruiment.jsx";
import MoreAboutApplicant from "./components/Tabs/MoreAboutApplicant.jsx";
import AuthServiceResourceName from "./components/Security/Resource/AuthServiceResourceName.js";
import EvaluationServiceResourceName from "./components/Security/Resource/EvaluationServiceResourceName.js";
import EvaluationSetUp from "./components/Tabs/EvaluationSetUp.jsx";
import DelegationServiceResourceName from "./components/Security/Resource/DelegationServiceResourceName.js";
import DocumentionServiceResourceName from "./components/Security/Resource/DocumentionServiceResourceName.js";

import PromotionServiceResourceName from "./components/Security/Resource/PromotionServiceResourceName.js";

import SeparationServiceResourceName from "./components/Security/Resource/SeparationServiceResourceName.js";
import DisciplineServiceResourceName from "./components/Security/Resource/DisciplineServiceResourceName.js";
import ComplaintServiceResourceName from "./components/Security/Resource/ComplaintServiceResourceName.js";
import AttendanceServiceResourceName from "./components/Security/Resource/AttendanceServiceResourceName.js";
import AttendanceSetUp from "./components/Tabs/AttendanceSetUp.jsx";
import ItemServiceResourceName from "./components/Security/Resource/ItemServiceResourceName.js";
import StoreServiceResourceName from "./components/Security/Resource/StoreServiceResourceName.js";
import StoreSetUp from "./components/Tabs/StoreSetUp.jsx";
import StoreMovementServiceResourceName from "./components/Security/Resource/StoreMovementServiceResourceName .js";
import FixedAssetServiceResourceName from "./components/Security/Resource/FixedAssetServiceResourceName.js";



const ListCounty = React.lazy(() => import('EmployeeService/ListCounty').catch(() => ({
  default: () => <div>Failed to load ListCounty</div>
})));

const CreateCountry = React.lazy(() => import('EmployeeService/CreateCountry').catch(() => ({
  default: () => <div>Failed to load CreateCountry </div>
})));

const DeleteCountry = React.lazy(() => import('EmployeeService/DeleteCountry').catch(() => ({
  default: () => <div>Failed to load DeleteCountry</div>
})));

const UpdateCountry = React.lazy(() => import('EmployeeService/UpdateCountry').catch(() => ({
  default: () => <div>Failed to load Update</div>
})));

const CreateDutyStation = React.lazy(() => import('EmployeeService/CreateDutyStation').catch(() => ({
  default: () => <div>Failed to load Update Country</div>
})));

const UpdateDutyStation = React.lazy(() => import('EmployeeService/UpdateDutyStation').catch(() => ({
  default: () => <div>Failed to load Update Country</div>
})));


const DeleteDutyStation = React.lazy(() => import('EmployeeService/DeleteDutyStation').catch(() => ({
  default: () => <div>Failed to load Update Country</div>
})));

const CreateTitleName = React.lazy(() => import('EmployeeService/CreateTitleName').catch(() => ({
  default: () => <div>Failed to load Create Title Name</div>
})));

const DeleteTitleName = React.lazy(() => import('EmployeeService/DeleteTitleName').catch(() => ({
  default: () => <div>Failed to load Delete Title Name</div>
})));

const ListTitleName = React.lazy(() => import('EmployeeService/ListTitleName').catch(() => ({
  default: () => <div>Failed to load List Title Name</div>
})));

const UpdateTitleName = React.lazy(() => import('EmployeeService/UpdateTitleName').catch(() => ({
  default: () => <div>Failed to load Update Title Name</div>
})));



const CreateLangugaeName = React.lazy(() => import('EmployeeService/CreateLangugaeName').catch(() => ({
  default: () => <div>Failed to load Update Language Name</div>
})));
const ListLanguageName = React.lazy(() => import('EmployeeService/ListLanguageName').catch(() => ({
  default: () => <div>Failed to load Update Language Name</div>
})));
const DeleteLanguageName = React.lazy(() => import('EmployeeService/DeleteLanguageName').catch(() => ({
  default: () => <div>Failed to load Update Language Name</div>
})));

const UpdateLanguageName = React.lazy(() => import('EmployeeService/UpdateLanguageName').catch(() => ({
  default: () => <div>Failed to load Update Language Name</div>
})));

const ListEmployee = React.lazy(() => import('EmployeeService/ListEmployee').catch(() => ({
  default: () => <div>Failed to load  list Of Employee</div>
})));
const CreateEmployee = React.lazy(() => import('EmployeeService/CreateEmployee').catch(() => ({
  default: () => <div>Failed to load  Create Employee</div>
})));

const DeleteEmployee = React.lazy(() => import('EmployeeService/DeleteEmployee').catch(() => ({
  default: () => <div>Failed to load  Delete Employee</div>
})));


const EditEmployee = React.lazy(() => import('EmployeeService/EditEmployee').catch(() => ({
  default: () => <div>Failed to load  Update Employee</div>
})));



const CreateAddress = React.lazy(() => import('EmployeeService/CreateAddress').catch(() => ({
  default: () => <div>Failed to load  Create address</div>
})));

const DeleteAddress = React.lazy(() => import('EmployeeService/DeleteAddress').catch(() => ({
  default: () => <div>Failed to load  Delete Address</div>
})));

const EditAddress = React.lazy(() => import('EmployeeService/EditAddress').catch(() => ({
  default: () => <div>Failed to load  Update Address</div>
})));

const ListAddress = React.lazy(() => import('EmployeeService/ListAddress').catch(() => ({
  default: () => <div>Failed to load  List Address</div>
})));


const CreateSkill = React.lazy(() => import('EmployeeService/CreateSkill').catch(() => ({
  default: () => <div>Failed to load  Create Skill</div>
})));

const ListSkill = React.lazy(() => import('EmployeeService/ListSkill').catch(() => ({
  default: () => <div>Failed to load  List Skill</div>
})));

const DeleteSkill = React.lazy(() => import('EmployeeService/DeleteSkill').catch(() => ({
  default: () => <div>Failed to load  Delete Skill</div>
})));

const EditSkill = React.lazy(() => import('EmployeeService/EditSkill').catch(() => ({
  default: () => <div>Failed to load  Update  Skill</div>
})));


const EditTraining = React.lazy(() => import('EmployeeService/EditTraining').catch(() => ({
  default: () => <div>Failed to load  Update  training</div>
})));

const DeleteTraining = React.lazy(() => import('EmployeeService/DeleteTraining').catch(() => ({
  default: () => <div>Failed to load  delete training</div>
})));

const EditFamily = React.lazy(() => import('EmployeeService/EditFamily').catch(() => ({
  default: () => <div>Failed to load  update family</div>
})));

const DeleteFamily = React.lazy(() => import('EmployeeService/DeleteFamily').catch(() => ({
  default: () => <div>Failed to load  delete family</div>
})));


const EditReference = React.lazy(() => import('EmployeeService/EditReference').catch(() => ({
  default: () => <div>Failed to load  update refernce</div>
})));

const DeleteReference = React.lazy(() => import('EmployeeService/DeleteReference').catch(() => ({
  default: () => <div>Failed to load  delete refernce</div>
})));


const DeleteLanguage = React.lazy(() => import('EmployeeService/DeleteLanguage').catch(() => ({
  default: () => <div>Failed to load  delete language</div>
})));

const EditLanguage = React.lazy(() => import('EmployeeService/EditLanguage').catch(() => ({
  default: () => <div>Failed to load  update language</div>
})));

const DeleteExperience = React.lazy(() => import('EmployeeService/DeleteExperience').catch(() => ({
  default: () => <div>Failed to load  delete experience</div>
})));

const EditExperence = React.lazy(() => import('EmployeeService/EditExperence').catch(() => ({
  default: () => <div>Failed to load  update experience</div>
})));

const EditEducation = React.lazy(() => import('EmployeeService/EditEducation').catch(() => ({
  default: () => <div>Failed to load  update education</div>
})));

const DeleteEducation = React.lazy(() => import('EmployeeService/DeleteEducation').catch(() => ({
  default: () => <div>Failed to load  delete education</div>
})));

const CreateRecruitment = React.lazy(() => import('RecruitmentService/CreateRecruitment').catch(() => ({
  default: () => <div>Failed to load  create Recruitment </div>
})));

const ListRecruitment = React.lazy(() => import('RecruitmentService/ListRecruitment').catch(() => ({
  default: () => <div>Failed to load  List Recruitment </div>
})));


const DeleteRecruitment = React.lazy(() => import('RecruitmentService/DeleteRecruitment').catch(() => ({
  default: () => <div>Failed to load  delete Recruitment </div>
})));

const EditRecruitment = React.lazy(() => import('RecruitmentService/EditRecruitment').catch(() => ({
  default: () => <div>Failed to load  edit Recruitment </div>
})));

const EditRecruitmentbyapprove = React.lazy(() => import('RecruitmentService/EditRecruitmentbyapprove').catch(() => ({
  default: () => <div>Failed to load   Recruitment approvance </div>
})));

const EditShortListCriterial = React.lazy(() => import('RecruitmentService/EditShortListCriterial').catch(() => ({
  default: () => <div>Failed to load   Edit short list criterial </div>
})));

const CreateMediaType = React.lazy(() => import('RecruitmentService/CreateMediaType').catch(() => ({
  default: () => <div>Failed to load   create media type </div>
})));

const UpdateMediaType = React.lazy(() => import('RecruitmentService/UpdateMediaType').catch(() => ({
  default: () => <div>Failed to load   update media type </div>
})));

const DeleteMediaType = React.lazy(() => import('RecruitmentService/DeleteMediaType').catch(() => ({
  default: () => <div>Failed to load   delete media type </div>
})));






const ShortListCriterialError = React.lazy(() => import('RecruitmentService/ShortListCriterialError').catch(() => ({
  default: () => <div>Failed to load  this page </div>
})));

const DeleteShortListCriterial = React.lazy(() => import('RecruitmentService/DeleteShortListCriterial').catch(() => ({
  default: () => <div>Failed to load   Delete short list criterial </div>
})));

const EditAssessementWeight = React.lazy(() => import('RecruitmentService/EditAssessementWeight').catch(() => ({
  default: () => <div>Failed to load   update assessigment weight </div>
})));
const DeleteAssessementWeight = React.lazy(() => import('RecruitmentService/DeleteAssessementWeight').catch(() => ({
  default: () => <div>Failed to load   Delete assessigment weight </div>
})));
const AssessimentError = React.lazy(() => import('RecruitmentService/AssessimentError').catch(() => ({
  default: () => <div>Failed to load  this page please check it </div>
})));

const EditAdvertisement = React.lazy(() => import('RecruitmentService/EditAdvertisement').catch(() => ({
  default: () => <div>Failed to load  this page please check it </div>
})));
const DeleteAdvertisment = React.lazy(() => import('RecruitmentService/DeleteAdvertisment').catch(() => ({
  default: () => <div>Failed to load  this page please check it </div>
})));

const EditApplicant = React.lazy(() => import('RecruitmentService/EditApplicant').catch(() => ({
  default: () => <div>Failed to load update Applicant pages </div>
})));


const EditApplicantEducation = React.lazy(() => import('RecruitmentService/EditApplicantEducation').catch(() => ({
  default: () => <div>Failed to load update Applicant education </div>
})));
const DeleteApplicantEducation = React.lazy(() => import('RecruitmentService/DeleteApplicantEducation').catch(() => ({
  default: () => <div>Failed to load delete Applicant education </div>
})));

const EditApplicantCertificate = React.lazy(() => import('RecruitmentService/EditApplicantCertificate').catch(() => ({
  default: () => <div>Failed to load edit Applicant certificate </div>
})));

const DeleteApplicantCertificate = React.lazy(() => import('RecruitmentService/DeleteApplicantCertificate').catch(() => ({
  default: () => <div>Failed to load delete Applicant certificate </div>
})));

const DeleteApplicantExperience = React.lazy(() => import('RecruitmentService/DeleteApplicantExperience').catch(() => ({
  default: () => <div>Failed to load delete Applicant experience </div>
})));

const EditApplicantExperience = React.lazy(() => import('RecruitmentService/EditApplicantExperience').catch(() => ({
  default: () => <div>Failed to load edit Applicant experience </div>
})));

const DeleteApplicantLanguage = React.lazy(() => import('RecruitmentService/DeleteApplicantLanguage').catch(() => ({
  default: () => <div>Failed to load delete Applicant language </div>
})));

const EditApplicantLanguage = React.lazy(() => import('RecruitmentService/EditApplicantLanguage').catch(() => ({
  default: () => <div>Failed to load edit Applicant language </div>
})));

const EditApplicantReference = React.lazy(() => import('RecruitmentService/EditApplicantReference').catch(() => ({
  default: () => <div>Failed to load edit Applicant refernce </div>
})));

const DeleteApplicantReference = React.lazy(() => import('RecruitmentService/DeleteApplicantReference').catch(() => ({
  default: () => <div>Failed to load delete Applicant refernce </div>
})));

const CreateExamResult = React.lazy(() => import('RecruitmentService/CreateExamResult').catch(() => ({
  default: () => <div>Failed to load create Exam result </div>
})));

const EditExamResult = React.lazy(() => import('RecruitmentService/EditExamResult').catch(() => ({
  default: () => <div>Failed to load update Exam result </div>
})));

const DeleteApplicantExamResult = React.lazy(() => import('RecruitmentService/DeleteApplicantExamResult').catch(() => ({
  default: () => <div>Failed to load delete applicant Exam result </div>
})));



const DeleteApplicant = React.lazy(() => import('RecruitmentService/DeleteApplicant').catch(() => ({
  default: () => <div>Failed to load delete applicant pages </div>
})));






//planning
const CreateNeedRequest = React.lazy(() => import('planning/CreateNeedRequest').catch(() => ({
  default: () => <div>Failed to load  create need request </div>
})));

const DeleteNeedRequest = React.lazy(() => import('planning/DeleteNeedRequest').catch(() => ({
  default: () => <div>Failed to load  delete need request </div>
})));

const EditNeedRequest = React.lazy(() => import('planning/EditNeedRequest').catch(() => ({
  default: () => <div>Failed to load  update need request </div>
})));

const ListNeedRequest = React.lazy(() => import('planning/ListNeedRequest').catch(() => ({
  default: () => <div>Failed to load  list need request </div>
})));
const CreateHrAnalisis = React.lazy(() => import('planning/CreateHrAnalisis').catch(() => ({
  default: () => <div>Failed to load  create HrAnalsis </div>
})));
const DeleteHrAnalisis = React.lazy(() => import('planning/DeleteHrAnalisis').catch(() => ({
  default: () => <div>Failed to load  delete HrAnalsis </div>
})));

// const ListHrAnalisis = React.lazy(() => import('planning/ListHrAnalisis').catch(() => ({ 
//   default: () => <div>Failed to load  list HrAnalsis </div> 
// })));

const UpdateHrAnalisis = React.lazy(() => import('planning/UpdateHrAnalisis').catch(() => ({
  default: () => <div>Failed to load  update HrAnalsis </div>
})));

const UpdateAnnualRecruitmentPromotion = React.lazy(() => import('planning/UpdateAnnualRecruitmentPromotion').catch(() => ({
  default: () => <div>Failed to load  update Annual Recruitment prromotion </div>
})));

const DeleteAnnualRecruitmentPromotion = React.lazy(() => import('planning/DeleteAnnualRecruitmentPromotion').catch(() => ({
  default: () => <div>Failed to load  delet  Annual Recruitment prromotion </div>
})));

const CreateAnnualRecruitmentPromotion = React.lazy(() => import('planning/CreateAnnualRecruitmentPromotion').catch(() => ({
  default: () => <div>Failed to load  create  Annual Recruitment prromotion </div>
})));

const CreateTenant = React.lazy(() => import('organization/CreateTenant').catch(() => ({
  default: () => <div>Failed to load  create tenanat </div>
})));

const ListTenant = React.lazy(() => import('organization/ListTenant').catch(() => ({
  default: () => <div>Failed to load  list tenanat </div>
})));

const DetailsTenant = React.lazy(() => import('organization/DetailsTenant').catch(() => ({
  default: () => <div>Failed to load  details tenanat </div>
})));

const EditTenant = React.lazy(() => import('organization/EditTenant').catch(() => ({
  default: () => <div>Failed to load  edit tenant tenanat </div>
})));
const DefaultResource = React.lazy(() => import('organization/DefaultResource').catch(() => ({
  default: () => <div>Failed to load  default resourse add </div>
})));
const ListUsers = React.lazy(() => import('userService/ListUsers').catch(() => ({
  default: () => <div>Failed to load  List Users </div>
})));
const ManageTenantRole = React.lazy(() => import('userService/ManageTenantRole').catch(() => ({
  default: () => <div>Failed to load  manage tenant resourse </div>
})));


const AddNewuser = React.lazy(() => import('userService/AddNewuser').catch(() => ({
  default: () => <div>Failed to load  add new user </div>
})));

const UpdateUsersRole = React.lazy(() => import('userService/UpdateUsersRole').catch(() => ({
  default: () => <div>Failed to load  update user roles </div>
})));

const ResetPassWord = React.lazy(() => import('userService/ResetPassWord').catch(() => ({
  default: () => <div>Failed to load  reset password </div>
})));

const ListResourseName = React.lazy(() => import('userService/ListResourseName').catch(() => ({
  default: () => <div>Failed to load  list of resourse name </div>
})));



const EditJobGrade = React.lazy(() => import('organization/EditJobGrade').catch(() => ({
  default: () => <div>Failed to load  update jongrade </div>
})));

const EditJobCategory = React.lazy(() => import('organization/EditJobCategory').catch(() => ({
  default: () => <div>Failed to load  update jopb category </div>
})));

const EditWorkUnit = React.lazy(() => import('organization/EditWorkUnit').catch(() => ({
  default: () => <div>Failed to load  update work unit </div>
})));

const UpdateFieldStudy = React.lazy(() => import('organization/UpdateFieldStudy').catch(() => ({
  default: () => <div>Failed to load  update field of study </div>
})));
const DeleteFieldstudy = React.lazy(() => import('organization/DeleteFieldstudy').catch(() => ({
  default: () => <div>Failed to load  delete field of study </div>
})));
const EditEducationLevel = React.lazy(() => import('organization/EditEducationLevel').catch(() => ({
  default: () => <div>Failed to load  update work unit </div>
})));
const EditQualification = React.lazy(() => import('organization/EditQualification').catch(() => ({
  default: () => <div>Failed to load  update qualification </div>
})));

const EditPayGrade = React.lazy(() => import('organization/EditPayGrade').catch(() => ({
  default: () => <div>Failed to load  update pay grade </div>
})));

const EditLocationType = React.lazy(() => import('organization/EditLocationType').catch(() => ({
  default: () => <div>Failed to load  update location type </div>
})));

const EditLocation = React.lazy(() => import('organization/EditLocation').catch(() => ({
  default: () => <div>Failed to load  update location </div>
})));

const DetailsLocation = React.lazy(() => import('organization/DetailsLocation').catch(() => ({
  default: () => <div>Failed to load  details location </div>
})));

const EditDepartmentType = React.lazy(() => import('organization/EditDepartmentType').catch(() => ({
  default: () => <div>Failed to load  update departement type </div>
})));

const EditAddres = React.lazy(() => import('organization/EditAddres').catch(() => ({
  default: () => <div>Failed to load  update address </div>
})));

const DetailsJobRegistration = React.lazy(() => import('organization/DetailsJobRegistration').catch(() => ({
  default: () => <div>Failed to load  update job registraion </div>
})));
const EditJobRegistration = React.lazy(() => import('organization/EditJobRegistration').catch(() => ({
  default: () => <div>Failed to load  update job registraion </div>
})));

const EditStaffPlan = React.lazy(() => import('organization/EditStaffPlan').catch(() => ({
  default: () => <div>Failed to load  update staff plan </div>
})));

const DetailsAddress = React.lazy(() => import('organization/DetailsAddress').catch(() => ({
  default: () => <div>Failed to load  details address </div>
})));



//Leave calling

const EditBudgetYear = React.lazy(() => import('leaveService/EditBudgetYear').catch(() => ({
  default: () => <div>Failed to load update budget year </div>
})));


const DetailsBudgetYear = React.lazy(() => import('leaveService/DetailsBudgetYear').catch(() => ({
  default: () => <div>Failed to load  deatail budget year </div>
})));


const DetailsHoliday = React.lazy(() => import('leaveService/DetailsHoliday').catch(() => ({
  default: () => <div>Failed to load  deatail budget year </div>
})));


const EditHoliday = React.lazy(() => import('leaveService/EditHoliday').catch(() => ({
  default: () => <div>Failed to load  holiday </div>
})));

const DetailsHolidayMgmt = React.lazy(() => import('leaveService/DetailsHolidayMgmt').catch(() => ({
  default: () => <div>Failed to load  details holiday management </div>
})));

const EditHolidayMgmt = React.lazy(() => import('leaveService/EditHolidayMgmt').catch(() => ({
  default: () => <div>Failed to load  update holiday managemant </div>
})));

const DetailsLeaveType = React.lazy(() => import('leaveService/DetailsLeaveType').catch(() => ({
  default: () => <div>Failed to load  update leave type </div>
})));

const EditLeaveType = React.lazy(() => import('leaveService/EditLeaveType').catch(() => ({
  default: () => <div>Failed to load  load update leave type </div>
})));

const DetailsLeaveSettings = React.lazy(() => import('leaveService/DetailsLeaveSettings').catch(() => ({
  default: () => <div>Failed to load  load details leave setting  </div>
})));

const EditLeaveSettings = React.lazy(() => import('leaveService/EditLeaveSettings').catch(() => ({
  default: () => <div>Failed to load  load update leave setting </div>
})));

const AddLeaveSchedule = React.lazy(() => import('leaveService/AddLeaveSchedule').catch(() => ({
  default: () => <div>Failed to load  load update leave schedule </div>
})));
const DeleteLeaveschedule = React.lazy(() => import('leaveService/DeleteLeaveschedule').catch(() => ({
  default: () => <div>Failed to load  load delete leave schedule </div>
})));
const UpdateLeaveschedule = React.lazy(() => import('leaveService/UpdateLeaveschedule').catch(() => ({
  default: () => <div>Failed to load  load update leave schedule </div>
})));


const CreateLeaveRequest = React.lazy(() => import('leaveService/CreateLeaveRequest').catch(() => ({
  default: () => <div>Failed to load  load create leave request </div>
})));

const DeleteLeaveRequest = React.lazy(() => import('leaveService/DeleteLeaveRequest').catch(() => ({
  default: () => <div>Failed to load  load delete leave request </div>

})));
const UpdateLeaveRequest = React.lazy(() => import('leaveService/UpdateLeaveRequest').catch(() => ({
  default: () => <div>Failed to load  load update leave request </div>
})));

const LeaveRequestDepartementApprovance = React.lazy(() => import('leaveService/LeaveRequestDepartementApprovance').catch(() => ({
  default: () => <div>Failed to load  load leave request departement approvance </div>
})));

const LeaveRequestHrApprovance = React.lazy(() => import('leaveService/LeaveRequestHrApprovance').catch(() => ({
  default: () => <div>Failed to load  load update request departement hr approvence  </div>
})));

const LeaveBalance = React.lazy(() => import('leaveService/LeaveBalance').catch(() => ({
  default: () => <div>Failed to load  load leave request </div>
})));
//training calling

const CraeteTrainingCategory = React.lazy(() => import('trainingservice/CraeteTrainingCategory').catch(() => ({
  default: () => <div>Failed to load  load training category </div>
})));

const DeleteTrainingCourseCategory = React.lazy(() => import('trainingservice/DeleteTrainingCourseCategory').catch(() => ({
  default: () => <div>Failed to load  load delete training category </div>
})));

const EditCourseCategory = React.lazy(() => import('trainingservice/EditCourseCategory').catch(() => ({
  default: () => <div>Failed to load  load edit  training category </div>
})));

const CreatetrainingCourse = React.lazy(() => import('trainingservice/CreatetrainingCourse').catch(() => ({
  default: () => <div>Failed to load  load edit  training course </div>
})));

const UpdateTrainingCourse = React.lazy(() => import('trainingservice/UpdateTrainingCourse').catch(() => ({
  default: () => <div>Failed to load  load edit  training course </div>
})));

const CreateTraineDocument = React.lazy(() => import('trainingservice/CreateTraineDocument').catch(() => ({
  default: () => <div>Failed to load  load create  trainee document </div>
})));

const UpdateTraineDocument = React.lazy(() => import('trainingservice/UpdateTraineDocument').catch(() => ({
  default: () => <div>Failed to load  load update  trainee document </div>
})));

const DeleteTraineeDocument = React.lazy(() => import('trainingservice/DeleteTraineeDocument').catch(() => ({
  default: () => <div>Failed to load  load delete  trainee document </div>
})));

const CreateTrainingInstitution = React.lazy(() => import('trainingservice/CreateTrainingInstitution').catch(() => ({
  default: () => <div>Failed to load  load create  training instution</div>
})));

const DeleteTrainingInstitution = React.lazy(() => import('trainingservice/DeleteTrainingInstitution').catch(() => ({
  default: () => <div>Failed to load  load delete  training instution</div>
})));

const UpdateTrainingInstution = React.lazy(() => import('trainingservice/UpdateTrainingInstution').catch(() => ({
  default: () => <div>Failed to load  load update  training instution</div>
})));

const CreateAnnualTrainingRequest = React.lazy(() => import('trainingservice/CreateAnnualTrainingRequest').catch(() => ({
  default: () => <div>Failed to load  load annual training request</div>
})));
const EditAnnualTrainingRequest = React.lazy(() => import('trainingservice/EditAnnualTrainingRequest').catch(() => ({
  default: () => <div>Failed to load  load update annual training request</div>
})));

const DeleteAnnualTrainingRequest = React.lazy(() => import('trainingservice/DeleteAnnualTrainingRequest').catch(() => ({
  default: () => <div>Failed to load  load delete annual training request</div>
})));
const TrainingStatus = React.lazy(() => import('trainingservice/TrainingStatus').catch(() => ({
  default: () => <div>Failed to load  load training status annual training request</div>
})));

const CreateAnnualTrainingPlan = React.lazy(() => import('trainingservice/CreateAnnualTrainingPlan').catch(() => ({
  default: () => <div>Failed to load  load create annual training plan</div>
})));

const UpdateAnnualTrainingPlan = React.lazy(() => import('trainingservice/UpdateAnnualTrainingPlan').catch(() => ({
  default: () => <div>Failed to load  load update annual training plan</div>
})));

const DeleteAnnualTrainingPlan = React.lazy(() => import('trainingservice/DeleteAnnualTrainingPlan').catch(() => ({
  default: () => <div>Failed to load  load delete annual training plan</div>
})));

const CreatePreserviceCourseType = React.lazy(() => import('trainingservice/CreatePreserviceCourseType').catch(() => ({
  default: () => <div>Failed to load  load create preservice course type</div>
})));

const UpdatePresserviceCourseType = React.lazy(() => import('trainingservice/UpdatePresserviceCourseType').catch(() => ({
  default: () => <div>Failed to load  load update preservice course type</div>
})));

const DeletePreserviceCourseType = React.lazy(() => import('trainingservice/DeletePreserviceCourseType').catch(() => ({
  default: () => <div>Failed to load  load delete preservice course type</div>
})));

const CreatePreServiceCourse = React.lazy(() => import('trainingservice/CreatePreServiceCourse').catch(() => ({
  default: () => <div>Failed to load  load create preservice course </div>
})));

const UpdatePreServiceCourse = React.lazy(() => import('trainingservice/UpdatePreServiceCourse').catch(() => ({
  default: () => <div>Failed to load  load update preservice course </div>
})));

const DeletePreServiceCourse = React.lazy(() => import('trainingservice/DeletePreServiceCourse').catch(() => ({
  default: () => <div>Failed to load  load delete preservice course </div>
})));

const CreatePreServiceTraining = React.lazy(() => import('trainingservice/CreatePreServiceTraining').catch(() => ({
  default: () => <div>Failed to load  load create preservice training </div>
})));

const UpdatePreServiceTraining = React.lazy(() => import('trainingservice/UpdatePreServiceTraining').catch(() => ({
  default: () => <div>Failed to load  load update preservice training </div>
})));

const DeletePreServiceTraining = React.lazy(() => import('trainingservice/DeletePreServiceTraining').catch(() => ({
  default: () => <div>Failed to load  load delete preservice training </div>
})));

const CreateUniversity = React.lazy(() => import('trainingservice/CreateUniversity').catch(() => ({
  default: () => <div>Failed to load  load create univeristy </div>
})));

const UpdateUniversity = React.lazy(() => import('trainingservice/UpdateUniversity').catch(() => ({
  default: () => <div>Failed to load  load update univeristy </div>
})));

const DeleteUniversity = React.lazy(() => import('trainingservice/DeleteUniversity').catch(() => ({
  default: () => <div>Failed to load  load delete univeristy </div>
})));

const CreateInternshipStudents = React.lazy(() => import('trainingservice/CreateInternshipStudents').catch(() => ({
  default: () => <div>Failed to load  load create interniship students </div>
})));

const UpdateInternshipStudents = React.lazy(() => import('trainingservice/UpdateInternshipStudents').catch(() => ({
  default: () => <div>Failed to load  load update interniship students </div>
})));

const DeleteInternStudent = React.lazy(() => import('trainingservice/DeleteInternStudent').catch(() => ({
  default: () => <div>Failed to load  load delete interniship students </div>
})));

const InternStudentStatus = React.lazy(() => import('trainingservice/InternStudentStatus').catch(() => ({
  default: () => <div>Failed to load  load  interniship students status </div>
})));

const AssignDepartement = React.lazy(() => import('trainingservice/AssignDepartement').catch(() => ({
  default: () => <div>Failed to load  load  assign interniship students  </div>
})));

const CreateInterbshipPayment = React.lazy(() => import('trainingservice/CreateInterbshipPayment').catch(() => ({
  default: () => <div>Failed to load  load  create intersnship paymenet  </div>
})));
const ListInternshipPayment = React.lazy(() => import('trainingservice/ListInternshipPayment').catch(() => ({
  default: () => <div>Failed to load  load  list intersnship paymenet  </div>
})));


const DeleteInternPayment = React.lazy(() => import('trainingservice/DeleteInternPayment').catch(() => ({
  default: () => <div>Failed to load  load  delete intersnship paymenet  </div>
})));
const UpdateInternPayment = React.lazy(() => import('trainingservice/UpdateInternPayment').catch(() => ({
  default: () => <div>Failed to load  load  update intersnship paymenet  </div>
})));

const CreateEductionOpportunity = React.lazy(() => import('trainingservice/CreateEductionOpportunity').catch(() => ({
  default: () => <div>Failed to load  load  create education opportunity  </div>
})));

const UpdateEductionOpportunity = React.lazy(() => import('trainingservice/UpdateEductionOpportunity').catch(() => ({
  default: () => <div>Failed to load  load  update education opportunity  </div>
})));

const DeleteEducationOpportunity = React.lazy(() => import('trainingservice/DeleteEducationOpportunity').catch(() => ({
  default: () => <div>Failed to load  load  delete education opportunity  </div>
})));

const CreateTrainingparticipant = React.lazy(() => import('trainingservice/CreateTrainingparticipant').catch(() => ({
  default: () => <div>Failed to load  load  create training particiapant  </div>
})));

const UpdateTrainingParticipants = React.lazy(() => import('trainingservice/UpdateTrainingParticipants').catch(() => ({
  default: () => <div>Failed to load  load  update training particiapant  </div>
})));

const DeleteTrainingparticipant = React.lazy(() => import('trainingservice/DeleteTrainingparticipant').catch(() => ({
  default: () => <div>Failed to load  load  delete training particiapant  </div>
})));

//evaluation

const UpdateCategory = React.lazy(() => import('evaluationService/UpdateCategory').catch(() => ({
  default: () => <div>Failed to load  load   category page  </div>
})));
const DeleteCategory = React.lazy(() => import('evaluationService/DeleteCategory').catch(() => ({
  default: () => <div>Failed to load  load   category page  </div>
})));

const DeleteCriterial = React.lazy(() => import('evaluationService/DeleteCriterial').catch(() => ({
  default: () => <div>Failed to load  load   criterial page  </div>
})));
const UpdateCriterial = React.lazy(() => import('evaluationService/UpdateCriterial').catch(() => ({
  default: () => <div>Failed to load  load   criterial page  </div>
})));

const UpdateSession = React.lazy(() => import('evaluationService/UpdateSession').catch(() => ({
  default: () => <div>Failed to load  load   session page  </div>
})));
const DeleteSession = React.lazy(() => import('evaluationService/DeleteSession').catch(() => ({
  default: () => <div>Failed to load  load   session page  </div>
})));

const DeleteLevel = React.lazy(() => import('evaluationService/DeleteLevel').catch(() => ({
  default: () => <div>Failed to load  load   level page  </div>
})));

const UpdateLevel = React.lazy(() => import('evaluationService/UpdateLevel').catch(() => ({
  default: () => <div>Failed to load  load   level page  </div>
})));

const CreateResult = React.lazy(() => import('evaluationService/CreateResult').catch(() => ({
  default: () => <div>Failed to load  load   result page  </div>
})));

const DeleteResult = React.lazy(() => import('evaluationService/DeleteResult').catch(() => ({
  default: () => <div>Failed to load  load   result page  </div>
})));

const UpdateResult = React.lazy(() => import('evaluationService/UpdateResult').catch(() => ({
  default: () => <div>Failed to load  load   result page  </div>
})));


const CreateDelegation = React.lazy(() => import('delegationService/CreateDelegation').catch(() => ({
  default: () => <div>Failed to load  load   delegation  page  </div>
})));

const DeleteDelegation = React.lazy(() => import('delegationService/DeleteDelegation').catch(() => ({
  default: () => <div>Failed to load  load   delegation delete  page  </div>
})));
const UpdateDelegation = React.lazy(() => import('delegationService/UpdateDelegation').catch(() => ({
  default: () => <div>Failed to load  load   delegation termination  page  </div>
})));

const ListDelegation = React.lazy(() => import('delegationService/ListDelegation').catch(() => ({
  default: () => <div>Failed to load  load   delegation list  page  </div>
})));

const TerminateDelegation = React.lazy(() => import('delegationService/TerminateDelegation').catch(() => ({
  default: () => <div>Failed to load  load   delegation   page  </div>
})));

const CreateDocumentType = React.lazy(() => import('documentService/CreateDocumentType').catch(() => ({
  default: () => <div>Failed to load  load  create document type   page  </div>
})));
const UpdateDocumentType = React.lazy(() => import('documentService/UpdateDocumentType').catch(() => ({
  default: () => <div>Failed to load  load  update document type   page  </div>
})));
const DeleteDocumentType = React.lazy(() => import('documentService/DeleteDocumentType').catch(() => ({
  default: () => <div>Failed to load  load  delete  document type   page  </div>
})));
const DocumentApprovance = React.lazy(() => import('documentService/DocumentApprovance').catch(() => ({
  default: () => <div>Failed to load  load  Decision  document    page  </div>
})));

const GenerateDocument = React.lazy(() => import('documentService/GenerateDocument').catch(() => ({
  default: () => <div>Failed to load  load  Generate  document   page  </div>
})));




const CreateDocument = React.lazy(() => import('documentService/CreateDocument').catch(() => ({
  default: () => <div>Failed to load  load  delete  document   page  </div>
})));

const ListDocument = React.lazy(() => import('documentService/ListDocument').catch(() => ({
  default: () => <div>Failed to load  load  list  document   page  </div>
})));

const UpdateDocument = React.lazy(() => import('documentService/UpdateDocument').catch(() => ({
  default: () => <div>Failed to load  load  update  document   page  </div>
})));

const DeleteDocument = React.lazy(() => import('documentService/DeleteDocument').catch(() => ({
  default: () => <div>Failed to load  load  delete  document   page  </div>
})));

//promotion

const CreateName = React.lazy(() => import('promotionService/CreateName').catch(() => ({
  default: () => <div>Failed to load  load  create  promotion   page  </div>
})));

const DeleteCriteria = React.lazy(() => import('promotionService/DeleteCriteria').catch(() => ({
  default: () => <div>Failed to load  load  delete  criterial name   page  </div>
})));

const UpdateCriteria = React.lazy(() => import('promotionService/UpdateCriteria').catch(() => ({
  default: () => <div>Failed to load  load  update  criterial name   page  </div>
})));

const NestedCriteria = React.lazy(() => import('promotionService/NestedCriteria').catch(() => ({
  default: () => <div>Failed to load  load  nested  create criterial name    page  </div>
})));

const EditNestedCriteria = React.lazy(() => import('promotionService/EditNestedCriteria').catch(() => ({
  default: () => <div>Failed to load  load    update nested criterial name    page  </div>
})));

const DeleteChildCriteria = React.lazy(() => import('promotionService/DeleteChildCriteria').catch(() => ({
  default: () => <div>Failed to load  load    delete nested criterial name    page  </div>
})));

const CreatePromotionCriteria = React.lazy(() => import('promotionService/CreatePromotionCriteria').catch(() => ({
  default: () => <div>Failed to load  load    create promotion criteria    page  </div>
})));

// const ListPromotionCriteria= React.lazy(() => import('promotionService/ListPromotionCriteria').catch(() => ({ 
//   default: () => <div>Failed to load  load    list promotion criteria    page  </div> 
// })));

const DeletePromotionCriteria = React.lazy(() => import('promotionService/DeletePromotionCriteria').catch(() => ({
  default: () => <div>Failed to load  load    delete promotion criteria    page  </div>
})));

const UpdatePromotionCriteria = React.lazy(() => import('promotionService/UpdatePromotionCriteria').catch(() => ({
  default: () => <div>Failed to load  load    update promotion criteria    page  </div>
})));

const CreatePromotionCandidate = React.lazy(() => import('promotionService/CreatePromotionCandidate').catch(() => ({
  default: () => <div>Failed to load  load    create promotion candidate    page  </div>
})));

const UpdatePromotionCandidate = React.lazy(() => import('promotionService/UpdatePromotionCandidate').catch(() => ({
  default: () => <div>Failed to load  load    update promotion candidate    page  </div>
})));

const DeletePromotionCandidate = React.lazy(() => import('promotionService/DeletePromotionCandidate').catch(() => ({
  default: () => <div>Failed to load  load    delete promotion candidate    page  </div>
})));



const DeletCandidateEvaluation = React.lazy(() => import('promotionService/DeletCandidateEvaluation').catch(() => ({
  default: () => <div>Failed to load  load    delete promotion candidate    page  </div>
})));

const CreateCandidateEvaluation = React.lazy(() => import('promotionService/CreateCandidateEvaluation').catch(() => ({
  default: () => <div>Failed to load  load    create promotion candidate    page  </div>
})));

const EditCandidateEvaluation = React.lazy(() => import('promotionService/EditCandidateEvaluation').catch(() => ({
  default: () => <div>Failed to load  load    update promotion candidate    page  </div>
})));

const CreatePromoteCandidate = React.lazy(() => import('promotionService/CreatePromoteCandidate').catch(() => ({
  default: () => <div>Failed to load  load    create promotion candidate    page  </div>
})));
//separation

const CreateTermination = React.lazy(() => import('separationService/CreateTermination').catch(() => ({
  default: () => <div>Failed to load  load    create termination  page  </div>
})));

const CreateTerminationType = React.lazy(() => import('separationService/CreateTerminationType').catch(() => ({
  default: () => <div>Failed to load  load    create termination type  page  </div>
})));

const DeleteTerminationType = React.lazy(() => import('separationService/DeleteTerminationType').catch(() => ({
  default: () => <div>Failed to load  load    delete termination type  page  </div>
})));

const UpdateTerminationType = React.lazy(() => import('separationService/UpdateTerminationType').catch(() => ({
  default: () => <div>Failed to load  load    update termination type  page  </div>
})));

const ListTermination = React.lazy(() => import('separationService/ListTermination').catch(() => ({
  default: () => <div>Failed to load  load    list termination   page  </div>
})));

const UpdateTermination = React.lazy(() => import('separationService/UpdateTermination').catch(() => ({
  default: () => <div>Failed to load  load    update termination   page  </div>
})));
const DeleteTermination = React.lazy(() => import('separationService/DeleteTermination').catch(() => ({
  default: () => <div>Failed to load  load    delete termination   page  </div>
})));

const ApproveTermination = React.lazy(() => import('separationService/ApproveTermination').catch(() => ({
  default: () => <div>Failed to load  load    approve termination   page  </div>
})));

const CreateClearanceTermination = React.lazy(() => import('separationService/CreateClearanceTermination').catch(() => ({
  default: () => <div>Failed to load  load    create clearance termination  page  </div>
})));

const ListClearance = React.lazy(() => import('separationService/ListClearance').catch(() => ({
  default: () => <div>Failed to load  load    list clearance   page  </div>
})));

const DeleteClearance = React.lazy(() => import('separationService/DeleteClearance').catch(() => ({
  default: () => <div>Failed to load  load    delete clearance   page  </div>
})));

const UpdateClearance = React.lazy(() => import('separationService/UpdateClearance').catch(() => ({
  default: () => <div>Failed to load  load    update clearance   page  </div>
})));

const CreateRetirement = React.lazy(() => import('separationService/CreateRetirement').catch(() => ({
  default: () => <div>Failed to load  load  create Retirment  page  </div>
})));


const DeleteRetirement = React.lazy(() => import('separationService/DeleteRetirement').catch(() => ({
  default: () => <div>Failed to load  load  delete Retirment  page  </div>
})));
const UpdateRetirement = React.lazy(() => import('separationService/UpdateRetirement').catch(() => ({
  default: () => <div>Failed to load  load  update Retirment  page  </div>
})));

const ApproveRetirement = React.lazy(() => import('separationService/ApproveRetirement').catch(() => ({
  default: () => <div>Failed to load  load  approve Retirment  page  </div>
})));

const ListRetirement = React.lazy(() => import('separationService/ListRetirement').catch(() => ({
  default: () => <div>Failed to load  load  list Retirment  page  </div>
})));


const CreateClearanceRetirement = React.lazy(() => import('separationService/CreateClearanceRetirement').catch(() => ({
  default: () => <div>Failed to load  load  create clearance Retirment  page  </div>
})));


const CreateClearanceDepartment = React.lazy(() => import('separationService/CreateClearanceDepartment').catch(() => ({
  default: () => <div>Failed to load  load  create clearance departement  page  </div>
})));


const UpdateClearanceDepartment = React.lazy(() => import('separationService/UpdateClearanceDepartment').catch(() => ({
  default: () => <div>Failed to load  load  update clearance departement  page  </div>
})));

const DeleteClearanceDepartment = React.lazy(() => import('separationService/DeleteClearanceDepartment').catch(() => ({
  default: () => <div>Failed to load  load  delete clearance departement  page  </div>
})));

//transere
const CreateTransfer = React.lazy(() => import('transferService/CreateTransfer').catch(() => ({
  default: () => <div>Failed to load  load  create transfer  page  </div>
})));

const EditTransfer = React.lazy(() => import('transferService/EditTransfer').catch(() => ({
  default: () => <div>Failed to load  load  update transfer  page  </div>
})));

const ListTransfer = React.lazy(() => import('transferService/ListTransfer').catch(() => ({
  default: () => <div>Failed to load  load  list transfer  page  </div>
})));

const DeleteTransfer = React.lazy(() => import('transferService/DeleteTransfer').catch(() => ({
  default: () => <div>Failed to load  load  delete transfer  page  </div>
})));

const EditEmployeeTransfer = React.lazy(() => import('transferService/EditEmployeeTransfer').catch(() => ({
  default: () => <div>Failed to load  load  edit transfer  page  </div>
})));

const MakeDecision = React.lazy(() => import('transferService/MakeDecision').catch(() => ({
  default: () => <div>Failed to load  load  make desion transfer  page  </div>
})));

const CreateDirectAssignment = React.lazy(() => import('transferService/CreateDirectAssignment').catch(() => ({
  default: () => <div>Failed to load  load  create direct assign departement  page  </div>
})));

const EditDirectAssignment = React.lazy(() => import('transferService/EditDirectAssignment').catch(() => ({
  default: () => <div>Failed to load  load  edit direct assign departement  page  </div>
})));


const DeleteDirectAssignment = React.lazy(() => import('transferService/DeleteDirectAssignment').catch(() => ({
  default: () => <div>Failed to load  load  delete direct assign departement  page  </div>
})));
//disciplin service
const CreatePenalty = React.lazy(() => import('disciplineService/CreatePenalty').catch(() => ({
  default: () => <div>Failed to load  load  create penality page  </div>
})));
const UpdatePenalty = React.lazy(() => import('disciplineService/UpdatePenalty').catch(() => ({
  default: () => <div>Failed to load  load  update penality page  </div>
})));

const DeletePenalty = React.lazy(() => import('disciplineService/DeletePenalty').catch(() => ({
  default: () => <div>Failed to load  load  delete penality page  </div>
})));

const CreateOffense = React.lazy(() => import('disciplineService/CreateOffense').catch(() => ({
  default: () => <div>Failed to load  load  create offence page  </div>
})));
const DeleteOffense = React.lazy(() => import('disciplineService/DeleteOffense').catch(() => ({
  default: () => <div>Failed to load  load  delete offence page  </div>
})));
const UpdateOffense = React.lazy(() => import('disciplineService/UpdateOffense').catch(() => ({
  default: () => <div>Failed to load  load  update offence page  </div>
})));

const CreateDiscipline = React.lazy(() => import('disciplineService/CreateDiscipline').catch(() => ({
  default: () => <div>Failed to load  load  create discipline page  </div>
})));

const DeleteDiscipline = React.lazy(() => import('disciplineService/DeleteDiscipline').catch(() => ({
  default: () => <div>Failed to load  load  delete discipline page  </div>
})));

const ListDiscipline = React.lazy(() => import('disciplineService/ListDiscipline').catch(() => ({
  default: () => <div>Failed to load  load  list discipline page  </div>
})));

const ApproveDiscipline = React.lazy(() => import('disciplineService/ApproveDiscipline').catch(() => ({
  default: () => <div>Failed to load  load  approve discipline page  </div>
})));

const UpdateDiscipline = React.lazy(() => import('disciplineService/UpdateDiscipline').catch(() => ({
  default: () => <div>Failed to load  load  update discipline page  </div>
})));

const ListDisciplineForUser = React.lazy(() => import('disciplineService/ListDisciplineForUser').catch(() => ({
  default: () => <div>Failed to load  load  list user discipline page  </div>
})));

const CreateAppeal = React.lazy(() => import('disciplineService/CreateAppeal').catch(() => ({
  default: () => <div>Failed to load  load  create appel discipline page  </div>
})));

const DeleteAppeal = React.lazy(() => import('disciplineService/DeleteAppeal').catch(() => ({
  default: () => <div>Failed to load  load  delete appel discipline page  </div>
})));

const UpdateAppeal = React.lazy(() => import('disciplineService/UpdateAppeal').catch(() => ({
  default: () => <div>Failed to load  load  update appel discipline page  </div>
})));
//complaintService

const CreateComplaintType = React.lazy(() => import('complaintService/CreateComplaintType').catch(() => ({
  default: () => <div>Failed to load  load  create   complaint type page  </div>
})));

const UpdateComplaintType = React.lazy(() => import('complaintService/UpdateComplaintType').catch(() => ({
  default: () => <div>Failed to load  load  update   complaint type page  </div>
})));

const DeleteComplaintType = React.lazy(() => import('complaintService/DeleteComplaintType').catch(() => ({
  default: () => <div>Failed to load  load  delete   complaint type page  </div>
})));

const CreateComplaint = React.lazy(() => import('complaintService/CreateComplaint').catch(() => ({
  default: () => <div>Failed to load  load  create   complaint  page  </div>
})));


const UpdateComplaint = React.lazy(() => import('complaintService/UpdateComplaint').catch(() => ({
  default: () => <div>Failed to load  load  update   complaint  page  </div>
})));

const DeleteComplaint = React.lazy(() => import('complaintService/DeleteComplaint').catch(() => ({
  default: () => <div>Failed to load  load  delete   complaint  page  </div>
})));

const ListComplaint = React.lazy(() => import('complaintService/ListComplaint').catch(() => ({
  default: () => <div>Failed to load  load  get all   complaint  page  </div>
})));



const ListAttachments = React.lazy(() => import('complaintService/ListAttachments').catch(() => ({
  default: () => <div>Failed to load  load  list  attachement  page  </div>
})));

const DeleteAttachment = React.lazy(() => import('complaintService/DeleteAttachment').catch(() => ({
  default: () => <div>Failed to load  load  delete  attachement  page  </div>
})));

const ListComplaintHandlingsByDepartment = React.lazy(() => import('complaintService/ListComplaintHandlingsByDepartment').catch(() => ({
  default: () => <div>Failed to load  load  all complaint handiling  page  </div>
})));

const DeleteComplaintHandling = React.lazy(() => import('complaintService/DeleteComplaintHandling').catch(() => ({
  default: () => <div>Failed to load  load  delete complaint handiling  page  </div>
})));

const UpdateComplaintHandlingDecision = React.lazy(() => import('complaintService/UpdateComplaintHandlingDecision').catch(() => ({
  default: () => <div>Failed to load  load  update complaint handiling  page  </div>
})));

//attendanceService
const UpdateShift = React.lazy(() => import('attendanceService/UpdateShift').catch(() => ({
  default: () => <div>Failed to load  load  update shift  </div>
})));

const DeleteShift = React.lazy(() => import('attendanceService/DeleteShift').catch(() => ({
  default: () => <div>Failed to load  load  delete shift  </div>
})));

const UpdateWeekend = React.lazy(() => import('attendanceService/UpdateWeekend').catch(() => ({
  default: () => <div>Failed to load  load  update weekend  </div>
})));

const DeleteWeekend = React.lazy(() => import('attendanceService/DeleteWeekend').catch(() => ({
  default: () => <div>Failed to load    delete weekend  </div>
})));

const UpdateOverTime = React.lazy(() => import('attendanceService/UpdateOverTime').catch(() => ({
  default: () => <div>Failed to load update overtime  </div>
})));
const DeleteOverTime = React.lazy(() => import('attendanceService/DeleteOverTime').catch(() => ({
  default: () => <div>Failed to load detete overtime  </div>
})));

const UpdateTimeTolerance = React.lazy(() => import('attendanceService/UpdateTimeTolerance').catch(() => ({
  default: () => <div>Failed to load update tolerance time  </div>
})));

const DeleteTimeTolerance = React.lazy(() => import('attendanceService/DeleteTimeTolerance').catch(() => ({
  default: () => <div>Failed to load detete tolerance time  </div>
})));

const UpdateExcuse = React.lazy(() => import('attendanceService/UpdateExcuse').catch(() => ({
  default: () => <div>Failed to load update  excuse type  </div>
})));

const DeleteExcuse = React.lazy(() => import('attendanceService/DeleteExcuse').catch(() => ({
  default: () => <div>Failed to load delete excuse type  </div>
})));

const EmployeeAttendanceView = React.lazy(() => import('attendanceService/EmployeeAttendanceView').catch(() => ({
  default: () => <div>Failed to load employee attendance result  </div>
})));

const HrApproval = React.lazy(() => import('attendanceService/HrApproval').catch(() => ({
  default: () => <div>Failed to load hr approval  </div>
})));

const AttendanceApproval = React.lazy(() => import('attendanceService/AttendanceApproval').catch(() => ({
  default: () => <div>Failed to load attendance approval  </div>
})));

const CreateAttendanceLog = React.lazy(() => import('attendanceService/CreateAttendanceLog').catch(() => ({
  default: () => <div>Failed to load create attendance result </div>
})));

//items service
const CreateItem = React.lazy(() => import('itemService/CreateItem').catch(() => ({
  default: () => <div>Failed to load create items </div>
})));

const UpdateItem = React.lazy(() => import('itemService/UpdateItem').catch(() => ({
  default: () => <div>Failed to load update items </div>
})));


const DeleteItem = React.lazy(() => import('itemService/DeleteItem').catch(() => ({
  default: () => <div>Failed to load delete items </div>
})));

const CreateInspection = React.lazy(() => import('itemService/CreateInspection').catch(() => ({
  default: () => <div>Failed to load create inspection </div>
})));

const UpdateInspection = React.lazy(() => import('itemService/UpdateInspection').catch(() => ({
  default: () => <div>Failed to load update inspection </div>
})));

const DeleteInspection = React.lazy(() => import('itemService/DeleteInspection').catch(() => ({
  default: () => <div>Failed to load delete inspection </div>
})));
//store service
const DeleteStoreCategory = React.lazy(() => import('storeService/DeleteStoreCategory').catch(() => ({
  default: () => <div>Failed to load delete store  category </div>
})));
const UpdateStoreCategory = React.lazy(() => import('storeService/UpdateStoreCategory').catch(() => ({
  default: () => <div>Failed to load update store  category </div>
})));

const UpdateStore = React.lazy(() => import('storeService/UpdateStore').catch(() => ({
  default: () => <div>Failed to load update store </div>
})));

const DeleteStore = React.lazy(() => import('storeService/DeleteStore').catch(() => ({
  default: () => <div>Failed to load delete store </div>
})));


const CreateStoreRequisition = React.lazy(() => import('storeService/CreateStoreRequisition').catch(() => ({
  default: () => <div>Failed to load create store requision </div>
})));

const DeleteStoreRequisition = React.lazy(() => import('storeService/DeleteStoreRequisition').catch(() => ({
  default: () => <div>Failed to load delete store requision </div>
})));

const UpdateStoreRequisition = React.lazy(() => import('storeService/UpdateStoreRequisition').catch(() => ({
  default: () => <div>Failed to load update store requision </div>
})));

const CreateIssuableItem = React.lazy(() => import('storeService/CreateIssuableItem').catch(() => ({
  default: () => <div>Failed to load create store requision </div>
})));
const DeleteIssuableItem = React.lazy(() => import('storeService/DeleteIssuableItem').catch(() => ({
  default: () => <div>Failed to load delete store requision </div>
})));
const UpdateIssuableItem = React.lazy(() => import('storeService/UpdateIssuableItem').catch(() => ({
  default: () => <div>Failed to load update store requision </div>
})));

const CreateReceivableItem = React.lazy(() => import('storeService/CreateReceivableItem').catch(() => ({
  default: () => <div>Failed to load create receivable requision </div>
})));

const UpdateReceivableItem = React.lazy(() => import('storeService/UpdateReceivableItem').catch(() => ({
  default: () => <div>Failed to load update receivable requision </div>
})));

const DeleteReceivableItem = React.lazy(() => import('storeService/DeleteReceivableItem').catch(() => ({
  default: () => <div>Failed to load delete receivable requision </div>
})));
//store movemet 

const CreateStoreIssueVoucher = React.lazy(() => import('storeMovementService/CreateStoreIssueVoucher').catch(() => ({
  default: () => <div>Failed to load create store issue vouncher </div>
})));
const DeleteStoreIssueVoucher = React.lazy(() => import('storeMovementService/DeleteStoreIssueVoucher').catch(() => ({
  default: () => <div>Failed to load delete store issue vouncher </div>
})));

const UpdateStoreIssueVoucher = React.lazy(() => import('storeMovementService/UpdateStoreIssueVoucher').catch(() => ({
  default: () => <div>Failed to load update store issue vouncher </div>
})));

const CreateGoodReceivingNote = React.lazy(() => import('storeMovementService/CreateGoodReceivingNote').catch(() => ({
  default: () => <div>Failed to load create good receiving note </div>
})));

const UpdateGoodReceivingNote = React.lazy(() => import('storeMovementService/UpdateGoodReceivingNote').catch(() => ({
  default: () => <div>Failed to load update good receiving note </div>
})));

const DeleteGoodReceivingNote = React.lazy(() => import('storeMovementService/DeleteGoodReceivingNote').catch(() => ({
  default: () => <div>Failed to load delete good receiving note </div>
})));

const CreateGatePassInformation = React.lazy(() => import('storeMovementService/CreateGatePassInformation').catch(() => ({
  default: () => <div>Failed to load create gate pass information </div>
})));

const UpdateGatePassInformation = React.lazy(() => import('storeMovementService/UpdateGatePassInformation').catch(() => ({
  default: () => <div>Failed to load update gate pass information </div>
})));

const DeleteGatePassInformation = React.lazy(() => import('storeMovementService/DeleteGatePassInformation').catch(() => ({
  default: () => <div>Failed to load delete gate pass information </div>
})));

const DecisionGatePassInformation = React.lazy(() => import('storeMovementService/DecisionGatePassInformation').catch(() => ({
  default: () => <div>Failed to load decisionn gate pass information </div>
})));

const CreateInterStoreIssueVoucherForIssue = React.lazy(() => import('storeMovementService/CreateInterStoreIssueVoucherForIssue').catch(() => ({
  default: () => <div>Failed to load create inter issue vouncher for issue </div>
})));

const UpdateInterStoreIssueVoucherForIssue = React.lazy(() => import('storeMovementService/UpdateInterStoreIssueVoucherForIssue').catch(() => ({
  default: () => <div>Failed to load update inter issue vouncher for issue </div>
})));

const DeleteInterStoreIssueVoucherForIssue = React.lazy(() => import('storeMovementService/DeleteInterStoreIssueVoucherForIssue').catch(() => ({
  default: () => <div>Failed to load delete inter issue vouncher for issue </div>
})));

const DecisionInterStoreIssueVoucherForIssue = React.lazy(() => import('storeMovementService/DecisionInterStoreIssueVoucherForIssue').catch(() => ({
  default: () => <div>Failed to load decison inter issue vouncher for issue </div>
})));

const CreateInterStoreIssueVoucherForReceiving = React.lazy(() => import('storeMovementService/CreateInterStoreIssueVoucherForReceiving').catch(() => ({
  default: () => <div>Failed to load create inter issue vouncher for receiving </div>
})));

const UpdateInterStoreIssueVoucherForReceiving = React.lazy(() => import('storeMovementService/UpdateInterStoreIssueVoucherForReceiving').catch(() => ({
  default: () => <div>Failed to load update inter issue vouncher for receiving </div>
})));

const DeleteInterStoreIssueVoucherForReceiving = React.lazy(() => import('storeMovementService/DeleteInterStoreIssueVoucherForReceiving').catch(() => ({
  default: () => <div>Failed to load delete inter issue vouncher for receiving </div>
})));
const CreateFixedAsset = React.lazy(() => import('fixedAssetService/CreateFixedAsset').catch(() => ({
  default: () => <div>Failed to load create fixed assets </div>
})));








const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<AppLogin />} />
      <Route path="/denied-access" element={<AccessDenied />} />





      <Route path="/" element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />



        <Route path="employee/">






          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.ADD_EMPLOYEE

                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="addEmployee" element={<AddEmployee />} />
          </Route>


          {/* <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.GET_EMPLOYEE_BY_EMPLOYEE_ID
                  
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="details" element={<Details />} />
          </Route> */}







          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_EMPLOYEE

                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="editDetails" element={<EditDetails />} />
          </Route>





          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={EmployeeServiceResourceName.ADD_EMPLOYEE}
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="add" element={<CreateEmployee />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={EmployeeServiceResourceName.GET_ALL_EMPLOYEES}
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="list" element={<ListEmployee />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={EmployeeServiceResourceName.DELETE_EMPLOYEE}
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="delete" element={<DeleteEmployee />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={EmployeeServiceResourceName.UPDATE_EMPLOYEE}
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="edit" element={<EditEmployee />} />
          </Route>




          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={EmployeeServiceResourceName.ADD_COUNTRY}
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="country" element={<CreateCountry />} />
          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_COUNTRY

                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="delete_country" element={<DeleteCountry />} />
          </Route>



          \
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_COUNTRY
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="update_country" element={<UpdateCountry />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.ADD_DUTY_STATION
                }
                apiName="employee" // Pass the API name here
              />
            }
          >

            <Route path="duty_station" element={<CreateDutyStation />} />
          </Route>
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_DUTY_STATION
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="delete_dutyStation" element={<DeleteDutyStation />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_DUTY_STATION
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="update_dutyStation" element={<UpdateDutyStation />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.ADD_TITLE_NAME
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="title_name" element={<CreateTitleName />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_TITLE_NAME
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="delete_titlename" element={<DeleteTitleName />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_TITLE_NAME
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="update_titlename" element={<UpdateTitleName />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.ADD_LANGUAGE_NAME
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="language_name" element={<CreateLangugaeName />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_LANGUAGE_NAME
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="update_languagename" element={<UpdateLanguageName />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_LANGUAGE_NAME
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="delete_languagename" element={<DeleteLanguageName />} />
          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.ADD_ADDRESS
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="address" element={<CreateAddress />} />
          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_ADDRESS
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="update_address" element={<EditAddress />} />
          </Route>





          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_ADDRESS
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="delete_address" element={<DeleteAddress />} />
          </Route>




          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.ADD_SKILL
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="skill" element={<CreateSkill />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_SKILL
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="update_skill" element={<EditSkill />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_SKILL
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="delete_skill" element={<DeleteSkill />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_TRAINING
                }
                apiName="employee" // Pass the API name here
              />
            }
          >
            <Route path="update_training" element={<EditTraining />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_TRAINING
                }
                apiName="employee"
              />
            }
          >
            <Route path="delete_training" element={<DeleteTraining />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_FAMILY
                }
                apiName="employee"
              />
            }
          >
            <Route path="update_family" element={<EditFamily />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_FAMILY
                }
                apiName="employee"
              />
            }
          >
            <Route path="delete_family" element={<DeleteFamily />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_REFERENCE
                }
                apiName="employee"
              />
            }
          >
            <Route path="update_reference" element={<EditReference />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_REFERENCE
                }
                apiName="employee"
              />
            }
          >
            <Route path="delete_reference" element={<DeleteReference />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_LANGUAGE
                }
                apiName="employee"
              />
            }
          >
            <Route path="delete_language" element={<DeleteLanguage />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_LANGUAGE
                }
                apiName="employee"
              />
            }
          >
            <Route path="update_language" element={<EditLanguage />} />
          </Route>




          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_EXPERIENCE
                }
                apiName="employee"
              />
            }
          >
            <Route path="delete_experience" element={<DeleteExperience />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_EXPERIENCE
                }
                apiName="employee"
              />
            }
          >
            <Route path="update_experience" element={<EditExperence />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.DELETE_EDUCATION
                }
                apiName="employee"
              />
            }
          >
            <Route path="delete_education" element={<DeleteEducation />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EmployeeServiceResourceName.UPDATE_EDUCATION
                }
                apiName="employee"
              />
            }
          >
            <Route path="update_education" element={<EditEducation />} />
          </Route>














        </Route>


        <Route path="recruitment/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.ADD_MEDIA_TYPE

                }
                apiName="recruitment"
              />
            }
          >
            <Route path="media_type" element={<CreateMediaType />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_MEDIA_TYPE

                }
                apiName="recruitment"
              />
            }
          >
            <Route path="delete_media_type" element={<DeleteMediaType />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_MEDIA_TYPE

                }
                apiName="recruitment"
              />
            }
          >
            <Route path="update_media_type" element={<UpdateMediaType />} />
          </Route>




          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.ADD_RECRUITMENT

                }
                apiName="recruitment"
              />
            }
          >
            <Route path="create" element={<CreateRecruitment />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.GET_ALL_RECRUITMENTS
                }
                apiName="recruitment"
              />
            }
          >
            <Route path="list" element={<ListRecruitment />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_RECRUITMENT
                }
                apiName="recruitment"
              />
            }
          >
            <Route path="delete" element={<DeleteRecruitment />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.APPROVE_RECRUITMENT
                }
                apiName="recruitment"
              />

            }
          >

            <Route
              path="editApprovance"
              element={<EditRecruitmentbyapprove />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_RECRUITMENT
                }
                apiName="recruitment"
              />
            }
          >
            <Route path="edit" element={<EditRecruitment />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.ADD_RECRUITMENT
                }
                apiName="recruitment"
              />
            }
          >
            <Route path="more" element={<MoreAboutRecruitment />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.REMOVE_ADVERTISEMENT_MEDIA_TYPE
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="deleteAdvertisement"
              element={<DeleteAdvertisment />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_ADVERTISEMENT
                }
                apiName="recruitment"
              />
            }
          >
            <Route path="editadverisement" element={<EditAdvertisement />} />
          </Route>






          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_SHORTLIST_CRITERIA
                }
                apiName="recruitment"

              />
            }
          >
            <Route path="editcriterial" element={<EditShortListCriterial />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_SHORTLIST_CRITERIA
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="deleteCriterial"
              element={<DeleteShortListCriterial />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.ADD_SHORTLIST_CRITERIA
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="shortListCriterialError"
              element={<ShortListCriterialError />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_ASSESSMENT_WEIGHT
                }
                apiName="recruitment"

              />
            }
          >
            <Route path="editassessement" element={<EditAssessementWeight />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_ASSESSMENT_WEIGHT
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="deleteAssesigmentWeight"
              element={<DeleteAssessementWeight />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.ADD_ASSESSMENT_WEIGHT
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="assessmenterror"
              element={<AssessimentError />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_APPLICANT
                }
                apiName="recruitment"

              />
            }
          >
            <Route path="editapplicant" element={<EditApplicant />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_APPLICANT
                }
                apiName="recruitment"

              />
            }
          >
            <Route path="deleteApplicant" element={<DeleteApplicant />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.ADD_EDUCATION
                }
                apiName="recruitment"

              />
            }
          >

            <Route path="moreaboutapplicant" element={<MoreAboutApplicant />} />
          </Route>
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_EDUCATION
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="editapplicantEducation"
              element={<EditApplicantEducation />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_EDUCATION
                }
                apiName="recruitment"
              />
            }
          >
            <Route
              path="deleteapplicantEducation"
              element={<DeleteApplicantEducation />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_TRAINING
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="editapplicantCertificate"
              element={<EditApplicantCertificate />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_TRAINING
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="deleteapplicantCertificate"
              element={<DeleteApplicantCertificate />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_EXPERIENCE
                }
                apiName="recruitment"
              />
            }
          >
            <Route
              path="editapplicantExperence"
              element={<EditApplicantExperience />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_EXPERIENCE
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="deleteapplicantExperience"
              element={<DeleteApplicantExperience />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.GET_ALL_LANGUAGES
                }
                apiName="recruitment"
              />
            }
          >
            <Route
              path="editapplicantLangage"
              element={<EditApplicantLanguage />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_LANGUAGE
                }
                apiName="recruitment"
              />
            }
          >
            <Route
              path="deleteapplicantLanguage"
              element={<DeleteApplicantLanguage />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_REFERENCE
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="editapplicantReference"
              element={<EditApplicantReference />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_REFERENCE
                }
                apiName="recruitment"

              />
            }
          >
            <Route
              path="deleteapplicantReference"
              element={<DeleteApplicantReference />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.ADD_EXAM_RESULT
                }
                apiName="recruitment"

              />
            }
          >
            <Route path="examResult" element={<CreateExamResult />} />
          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.UPDATE_EXAM_RESULT
                }
                apiName="recruitment"
              />
            }
          >
            <Route path="editExamresult" element={<EditExamResult />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  RecruitmentServiceResourceName.DELETE_EXAM_RESULT
                }
                apiName="recruitment"
              />
            }
          >
            <Route
              path="deleteApplicantExamResult"
              element={<DeleteApplicantExamResult />}
            />
          </Route>


        </Route>

        <Route path="planning/">
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.ADD_HR_NEED_REQUEST
                }
                apiName="planning"

              />
            }
          >
            <Route path="needRequest" element={<CreateNeedRequest />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.GET_ALL_HR_NEED_REQUESTS
                }
                apiName="planning"

              />
            }
          >
            <Route path="listRequest" element={<ListNeedRequest />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.DELETE_HR_NEED_REQUEST
                }
                apiName="planning"

              />
            }
          >
            <Route path="deleteRequest" element={<DeleteNeedRequest />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.UPDATE_HR_NEED_REQUEST
                }
                apiName="planning"

              />
            }
          >
            <Route path="update" element={<EditNeedRequest />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.ADD_HR_ANALYSIS
                }
                apiName="planning"

              />
            }
          >
            <Route path="hranalyses" element={<CreateHrAnalisis />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.DELETE_HR_ANALYSIS
                }
                apiName="planning"

              />
            }
          >
            <Route path="delete-analisis" element={<DeleteHrAnalisis />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.UPDATE_HR_ANALYSIS
                }
                apiName="planning"

              />
            }
          >
            <Route path="update-analisis" element={<UpdateHrAnalisis />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.ADD_ANNUAL_RECRUITMENT_AND_PROMOTION
                }
                apiName="planning"

              />
            }
          >
            <Route
              path="requitment-promotion"
              element={<CreateAnnualRecruitmentPromotion />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.DELETE_ANNUAL_RECRUITMENT_AND_PROMOTION
                }
                apiName="planning"
              />
            }
          >
            <Route
              path="delete-promotion"
              element={<DeleteAnnualRecruitmentPromotion />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  HrPlanningServiceResourceName.DELETE_ANNUAL_RECRUITMENT_AND_PROMOTION
                }
                apiName="planning"
              />
            }
          >
            <Route
              path="update-promotion"
              element={<UpdateAnnualRecruitmentPromotion />}
            />
          </Route>



        </Route>

        <Route
          path="addtenant"
          element={
            <RoleProtectedRoute admin={true}>
              <CreateTenant />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/employee/details"
          element={
            <RoleProtectedRoute NorequiredResourceName={true}>
              <Details />
            </RoleProtectedRoute>
          }
        />

        {/* <Route path="details" element={<RoleProtectedRoute requiredResourceName={true} />}>
       <Route index element={<Details />} />
      </Route> */}


        <Route
          path="edittenant"
          element={
            <RoleProtectedRoute admin={true}>
              <EditTenant />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="manageteant"
          element={
            <RoleProtectedRoute admin={true}>
              <ListTenant />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="detailstenant"
          element={
            <RoleProtectedRoute admin={true}>
              <DetailsTenant />
            </RoleProtectedRoute>
          }
        />



        <Route path="roleandresource" element={<ProtectedRoute><DefaultResource /></ProtectedRoute>} />
        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                AuthServiceResourceName.GET_ALL_USERS ||
                AuthServiceResourceName.ADD_USER
              }
              apiName="user"
            />
          }
        >
          <Route path="user_manage" element={<ListUsers />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                AuthServiceResourceName.ADD_USER

              }
              apiName="user"

            />
          }
        >

          <Route path="adduser" element={<AddNewuser />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                AuthServiceResourceName.UPDATE_USER

              }
              apiName="user"

            />
          }
        >

          <Route path="updateUser_role" element={<UpdateUsersRole />} />
        </Route>



        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                AuthServiceResourceName.RESET_PASSWORD

              }
              apiName="user"

            />
          }
        >

          <Route path="reset_password" element={<ResetPassWord />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                AuthServiceResourceName.GET_ALL_RESOURCES

              }
              apiName="user"

            />
          }
        >

          <Route path="manage_resourse_assign" element={<ListResourseName />} />
        </Route>




        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                AuthServiceResourceName.ADD_ROLE ||
                AuthServiceResourceName.GET_ALL_ROLES
              }
              apiName="user"

            />
          }
        >

          <Route path="role_manage" element={<ManageTenantRole />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.ADD_JOB_GRADE
              }
              apiName="organization"

            />
          }
        >
          <Route
            path="manage_organization_info"
            element={<OrganizationTab />}
          />
        </Route>



        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_FIELD_OF_STUDY
              }
              apiName="organization"

            />
          }
        >
          <Route path="update_field_study" element={<UpdateFieldStudy />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.DELETE_FIELD_OF_STUDY
              }
              apiName="organization"

            />
          }
        >
          <Route path="delete__field_study" element={<DeleteFieldstudy />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_JOB_GRADE
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_job_grade" element={<EditJobGrade />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_JOB_CATEGORY
              }
              apiName="organization"
            />
          }
        >
          <Route path="edit_job_category" element={<EditJobCategory />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_WORK_UNIT
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_work_unit" element={<EditWorkUnit />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_EDUCATION_LEVEL
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_education_level" element={<EditEducationLevel />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_QUALIFICATION
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_qualification" element={<EditQualification />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_JOB_GRADE
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_pay_grade" element={<EditPayGrade />} />
        </Route>
        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_LOCATION_TYPE
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_location_type" element={<EditLocationType />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.GET_ALL_LOCATIONS
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_location" element={<EditLocation />} />
        </Route>
        <Route

          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_ADDRESS
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_address" element={<EditAddres />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.GET_ADDRESSES_BY_ID
              }
              apiName="organization"
            />
          }
        >
          <Route path="details_address" element={<DetailsAddress />} />
        </Route>





        <Route



          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.GET_LOCATION_BY_ID
              }
              apiName="organization"

            />
          }
        >
          <Route path="details_location" element={<DetailsLocation />} />
        </Route>




        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_DEPARTMENT_TYPE
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_department_type" element={<EditDepartmentType />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.GET_JOB_BY_ID
              }
              apiName="organization"

            />
          }
        >
          <Route path="details_job" element={<DetailsJobRegistration />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_JOB
              }
              apiName="organization"

            />
          }
        >
          <Route path="edit_job_registration" element={<EditJobRegistration />} />
        </Route>





        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.ADD_DEPARTMENT
              }
              apiName="organization"

            />
          }
        >
          <Route path="manage_organization" element={<StructureTab />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.UPDATE_STAFF_PLAN
              }
              apiName="organization"
            />
          }
        >
          <Route path="edit_staff_plan" element={<EditStaffPlan />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                OrganizationServiceResourceName.GET_STAFF_PLANS_BY_ID
              }
              apiName="organization"
            />
          }
        >
          <Route path="details_staff_plan" element={<EditStaffPlan />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.ADD_BUDGET_YEAR
              }
              apiName="leave"
            />
          }
        >
          <Route path="add_Leave_Info" element={<LeaveInfo />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.UPDATE_BUDGET_YEAR
              }
              apiName="leave"
            />
          }
        >
          <Route path="editbudgetyear" element={<EditBudgetYear />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.GET_BUDGET_YEAR_BY_ID
              }
              apiName="leave"
            />
          }
        >
          <Route path="detailbudgetyear" element={<DetailsBudgetYear />} />
        </Route>




        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={LeaveServiceResourceName.GET_HOLIDAY_BY_ID}
              apiName="leave"


            />
          }
        >
          <Route path="detailsholiday" element={<DetailsHoliday />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={LeaveServiceResourceName.UPDATE_HOLIDAY}
              apiName="leave"

            />

          }

        >
          <Route path="editholiday" element={<EditHoliday />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.GET_HOLIDAY_MANAGEMENT_BY_ID
              }
              apiName="leave"

            />
          }
        >
          <Route path="detailsholidaymgmt" element={<DetailsHolidayMgmt />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.UPDATE_HOLIDAY_MANAGEMENT
              }
              apiName="leave"

            />
          }
        >
          <Route path="editholidaymgmt" element={<EditHolidayMgmt />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={LeaveServiceResourceName.UPDATE_LEAVE_TYPE}
              apiName="leave"

            />

          }
        >
          <Route path="editleavetype" element={<EditLeaveType />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.GET_LEAVE_TYPE_BY_ID
              }
              apiName="leave"

            />
          }
        >
          <Route path="detailsleavetype" element={<DetailsLeaveType />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.UPDATE_LEAVE_SETTING
              }
              apiName="leave"

            />
          }
        >
          <Route path="editleavesettings" element={<EditLeaveSettings />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.GET_LEAVE_SETTING_BY_ID
              }
              apiName="leave"

            />
          }
        >
          <Route
            path="detailsleavesettings"
            element={<DetailsLeaveSettings />}
          />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={LeaveServiceResourceName.ADD_LEAVE_SCHEDULE}
              apiName="leave"

            />

          }
        >
          <Route path="addleaveschedule" element={<AddLeaveSchedule />} />
        </Route>


        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.DELETE_LEAVE_SCHEDULE
              }
              apiName="leave"

            />
          }
        >
          <Route path="deleteleaveschedule" element={<DeleteLeaveschedule />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.UPDATE_LEAVE_SCHEDULE
              }
              apiName="leave"
            />
          }
        >
          <Route path="updateleaveschedule" element={<UpdateLeaveschedule />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={LeaveServiceResourceName.ADD_LEAVE_REQUEST}
              apiName="leave"

            />
          }
        >
          <Route path="addleaverequest" element={<CreateLeaveRequest />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.DELETE_LEAVE_REQUEST
              }
              apiName="leave"

            />
          }
        >
          <Route path="deleteLeaveRequest" element={<DeleteLeaveRequest />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.UPDATE_LEAVE_REQUEST
              }
              apiName="leave"

            />
          }
        >
          <Route path="editleaverequest" element={<UpdateLeaveRequest />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.DEPARTMENT_APPROVE_LEAVE_REQUEST
              }
              apiName="leave"

            />
          }
        >
          <Route
            path="departement_Approvance"
            element={<LeaveRequestDepartementApprovance />}
          />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.HR_APPROVE_LEAVE_REQUEST
              }
              apiName="leave"

            />
          }
        >
          <Route path="hr_Approvance" element={<LeaveRequestHrApprovance />} />
        </Route>

        <Route
          element={
            <RoleProtectedRoute
              requiredResourceName={
                LeaveServiceResourceName.GET_EMPLOYEE_LEAVE_BALANCE
              }
              apiName="leave"

            />
          }
        >
          <Route path="leavebalance" element={<LeaveBalance />} />
        </Route>





        <Route path="training/">
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_TRAINING_COURSE_CATEGORY
                }
                apiName="training"
              />
            }
          >
            <Route path="coursecategory" element={<CraeteTrainingCategory />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_TRAINING_COURSE_CATEGORY
                }
                apiName="training"
              />
            }
          >
            <Route
              path="deletecategory"
              element={<DeleteTrainingCourseCategory />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_TRAINING_COURSE_CATEGORY
                }
                apiName="training"
              />
            }
          >
            <Route path="editcategory" element={<EditCourseCategory />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_TRAINING_COURSE
                }
                apiName="training"
              />
            }
          >
            <Route path="trainingCourse" element={<CreatetrainingCourse />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_TRAINING
                }
                apiName="training"
              />
            }
          >
            <Route
              path="updateTrainingCourse"
              element={<UpdateTrainingCourse />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_PRE_SERVICE_CHECKED_DOCUMENT
                }
                apiName="training"
              />
            }
          >
            <Route path="createdocument" element={<CreateTraineDocument />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_PRE_SERVICE_CHECKED_DOCUMENT
                }
                apiName="training"
              />
            }
          >
            <Route path="updatedocument" element={<UpdateTraineDocument />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_PRE_SERVICE_CHECKED_DOCUMENT
                }
                apiName="training"
              />
            }
          >
            <Route path="deletedocument" element={<DeleteTraineeDocument />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_INSTITUTION
                }
                apiName="training"
              />
            }
          >
            <Route
              path="trainingInstution"
              element={<CreateTrainingInstitution />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_INSTITUTION
                }
                apiName="training"
              />
            }
          >
            <Route
              path="updateTrainingInstution"
              element={<UpdateTrainingInstution />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_INSTITUTION
                }
                apiName="training"
              />
            }
          >
            <Route
              path="delete_instution"
              element={<DeleteTrainingInstitution />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_TRAINING
                }
                apiName="training"
              />
            }
          >
            <Route
              path="annualTrainingRequest"
              element={<CreateAnnualTrainingRequest />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_TRAINING
                }
                apiName="training"
              />
            }
          >
            <Route
              path="delete_trainining"
              element={<DeleteAnnualTrainingRequest />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_TRAINING
                }
                apiName="training"

              />
            }
          >
            <Route
              path="updateAnnualTrainingRequest"
              element={<EditAnnualTrainingRequest />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.APPROVE_TRAINING
                }
                apiName="training"

              />
            }
          >
            <Route
              path="trainingStatus"
              element={<TrainingStatus />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_ANNUAL_TRAINING_PLAN
                }
                apiName="training"

              />
            }
          >
            <Route
              path="annualPlan"
              element={<CreateAnnualTrainingPlan />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_ANNUAL_TRAINING_PLAN
                }
                apiName="training"

              />
            }
          >
            <Route
              path="updateAnnualTrainingPlan"
              element={<UpdateAnnualTrainingPlan />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_ANNUAL_TRAINING_PLAN
                }
                apiName="training"
              />
            }
          >
            <Route
              path="delete_trainining"
              element={<DeleteAnnualTrainingPlan />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_PRE_SERVICE_COURSE_TYPE
                }
                apiName="training"
              />
            }
          >
            <Route path="coursetype" element={<CreatePreserviceCourseType />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_PRE_SERVICE_COURSE_TYPE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="updatecoursetype"
              element={<UpdatePresserviceCourseType />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_PRE_SERVICE_COURSE_TYPE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="deletecoursetype"
              element={<DeletePreserviceCourseType />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_PRE_SERVICE_COURSE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="preserviceCourses"
              element={<CreatePreServiceCourse />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_PRE_SERVICE_COURSE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="updatepreserviceCourses"
              element={<UpdatePreServiceCourse />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_PRE_SERVICE_COURSE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="delete_course"
              element={<DeletePreServiceCourse />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_PRE_SERVICE_TRAINEE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="preserviceTraining"
              element={<CreatePreServiceTraining />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_PRE_SERVICE_TRAINEE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="updatepreserviceTraining"
              element={<UpdatePreServiceTraining />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_PRE_SERVICE_TRAINEE
                }
                apiName="training"
              />
            }
          >
            <Route
              path="delete_training"
              element={<DeletePreServiceTraining />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_UNIVERSITY
                }
                apiName="training"
              />
            }
          >
            <Route path="university" element={<CreateUniversity />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_UNIVERSITY
                }
                apiName="training"
              />
            }
          >
            <Route path="updateUniversity" element={<UpdateUniversity />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_UNIVERSITY
                }
                apiName="training"
              />
            }
          >
            <Route path="deleteUniversity" element={<DeleteUniversity />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_INTERNSHIP_STUDENT
                }
                apiName="training"
              />
            }
          >
            <Route
              path="internstudent"
              element={<CreateInternshipStudents />}
            />
          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_INTERNSHIP_STUDENT
                }
                apiName="training"

              />
            }
          >
            <Route
              path="updateInternstudent"
              element={<UpdateInternshipStudents />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ASSIGN_DEPARTMENT_TO_INTERNSHIP_STUDENT
                }
                apiName="training"

              />
            }
          >
            <Route path="assigndepartement" element={<AssignDepartement />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ASSIGN_STATUS_TO_INTERNSHIP_STUDENT
                }
                apiName="training"

              />
            }
          >
            <Route
              path="internstudentStatus"
              element={<InternStudentStatus />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_INTERNSHIP_STUDENT
                }
                apiName="training"

              />
            }
          >
            <Route
              path="deleteInternstudent"
              element={<DeleteInternStudent />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_INTERNSHIP_PAYMENT
                }
                apiName="training"
              />
            }
          >
            <Route
              path="createInternPayment"
              element={<CreateInterbshipPayment />}
            />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_INTERNSHIP_PAYMENT
                }
                apiName="training"
              />
            }
          >
            <Route
              path="updateInternPayement"
              element={<UpdateInternPayment />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.GET_ALL_INTERNSHIP_PAYMENTS
                }
                apiName="training"
              />
            }
          >
            <Route
              path="listInternPayement"
              element={<ListInternshipPayment />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_INTERNSHIP_PAYMENT
                }
                apiName="training"
              />
            }
          >
            <Route
              path="deleteIntenpayment"
              element={<DeleteInternPayment />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_EDUCATION_OPPORTUNITY
                }
                apiName="training"
              />
            }
          >
            <Route
              path="educationOpportunity"
              element={<CreateEductionOpportunity />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_EDUCATION_OPPORTUNITY
                }
                apiName="training"
              />
            }
          >
            <Route
              path="updateeducationOpportunity"
              element={<UpdateEductionOpportunity />}

            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_EDUCATION_OPPORTUNITY
                }
                apiName="training"
              />
            }
          >
            <Route
              path="deleteEducationOpportunity"
              element={<DeleteEducationOpportunity />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.ADD_TRAINING_PARTICIPANT
                }
                apiName="training"
              />
            }
          >
            <Route
              path="trainingparticipant"
              element={<CreateTrainingparticipant />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.UPDATE_TRAINING_PARTICIPANT
                }
                apiName="training"
              />
            }
          >
            <Route
              path="trainingparticipant"
              element={<UpdateTrainingParticipants />}
            />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TrainingServiceResourceName.DELETE_TRAINING_PARTICIPANT
                }
                apiName="training"
              />
            }
          >
            <Route
              path="delete_participant"
              element={<DeleteTrainingparticipant />}
            />
          </Route>


        </Route>

        <Route path="evaluation/">
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.ADD_EVALUATION_CATEGORY
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="evalution_setup" element={<EvaluationSetUp />} />
          </Route>
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.UPDATE_EVALUATION_CATEGORY
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="update_category" element={<UpdateCategory />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.DELETE_EVALUATION_CATEGORY
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="delete_category" element={<DeleteCategory />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.DELETE_EVALUATION_CATEGORY
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="delete_category" element={<DeleteCategory />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.ADD_EVALUATION_CRITERIA
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="update_criterial" element={<UpdateCriterial />} />
          </Route>
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.ADD_EVALUATION_CRITERIA
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="delete_criterial" element={<DeleteCriterial />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.UPDATE_EVALUATION_SESSION
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="update_session" element={<UpdateSession />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.DELETE_EVALUATION_SESSION
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="delete_session" element={<DeleteSession />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.DELETE_EVALUATION_SESSION
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="delete_session" element={<DeleteSession />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.UPDATE_EVALUATION_LEVEL
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="update_level" element={<UpdateLevel />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceNsame={
                  EvaluationServiceResourceName.ADD_EVALUATION_LEVEL
                }
                apiName="evaluation"

              />
            }
          >
            <Route path="delete_level" element={<DeleteLevel />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.UPDATE_EVALUATION_RESULT
                }
                apiName="evaluation"
              />
            }
          >
            <Route path="result" element={<CreateResult />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.DELETE_EVALUATION_RESULT
                }
                apiName="evaluation"
              />
            }
          >
            <Route path="delete_result" element={<DeleteResult />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  EvaluationServiceResourceName.UPDATE_EVALUATION_RESULT
                }
                apiName="evaluation"
              />
            }
          >
            <Route path="update_result" element={<UpdateResult />} />
          </Route>







        </Route>


        <Route path="delegation/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DelegationServiceResourceName.ADD_DELEGATION
                }
                apiName="delegation"

              />
            }
          >
            <Route path="create" element={<CreateDelegation />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DelegationServiceResourceName.ADD_DELEGATION
                }
                apiName="delegation"

              />
            }
          >
            <Route path="update" element={<UpdateDelegation />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DelegationServiceResourceName.ADD_DELEGATION
                }
                apiName="delegation"

              />
            }
          >
            <Route path="delete" element={<DeleteDelegation />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DelegationServiceResourceName.ADD_DELEGATION
                }
                apiName="delegation"

              />
            }
          >
            <Route path="terminate" element={<TerminateDelegation />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DelegationServiceResourceName.ADD_DELEGATION
                }
                apiName="delegation"

              />
            }
          >
            <Route path="list" element={<ListDelegation />} />
          </Route>

        </Route>


        <Route path="document/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.GET_ALL_DOCUMENT_TYPE
                }
                apiName="document"

              />
            }
          >
            <Route path="document_type" element={<CreateDocumentType />} />
          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.UPDATE_DOCUMENT_TYPE
                }
                apiName="document"

              />
            }
          >
            <Route path="update_documentType" element={<UpdateDocumentType />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.DELETE_DOCUMENT_TYPE
                }
                apiName="document"

              />
            }
          >
            <Route path="delete_documentType" element={<DeleteDocumentType />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.ADD_DOCUMENT
                }
                apiName="document"

              />
            }
          >
            <Route path="create" element={<CreateDocument />} />
          </Route>


          {/* <Route
          path="create"
          element={
            <RoleProtectedRoute NorequiredResourceName={true}>
              <CreateDocument />
            </RoleProtectedRoute>
          }
        />  */}


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.GET_ALL_DOCUMENT
                }
                apiName="document"

              />
            }
          >
            <Route path="list" element={<ListDocument />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.UPDATE_DOCUMENT
                }
                apiName="document"

              />
            }
          >
            <Route path="update" element={<UpdateDocument />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.UPDATE_DOCUMENT
                }
                apiName="document"

              />
            }
          >
            <Route path="delete" element={<DeleteDocument />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.APPROVE_DOCUMENT
                }
                apiName="document"

              />
            }
          >
            <Route path="approvance" element={<DocumentApprovance />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DocumentionServiceResourceName.APPROVE_DOCUMENT
                }
                apiName="document"

              />
            }
          >
            <Route path="generate" element={<GenerateDocument />} />
          </Route>









        </Route>


        <Route path="promotion/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_CRITERIA_NAME
                }
                apiName="promotion"

              />
            }
          >
            <Route path="criteria_name" element={<CreateName />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.DELETE_CRITERIA_NAME
                }
                apiName="promotion"

              />
            }
          >
            <Route path="deleteCriteria" element={<DeleteCriteria />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.UPDATE_CRITERIA_NAME
                }
                apiName="promotion"

              />
            }
          >
            <Route path="updateCriteria" element={<UpdateCriteria />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_CRITERIA_NAME
                }
                apiName="promotion"

              />
            }
          >
            <Route path="nestedcriteria" element={<NestedCriteria />} />
          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_CRITERIA_NAME
                }
                apiName="promotion"

              />
            }
          >
            <Route path="editednestedcriteria" element={<EditNestedCriteria />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_CRITERIA_NAME
                }
                apiName="promotion"

              />
            }
          >
            <Route path="deleteChildCriteria" element={<DeleteChildCriteria />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_PROMOTION_CRITERIA
                }
                apiName="promotion"

              />
            }
          >
            <Route path="CreatePromotionCriteria" element={<CreatePromotionCriteria />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.UPDATE_PROMOTION_CRITERIA
                }
                apiName="promotion"

              />
            }
          >
            <Route path="updatePromotionCriteria" element={<UpdatePromotionCriteria />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.DELETE_PROMOTION_CRITERIA
                }
                apiName="promotion"

              />
            }
          >
            <Route path="deletePromotionCriteria" element={<DeletePromotionCriteria />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_PROMOTE_CANDIDATE
                }
                apiName="promotion"

              />
            }
          >
            <Route path="createPromotionCandidate" element={<CreatePromotionCandidate />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.DELETE_CANDIDATE
                }
                apiName="promotion"

              />
            }
          >
            <Route path="deleteCandidate" element={<DeletePromotionCandidate />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.UPDATE_CANDIDATE
                }
                apiName="promotion"

              />
            }
          >
            <Route path="updatePromotionCandidates" element={<UpdatePromotionCandidate />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_CANDIDATE_EVALUATION
                }
                apiName="promotion"

              />
            }
          >
            <Route path="CreateCandidateEvaluation" element={<CreateCandidateEvaluation />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.UPDATE_CANDIDATE_EVALUATION
                }
                apiName="promotion"

              />
            }
          >
            <Route path="editevaluation" element={<EditCandidateEvaluation />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.DELETE_CANDIDATE_EVALUATION
                }
                apiName="promotion"

              />
            }
          >
            <Route path="deleteevaluation" element={<DeletCandidateEvaluation />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  PromotionServiceResourceName.ADD_PROMOTE_CANDIDATE
                }
                apiName="promotion"

              />
            }
          >
            <Route path="CreatePromoteCandidate" element={<CreatePromoteCandidate />} />
          </Route>










        </Route>


        <Route path="separation/">







          <Route
            path="create-termination"
            element={
              <RoleProtectedRoute NorequiredResourceName={true}>
                <CreateTermination />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="delete-termination"
            element={
              <RoleProtectedRoute NorequiredResourceName={true}>
                <DeleteTermination />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="update-termination"
            element={
              <RoleProtectedRoute NorequiredResourceName={true}>
                <UpdateTermination />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="create-retirement"
            element={
              <RoleProtectedRoute NorequiredResourceName={true}>
                <CreateRetirement />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="update-retirement"
            element={
              <RoleProtectedRoute NorequiredResourceName={true}>
                <UpdateRetirement />
              </RoleProtectedRoute>
            }
          />


          <Route
            path="delete-retirement"
            element={
              <RoleProtectedRoute NorequiredResourceName={true}>
                <DeleteRetirement />
              </RoleProtectedRoute>
            }
          />





          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_CLEARANCE_DEPARTMENT
                }
                apiName="separation"

              />
            }
          >
            <Route path="delete-clearance-department" element={<DeleteClearanceDepartment />} />

          </Route>




          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_CLEARANCE_DEPARTMENT
                }
                apiName="separation"

              />
            }
          >
            <Route path="update-clearance-department" element={<UpdateClearanceDepartment />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_CLEARANCE_DEPARTMENT
                }
                apiName="separation"

              />
            }
          >
            <Route path="create-clearance-department" element={<CreateClearanceDepartment />} />

          </Route>











          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.APPROVE_RETIREMENT
                }
                apiName="separation"

              />
            }
          >
            <Route path="approve-retirement" element={<ApproveRetirement />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.APPROVE_RETIREMENT
                }
                apiName="separation"

              />
            }
          >
            <Route path="list-retirement" element={<ListRetirement />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_CLEARANCE
                }
                apiName="separation"

              />
            }
          >
            <Route path="create-clearance-retirement" element={<CreateClearanceRetirement />} />

          </Route>











          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_CLEARANCE
                }
                apiName="separation"

              />
            }
          >
            <Route path="create-clearance-termination" element={<CreateClearanceTermination />} />

          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.APPROVE_TERMINATION
                }
                apiName="separation"

              />
            }
          >
            <Route path="approve-termination" element={<ApproveTermination />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.APPROVE_TERMINATION
                }
                apiName="separation"

              />
            }
          >
            <Route path="list-termination" element={<ListTermination />} />

          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_TERMINATION_TYPE
                }
                apiName="separation"

              />
            }
          >
            <Route path="update-termination-type" element={<UpdateTerminationType />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_TERMINATION_TYPE
                }
                apiName="separation"

              />
            }
          >
            <Route path="create-termination-type" element={<CreateTerminationType />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_TERMINATION_TYPE
                }
                apiName="separation"

              />
            }
          >
            <Route path="delete-termination-type" element={<DeleteTerminationType />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.GET_ALL_CLEARANCES
                }
                apiName="separation"

              />
            }
          >
            <Route path="list-clearance" element={<ListClearance />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_CLEARANCE
                }
                apiName="separation"

              />
            }
          >
            <Route path="update-clearance" element={<UpdateClearance />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  SeparationServiceResourceName.ADD_CLEARANCE
                }
                apiName="separation"

              />
            }
          >
            <Route path="delete-clearance" element={<DeleteClearance />} />

          </Route>






        </Route>



        <Route path="transfer/">


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.ADD_TRANSFER
                }
                apiName="transfer"

              />
            }
          >
            <Route path="create-transfer" element={<CreateTransfer />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.UPDATE_TRANSFER_REQUEST
                }
                apiName="transfer"

              />
            }
          >
            <Route path="update-transfer" element={<EditEmployeeTransfer />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.GET_ALL_TRANSFER_REQUEST
                }
                apiName="transfer"

              />
            }
          >
            <Route path="list" element={<ListTransfer />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.DELETE_TRANSFER_REQUEST
                }
                apiName="transfer"

              />
            }
          >
            <Route path="delete-transfer" element={<DeleteTransfer />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.UPDATE_TRANSFER_REQUEST
                }
                apiName="transfer"

              />
            }
          >
            <Route path="edit-transfer" element={<EditTransfer />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.APPROVE_TRANSFER_REQUEST
                }
                apiName="transfer"

              />
            }
          >
            <Route path="make-decision" element={<MakeDecision />} />

          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.ADD_ASSIGNMENT
                }
                apiName="transfer"

              />
            }
          >
            <Route path="direct_assigment" element={<CreateDirectAssignment />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.UPDATE_ASSIGNMENT
                }
                apiName="transfer"

              />
            }
          >
            <Route path="edit-direct-assignment" element={<EditDirectAssignment />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  TranferserviceResourseName.DELETE_ASSIGNMENT
                }
                apiName="transfer"

              />
            }
          >
            <Route path="delete-direct-assignment" element={<DeleteDirectAssignment />} />

          </Route>






        </Route>


        <Route path="discipline/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.ADD_DISCIPLINE_PENALTY
                }
                apiName="discipline"

              />
            }
          >
            <Route path="create-penalty" element={<CreatePenalty />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.UPDATE_DISCIPLINE_PENALTY
                }
                apiName="discipline"

              />
            }
          >
            <Route path="update-penalty" element={<UpdatePenalty />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.DELETE_DISCIPLINE_PENALTY
                }
                apiName="discipline"

              />
            }
          >
            <Route path="delete-penalty" element={<DeletePenalty />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.ADD_DISCIPLINE_OFFENSE
                }
                apiName="discipline"

              />
            }
          >
            <Route path="create-offense" element={<CreateOffense />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.UPDATE_DISCIPLINE_OFFENSE
                }
                apiName="discipline"

              />
            }
          >
            <Route path="update-offense" element={<UpdateOffense />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.DELETE_DISCIPLINE_OFFENSE
                }
                apiName="discipline"
              />
            }
          >
            <Route path="delete-offense" element={<DeleteOffense />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.ADD_DISCIPLINE
                }
                apiName="discipline"
              />
            }
          >
            <Route path="create-discipline" element={<CreateDiscipline />} />
          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.GET_ALL_DISCIPLINE
                }
                apiName="discipline"
              />
            }
          >
            <Route path="list-discipline" element={<ListDiscipline />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.DELETE_DISCIPLINE
                }
                apiName="discipline"
              />
            }
          >
            <Route path="delete-discipline" element={<DeleteDiscipline />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.APPROVE_DISCIPLINE
                }
                apiName="discipline"
              />
            }
          >
            <Route path="approve-discipline" element={<ApproveDiscipline />} />

          </Route>



          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.GET_DISCIPLINE_BY_OFFENDER_ID
                }
                apiName="discipline"
              />
            }
          >
            <Route path="list-discipline-for-user" element={<ListDisciplineForUser />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.UPDATE_DISCIPLINE
                }
                apiName="discipline"
              />
            }
          >
            <Route path="update-discipline" element={<UpdateDiscipline />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.ADD_DISCIPLINE_APPEAL
                }
                apiName="discipline"
              />
            }
          >
            <Route path="create-appeal" element={<CreateAppeal />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.ADD_DISCIPLINE_APPEAL
                }
                apiName="discipline"
              />
            }
          >
            <Route path="delete-appeal" element={<DeleteAppeal />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  DisciplineServiceResourceName.ADD_DISCIPLINE_APPEAL
                }
                apiName="discipline"
              />
            }
          >
            <Route path="update-appeal" element={<UpdateAppeal />} />

          </Route>


        </Route>

        <Route path="complaint/">
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  ComplaintServiceResourceName.CREATE_COMPLAINT_TYPE
                }
                apiName="complaint"

              />
            }
          >
            <Route path="create-complaint-type" element={<CreateComplaintType />} />

            <Route
              element={
                <RoleProtectedRoute
                  requiredResourceName={
                    ComplaintServiceResourceName.UPDATE_COMPLAINT_TYPE
                  }
                  apiName="complaint"

                />
              }
            >
              <Route path="update-complaint-type" element={<UpdateComplaintType />} />

              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.UPDATE_COMPLAINT_TYPE
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="delete-complaint-type" element={<DeleteComplaintType />} />

              </Route>


              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.UPDATE_COMPLAINT
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="create-complaint" element={<CreateComplaint />} />

              </Route>

              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.UPDATE_COMPLAINT
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="update-complaint" element={<UpdateComplaint />} />

              </Route>

              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.DELETE_COMPLAINT
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="delete-complaint" element={<DeleteComplaint />} />

              </Route>

              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.GET_ALL_COMPLAINT
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="list-complaints" element={<ListComplaint />} />

              </Route>


              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.GET_ALL_ATTACHMENTS
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="attachments-list" element={<ListAttachments />} />

              </Route>


              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.DELETE_ATTACHMENT
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="delete-attachment" element={<DeleteAttachment />} />

              </Route>



              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.GET_COMPLAINT_HANDLING_BY_DEPARTMENT_ID
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="list-complaint-handlings-by-department" element={<ListComplaintHandlingsByDepartment />} />

              </Route>


              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.DELETE_COMPLAINT_HANDLING
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="delete-complaint-handling" element={<DeleteComplaintHandling />} />

              </Route>


              <Route
                element={
                  <RoleProtectedRoute
                    requiredResourceName={
                      ComplaintServiceResourceName.UPDATE_COMPLAINT_HANDLING
                    }
                    apiName="complaint"

                  />
                }
              >
                <Route path="update-complaint-handling-decision" element={<UpdateComplaintHandlingDecision />} />

              </Route>

            </Route>


          </Route>




        </Route>



        <Route path="attendance/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_SHIFT
                }
                apiName="attendance"

              />
            }
          >
            <Route path="set_up" element={<AttendanceSetUp />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_SHIFT
                }
                apiName="attendance"

              />
            }
          >
            <Route path="updateshift" element={<UpdateShift />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_SHIFT
                }
                apiName="attendance"

              />
            }
          >
            <Route path="deleteshift" element={<DeleteShift />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_SHIFT
                }
                apiName="attendance"

              />
            }
          >
            <Route path="update-weekend" element={<UpdateWeekend />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_SHIFT
                }
                apiName="attendance"

              />
            }
          >
            <Route path="delete-weekend" element={<DeleteWeekend />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_OVERTIME
                }
                apiName="attendance"

              />
            }
          >
            <Route path="update-overtime" element={<UpdateOverTime />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_OVERTIME
                }
                apiName="attendance"

              />
            }
          >
            <Route path="delete-overtime" element={<DeleteOverTime />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_TIME_TOLERANCE
                }
                apiName="attendance"

              />
            }
          >
            <Route path='update-time-tolerance' element={<UpdateTimeTolerance />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_TIME_TOLERANCE
                }
                apiName="attendance"

              />
            }
          >
            <Route path='delete-time-tolerance' element={<DeleteTimeTolerance />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_EXCUSE_TYPE
                }
                apiName="attendance"

              />
            }
          >
            <Route path='update-excuse' element={<UpdateExcuse />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_EXCUSE_TYPE
                }
                apiName="attendance"

              />
            }
          >
            <Route path='delete-excuse' element={<DeleteExcuse />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_ATTENDANCE_STATUS
                }
                apiName="attendance"

              />
            }
          >
            <Route path='attendance-approval' element={<AttendanceApproval />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_ATTENDANCE_STATUS
                }
                apiName="attendance"

              />
            }
          >
            <Route path='hr-aproval' element={<HrApproval />} />
          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  AttendanceServiceResourceName.ADD_ATTENDANCE_LOG
                }
                apiName="attendance"

              />
            }
          >
            <Route path='create-attendance-log' element={<CreateAttendanceLog />} />
          </Route>













          <Route
            path="employee-attendance"
            element={
              <RoleProtectedRoute NorequiredResourceName={true}>
                <EmployeeAttendanceView />
              </RoleProtectedRoute>
            }
          />
        </Route>



        <Route path="item/">
          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  ItemServiceResourceName.ADD_ITEM
                }
                apiName="item"
              />
            }
          >
            <Route path="create-item" element={<CreateItem />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  ItemServiceResourceName.ADD_ITEM
                }
                apiName="item"
              />
            }
          >
            <Route path="delete-item" element={<DeleteItem />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  ItemServiceResourceName.UPDATE_ITEM
                }
                apiName="item"
              />
            }
          >
            <Route path="update-item" element={<UpdateItem />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  ItemServiceResourceName.CREATE_PURCHASE_INSPECTION
                }
                apiName="item"
              />
            }
          >
            <Route path="create-inspection" element={<CreateInspection />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  ItemServiceResourceName.UPDATE_PURCHASE_INSPECTION
                }
                apiName="item"
              />
            }
          >
            <Route path="update-inspection" element={<UpdateInspection />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  ItemServiceResourceName.DELETE_INSPECTION
                }
                apiName="item"
              />
            }
          >
            <Route path="delete-inspection" element={<DeleteInspection />} />

          </Route>



        </Route>

        <Route path="store/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.CREATE_SHELF
                }
                apiName="store"
              />
            }
          >
            <Route path="store_setup" element={<StoreSetUp />} />

          </Route>

         
             <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.UPDATE_STORE_CATEGORY
                }
                apiName="store"
              />
            }
          >
            <Route path="update-store-category" element={<UpdateStoreCategory />} />

          </Route>

           <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.DELETE_STORE_CATEGORY
                }
                apiName="store"
              />
            }
          >
            <Route path="delete-store-category" element={<DeleteStoreCategory />} />

          </Route>

            <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.UPDATE_STORE
                }
                apiName="store"
              />
            }
          >
            <Route path="update-store" element={<UpdateStore />} />

          </Route>

           <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.DELETE_STORE
                }
                apiName="store"
              />
            }
          >
            <Route path="delete-store" element={<DeleteStore />} />

          </Route>




          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.CREATE_STORE_REQUISITION
                }
                apiName="store"
              />
            }
          >
            <Route path="create-store-requisition" element={<CreateStoreRequisition />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.UPDATE_STORE_REQUISITION
                }
                apiName="store"
              />
            }
          >
            <Route path="update-store-requisition" element={<UpdateStoreRequisition />} />

          </Route>


          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.UPDATE_STORE_REQUISITION
                }
                apiName="store"
              />
            }
          >
            <Route path="delete-store-requisition" element={<DeleteStoreRequisition />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.CREATE_RECEIVABLE_ITEM
                }
                apiName="store"
              />
            }
          >
            <Route path="create-receivable-item" element={<CreateReceivableItem />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.UPDATE_RECEIVABLE_ITEM
                }
                apiName="store"
              />
            }
          >
            <Route path="update-receivable-item" element={<UpdateReceivableItem />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.DELETE_RECEIVABLE_ITEM
                }
                apiName="store"
              />
            }
          >
            <Route path="delete-receivable-item" element={<DeleteReceivableItem />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.CREATE_ISSUABLE_ITEM
                }
                apiName="store"
              />
            }
          >
            <Route path="create-issuable-item" element={<CreateIssuableItem />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.CREATE_ISSUABLE_ITEM
                }
                apiName="store"
              />
            }
          >
            <Route path="update-issuable-item" element={<UpdateIssuableItem />} />

          </Route>

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreServiceResourceName.DELETE_ISSUABLE_ITEM
                }
                apiName="store"
              />
            }
          >
            <Route path="delete-issuable-item" element={<DeleteIssuableItem />} />

          </Route>



        </Route>



           <Route path="storeMovent/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.ADD_STORE_ISSUE_VOUCHER
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="create_storeIssued_voucher" element={<CreateStoreIssueVoucher />} />

          </Route>

             <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.UPDATE_STORE_ISSUE_VOUCHER
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="update_storeIssued_voucher" element={<UpdateStoreIssueVoucher />} />

          </Route>

            <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.DELETE_STORE_ISSUE_VOUCHER
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="delete_storeIssued_voucher" element={<DeleteStoreIssueVoucher />} />

          </Route>

          
            <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.ADD_GOOD_RECEIVING_NOTE
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="create_goodReceiving_note" element={<CreateGoodReceivingNote />} />

          </Route>

            <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.UPDATE_GOOD_RECEIVING_NOTE
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="update_goodReceiving_note" element={<UpdateGoodReceivingNote />} />

          </Route>

           <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.DELETE_GOOD_RECEIVING_NOTE
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="delete_goodReceiving_note" element={<DeleteGoodReceivingNote />} />

          </Route>

            <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.ADD_GATE_PASS_INFORMATION
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="create_gatepass_infomation" element={<CreateGatePassInformation />} />

          </Route>

           <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.UPDATE_GATE_PASS_INFORMATION
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="update_gatepass_infomation" element={<UpdateGatePassInformation />} />

          </Route>

              <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.DELETE_GATE_PASS_INFORMATION
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="delete_gatepass_infomation" element={<DeleteGatePassInformation />} />

          </Route>


             <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.APPROVE_GATE_PASS_INFORMATION
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="decision_gatepass_infomation" element={<DecisionGatePassInformation />} />

          </Route>

          
             <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.ADD_INTER_STORE_ISSUE_VOUCHER_FOR_ISSUE
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="create_inter_Store_Issue" element={<CreateInterStoreIssueVoucherForIssue />} />

          </Route>

             <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.UPDATE_INTER_STORE_ISSUE_VOUCHER_FOR_ISSUE
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="update_inter_Store_Issue" element={<UpdateInterStoreIssueVoucherForIssue />} />

          </Route>

           <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.DELETE_INTER_STORE_ISSUE_VOUCHER_FOR_ISSUE
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="delete_inter_Store_Issue" element={<DeleteInterStoreIssueVoucherForIssue />} />

          </Route>

               <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.APPROVE_INTER_STORE_ISSUE_VOUCHER_FOR_ISSUE
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="decision_inter_Store_Issue" element={<DecisionInterStoreIssueVoucherForIssue />} />

          </Route>

           <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.ADD_INTER_STORE_ISSUE_VOUCHER_FOR_RECEIVING
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="create_inter_Store_receiving" element={<CreateInterStoreIssueVoucherForReceiving />} />

          </Route>

            <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.UPDATE_INTER_STORE_ISSUE_VOUCHER_FOR_RECEIVING
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="update_inter_Store_receiving" element={<UpdateInterStoreIssueVoucherForReceiving />} />

          </Route>

           <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  StoreMovementServiceResourceName.DELETE_INTER_STORE_ISSUE_VOUCHER_FOR_RECEIVING
                } 
                apiName="storeMovement"
              />
            }
          >
            <Route path="delete_inter_Store_receiving" element={<DeleteInterStoreIssueVoucherForReceiving />} />

          </Route>



    

        </Route>


           <Route path="asset/">

          <Route
            element={
              <RoleProtectedRoute
                requiredResourceName={
                  FixedAssetServiceResourceName.GET_ALL_RESOURCES
                } 
                apiName="fixedAsset"
              />
            }
          >
            <Route path="create_fixed_asset" element={<CreateFixedAsset />} />

          </Route>



        </Route>





      </Route>


      {/* Not found route */}
      <Route path="*" element={<NotFound />} />
    </Route>
    
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AuthProvider>
  </React.StrictMode>
);













