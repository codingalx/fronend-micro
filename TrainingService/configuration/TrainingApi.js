import axios from "axios";

const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_TRAINING = `${BASE_URL}/training`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_LEAVE = `${BASE_URL}/leave`;

const createApiClient = (baseURL) => {
  const apiClient = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
  });

  // Add request interceptor for setting the token
  apiClient.interceptors.request.use(
    async config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Add response interceptor for handling token refresh
  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            const data = new URLSearchParams({
              grant_type: 'refresh_token',
              client_id:  import.meta.env.KEYCLOAK_CLIENT_ID || 'saas-client',
              client_secret: import.meta.env.KEYCLOAK_CLIENT_SECRET  ||'APHalzvUVsfz9Jffe5ZAZ1XImFwv5a8K',
              refresh_token: refreshToken
            });

            const response = await axios.post(
              KEYCLOAK_BASE_URL,
              data,
              { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const newAccessToken = response.data.access_token;
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

const apiClient_leave = createApiClient(REST_API_BASE_URL_LEAVE);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);
const apiClient_training = createApiClient(REST_API_BASE_URL_TRAINING);




  export const getEmployeeByEmployeId = (tenantId,employeeId) => {
    const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
    return  apiClient_employee.get(url);
  };


export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_training.get(url);
};


export const getResourceEmployeeByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_employee.get(url);
};


export const listEmployeeData = (tenantId) => {
const url = `employees/${tenantId}/get-all`;
return apiClient_employee.get(url);
};
 

export const getTenantById = (tenantId) => {
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};

//the apis related with training

export const addCourseCategory = (tenantId,category) => {
  return apiClient_training.post(`course-categories/${tenantId}/add`, category);
};

export const updateCourseCategory = (tenantId,categoryID, data) => {
  return apiClient_training.put(
    `course-categories/${tenantId}/update/${categoryID}`,
    data
  );
};
export const listLocation = (tenantId) => {
  return apiClient_organization.get(`locations/${tenantId}/get-all`);
};
 export const getLocationById = (tenantId,id) => {
    return apiClient_organization.get(`locations/${tenantId}/get/${id}`);
    };
     export const getDepartementById = (tenantId,departmentId) => {
        return apiClient_organization.get(`departments/${tenantId}/get/${departmentId}`);
      };

export const deleteTrainingCourseCategory = (tenantId,categoryId) => {
  return apiClient_training.delete(
    `course-categories/${tenantId}/delete/${categoryId}`
  );
};

export const getTrainingCourseCategoryById = (tenantId,categoryId) => {
  return apiClient_training.get(`course-categories/${tenantId}/get/${categoryId}`);
};

export const addCourseTraining = (tenantId,coursetraining) => {
  return apiClient_training.post(`training-courses/${tenantId}/add`, coursetraining);
};

export const listCourseTraining = (tenantId,categoryId) => {
  return apiClient_training.get(`training-courses/${tenantId}/get-all/${categoryId}`);
};

export const listCourseCategory = (tenantId) => {
  return apiClient_training.get(`course-categories/${tenantId}/get-all`);
};

export const deleteTrainingCourses = (tenantId,courseId) => {
  return apiClient_training.delete(`training-courses/${tenantId}/delete/${courseId}`);
};

export const getCourseTrainingById = (tenantId,courseId) => {
  return apiClient_training.get(`training-courses/${tenantId}/get/${courseId}`);
};

export const updateCourseTraining = (tenantId,courseId, data) => {
  return apiClient_training.put(
    `training-courses/${tenantId}/update/${courseId}`,
    data
  );
};

export const listCourseTrainingByCategory = (tenantId,categoryId) => {
  return apiClient_training.get(`training-courses/${tenantId}/get-all/${categoryId}`);
};

// Training Institution APIs
export const addTrainingInstution = (tenantId,trainingInstution) => {
  return apiClient_training.post(
    `training-institutions/${tenantId}/add`,
    trainingInstution
  );
};

export const listTrainingInstution = (tenantId) => {
  return apiClient_training.get(`training-institutions/${tenantId}/get-all`);
};

export const getTrainingInstutionById = (tenantId,instutionId) => {
  return apiClient_training.get(`training-institutions/${tenantId}/get/${instutionId}`);
};

export const updateTrainingInstution = (tenantId,instutionId, data) => {
  return apiClient_training.put(
    `training-institutions/${tenantId}/update/${instutionId}`,
    data
  );
};

export const deleteTrainingInstution = (tenantId,instutionId) => {
  return apiClient_training.delete(
    `training-institutions/${tenantId}/delete/${instutionId}`
  );
};

// create api for Annumal Training Request and related apis

export const addAnnualTrainingRequest = (tenantId,trainingsRequest) => {
  return apiClient_training.post(`trainings/${tenantId}/add`, trainingsRequest);
};

export const getAnnualTrainingById = (tenantId,trainingId) => {
  return apiClient_training.get(`trainings/${tenantId}/get/${trainingId}`);
};

export const getTrainingStatusByStatus = (tenantId,status) => {
  return apiClient_training.get(`trainings/${tenantId}/get/status`, {
    params: {
      "training-status": status,
    },
  });
};
export const listOfAnnualTrainingRequest = (tenantId) => {
  console.log("Tenant ID:", tenantId); // Debugging line
  return apiClient_training.get(`trainings/${tenantId}/get-all`);
};

export const deleteAnnualTrainingRequest = (tenantId,trainingId) => {
  return apiClient_training.delete(`trainings/${tenantId}/delete/${trainingId}`);
};

export const listOfdepartement = (tenantId) => {
  return apiClient_organization.get(`departments/${tenantId}/get-all`);
};

export const listOfdepartementType = (tenantId) => {
  return apiClient_organization.get(`department-types/${tenantId}/get-all`);
};

export const listOfPayGrade = (tenantId) => {
  return apiClient_organization.get(`pay-grades/${tenantId}/get-all`);
};
export const listFieldStudies = (tenantId) => {
  return apiClient_organization.get(`field-of-studies/${tenantId}/get-all`);
};

export const getAllPaygradeByJobId = (tenantId,jobGradeId) => {
  return apiClient_organization.get(`pay-grades/${tenantId}/jobgrade/${jobGradeId}`);
};
 export const listEducationLevels = (tenantId) => {
    return apiClient_organization.get(`education-levels/${tenantId}/get-all`);
  };
  export const listAllCountry = (tenantId) => {
    return  apiClient_employee.get(`countries/${tenantId}/get-all`);
  };
  

export const listOfBudgetYears = (tenantId) => {
  return apiClient_leave.get(`budget-years/${tenantId}/get-all`);
};

export const updateAnnualTrainingRequest = (tenantId,trainingId, data) => {
  return apiClient_training.put(`trainings/${tenantId}/update/${trainingId}`, data);
};

export const trainingRequestStatus = (tenantId,trainingId, data) => {
  return apiClient_training.put(`trainings/${tenantId}/approve/${trainingId}`, data);
};

//craete api for traineer participants
export const addTrainingparticipant = (tenantId,trainingId, data) => {
  return apiClient_training.post(
    `training-participants/${tenantId}/${trainingId}/add`,
    data
  );
};

export const listOfTrainingParticipant = (tenantId,trainingId) => {
  return apiClient_training.get(
    `training-participants/${tenantId}/${trainingId}/get-all`
  );
};

export const deleteParticipants = (tenantId,trainingId, participantId) => {
  return apiClient_training.delete(
    `training-participants/${tenantId}/${trainingId}/delete/${participantId}`
  );
};

export const getTrainingParticipantsById = (tenantId,trainingId, participantId) => {
  return apiClient_training.get(
    `training-participants/${tenantId}/${trainingId}/get/${participantId}`
  );
};

export const updateTrainingPaercipants = (tenantId,trainingId, participantId, data) => {
  return apiClient_training.put(
    `training-participants/${tenantId}/${trainingId}/update/${participantId}`,
    data
  );
};

// list  of api s for annual training plan
export const createAnnualTrainingPlan = (tenantId,trainingPlan) => {
  return apiClient_training.post(`annual-training-plans/${tenantId}/add`, trainingPlan);
};

export const listAnnualTrainingPlan = (tenantId) => {
  return apiClient_training.get(`annual-training-plans/${tenantId}/get-all`);
};

export const getAnnualTrainingPlanByDepartement = (tenantId,departmentId) => {
  return apiClient_training.get(
    `annual-training-plans/${tenantId}/get/department/${departmentId}`
  );
};

export const deleteAnnualTrainingPlan = (tenantId,trainingPlanId) => {
  return apiClient_training.delete(
    `annual-training-plans/${tenantId}/delete/${trainingPlanId}`
  );
};

export const getAnnualTrainingPlanById = (tenantId,trainingPlanId) => {
  return apiClient_training.get(
    `annual-training-plans/${tenantId}/get/${trainingPlanId}`
  );
};

export const updateAnnualTrainingPlan = (tenantId,trainingPlanId, trainingPlan) => {
  return apiClient_training.put(
    `annual-training-plans/${tenantId}/update/${trainingPlanId}`,
    trainingPlan
  );
};

// create list of  pre-service training
export const addCourseType = (tenantId,courseType) => {
  return apiClient_training.post(`course-types/${tenantId}/add`, courseType);
};

export const getCourseTypeById = (tenantId,cousetypeId) => {
  return apiClient_training.get(`course-types/${tenantId}/get/${cousetypeId}`);
};
export const deleteCourseType = (tenantId,courseTypeId) => {
  return apiClient_training.delete(`course-types/${tenantId}/delete/${courseTypeId}`);
};

export const listCourseType = (tenantId) => {
  return apiClient_training.get(`course-types/${tenantId}/get-all`);
};

export const updateCourseType = (tenantId,cousetypeId, data) => {
  return apiClient_training.put(`course-types/${tenantId}/update/${cousetypeId}`, data);
};

export const addPreCourse = (tenantId,preServiceCourses) => {
  return apiClient_training.post(
    `pre-service-courses/${tenantId}/add`,
    preServiceCourses
  );
};

export const listAllCourse = (tenantId) => {
  return apiClient_training.get(`pre-service-courses/${tenantId}/get-all`);
};

export const listPreCourse = (tenantId,courseTypeId) => {
  return apiClient_training.get(
    `pre-service-courses/${tenantId}/get/course-type/${courseTypeId}`
  );
};

export const deletePreCourse = (tenantId,courseId) => {
  return apiClient_training.delete(
    `pre-service-courses/${tenantId}/delete/${courseId}`
  );
};

export const getPreServiceCourseById = (tenantId,precourseId) => {
  return apiClient_training.get(`pre-service-courses/${tenantId}/get/${precourseId}`);
};
export const updatePreServiceCourse = (tenantId,precourseId, data) => {
  return apiClient_training.put(
    `pre-service-courses/${tenantId}/update/${precourseId}`,
    data
  );
};

export const addPreServiceTraining = (tenantId,data) => {
  const url = `pre-service-trainees/${tenantId}/add`;
  return apiClient_training.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePreServiceTraining = (tenantId,traineeId, data) => {
  const url = `pre-service-trainees/${tenantId}/update/${traineeId}`;
  return apiClient_training.put(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getPreServiceTrainingImageById = async (tenantId,preServiceTrainingId) => {
  // Ensure tenantId is retrieved here
  const url = `pre-service-trainees/${tenantId}/download-image/${preServiceTrainingId}`;

  // Make sure to set responseType to 'blob' if you expect a binary image file
  const response = await apiClient_training.get(url, { responseType: "blob" });

  // Create an object URL from the response data (blob)
  const imageUrl = URL.createObjectURL(response.data);

  return imageUrl;
};

export const listPreServiceTraining = (tenantId) => {
  return apiClient_training.get(`pre-service-trainees/${tenantId}/get-all`);
};

export const deletePresServiceTraining = (tenantId,traineeId) => {
  return apiClient_training.delete(
    `pre-service-trainees/${tenantId}/delete/${traineeId}`
  );
};

export const getPreServiceTrainingByYearId = (tenantId,yearId) => {
  return apiClient_training.get(`pre-service-trainees/${tenantId}/get-all/${yearId}`);
};

export const getPreServiceTrainingById = (tenantId,traineeId) => {
  return apiClient_training.get(`pre-service-trainees/${tenantId}/get/${traineeId}`);
};

export const getPreServiceTraineeCourseById = (tenantId,traineeId) => {
  return apiClient_training.get(
    `pre-service-courses/${tenantId}/get/trainee-courses/${traineeId}`
  );
};

export const deletePreServiceTraineeCourse = (tenantId,traineeId, courseId) => {
  return apiClient_training.delete(
    `pre-service-courses/${tenantId}/remove-trainee-course/${traineeId}/${courseId}`
  );
};

export const updatePreServiceTrainieeCourese = (tenantId,traineeId, data) => {
  return apiClient_training.put(
    `pre-service-trainees/${tenantId}/add-courses/${traineeId}`,
    data
  );
};

export const createPreServiceTraineeResult = (tenantId,traineeId, courseId, data) => {
  return apiClient_training.post(
    `trainee-results/${tenantId}/add/${traineeId}/${courseId}`,
    data
  );
};

export const listPreServiceTraineeResult = (tenantId,courseId) => {
  return apiClient_training.get(
    `trainee-results/${tenantId}/get/course-results/${courseId}`
  );
};

export const deletePreServiceTraineeResult = (tenantId,resultId) => {
  return apiClient_training.delete(`trainee-results/${tenantId}/delete/${resultId}`);
};

export const getPreServiceTraineeCourseResultById = (
  tenantId,
  traineeId,
  courseId,
  resultId
) => {
  return apiClient_training.get(
    `trainee-results/${tenantId}/get/${traineeId}/${courseId}/${resultId}`
  );
};

export const updatePreServiceTraineeResult = (
  tenantId,
  traineeId,
  courseId,
  resultId,
  data
) => {
  return apiClient_training.put(
    `trainee-results/${tenantId}/update/${traineeId}/${courseId}/${resultId}`,
    data
  );
};

// create api for university
export const createUniversity = (tenantId,data) => {
  return apiClient_training.post(`universities/${tenantId}/add`, data);
};

export const listOfUniversity = (tenantId) => {
  return apiClient_training.get(`universities/${tenantId}/get-all`);
};

export const deleteUniversity = (tenantId,universityId) => {
  return apiClient_training.delete(`universities/${tenantId}/delete/${universityId}`);
};

export const getUniversityById = (tenantId,universityId) => {
  return apiClient_training.get(`universities/${tenantId}/get/${universityId}`);
};

export const updateUniversity = (tenantId,universityId, data) => {
  return apiClient_training.put(
    `universities/${tenantId}/update/${universityId}`,
    data
  );
};

export const createInternshipStudents = (tenantId,data) => {
  return apiClient_training.post(`internship-students/${tenantId}/add`, data);
};

// Assuming this is defined in Services/apiData.js or similar
export const listInternshipStudents = (tenantId,budgetTypeId, semester) => {
  // Or however you're getting the tenant ID
  let url = `internship-students/${tenantId}/get-all`;

  if (budgetTypeId && semester) {
    url += `/${budgetTypeId}?Semester=${semester}`;
  }

  return apiClient_training.get(url);
};

export const deleteInternshipStudents = (tenantId,internId) => {
  return apiClient_training.delete(
    `internship-students/${tenantId}/delete/${internId}`
  );
};

export const getInternshipStudents = (tenantId,internId) => {
  return apiClient_training.get(`internship-students/${tenantId}/get/${internId}`);
};

export const updateInternshipStudents = (tenantId,internId, data) => {
  return apiClient_training.put(
    `internship-students/${tenantId}/update/${internId}`,
    data
  );
};

export const assignDepartment = (tenantId,internId, data) => {
  return apiClient_training.put(
    `internship-students/${tenantId}/assign-department/${internId}`,
    data
  );
};

export const assignInternStudentStatus = (tenantId,internId, status) => {
  return apiClient_training.put(
    `internship-students/${tenantId}/assign-status/${internId}`,
    null, // No request body is needed
    {
      params: {
        status, // Pass the status as a query parameter
      },
    }
  );
};

//create the list  of interniship payment for complete if there is a payment
export const createInternshipPayment = (tenantId,data) => {
  return apiClient_training.post(`internship-payments/${tenantId}/add`, data);
};

export const listInternshipPayments = (tenantId) => {
  return apiClient_training.get(`internship-payments/${tenantId}/get-all`);
};

export const getInternshipPaymentById = (tenantId,paymentId) => {
  return apiClient_training.get(`internship-payments/${tenantId}/get/${paymentId}`);
};

export const updateInternshipPayement = (tenantId,paymentId, data) => {
  return apiClient_training.put(
    `internship-payments/${tenantId}/update/${paymentId}`,
    data
  );
};

export const deleteInternshipPayement = (tenantId,paymentId) => {
  return apiClient_training.delete(
    `internship-payments/${tenantId}/delete/${paymentId}`
  );
};

//create the list  of api for education Opportunity
export const createEducationOpportunity = (tenantId,data) => {
  return apiClient_training.post(`education-opportunities/${tenantId}/add`, data);
};

export const listEducationOpportunity = (tenantId) => {
  return apiClient_training.get(`education-opportunities/${tenantId}/get-all`);
};

export const deleteEducationOpportunity = (tenantId,educationId) => {
  return apiClient_training.delete(
    `education-opportunities/${tenantId}/delete/${educationId}`
  );
};

export const getEducationOpportunityById = (tenantId,educationId) => {
  return apiClient_training.get(
    `education-opportunities/${tenantId}/get/${educationId}`
  );
};

export const updateeducationOpportunity = (tenantId,educationId, data) => {
  return apiClient_training.put(
    `education-opportunities/${tenantId}/update/${educationId}`,
    data
  );
};
export const getAllQualification = (tenantId) => {
  return apiClient_organization.get(`qualifications/${tenantId}/get-all`);
};

//create the list  of api for checked documents
export const createDocumentChecked = (tenantId,data) => {
  return apiClient_training.post(`documents/${tenantId}/add`, data);
};

export const listDocumentChecked = (tenantId,data) => {
  return apiClient_training.get(`documents/${tenantId}/get-all`, data);
};
export const deleteDocumentChecked = (tenantId,decumentId) => {
  return apiClient_training.delete(`documents/${tenantId}/delete/${decumentId}`);
};
export const getDocuments = (tenantId) => {
  return apiClient_training.get(`documents/${tenantId}/get-all`);
};

export const getDocumentCheckedById = (tenantId,decumentId) => {
  return apiClient_training.get(`documents/${tenantId}/get/${decumentId}`);
};

export const updateDocumentChecked = (tenantId,decumentId, data) => {
  return apiClient_training.put(`documents/${tenantId}/update/${decumentId}`, data);
};
