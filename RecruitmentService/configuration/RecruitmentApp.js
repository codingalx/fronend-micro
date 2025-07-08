import axios from "axios";
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_RECRUITMENT = `${BASE_URL}/recruitment`;


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

const apiClient_recruitment = createApiClient(REST_API_BASE_URL_RECRUITMENT);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);





export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_recruitment.get(url);
};

export const getResourceEmployeeByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_employee.get(url);
};

 export const listLanguageName = (tenantId) => {
    const url = `language-names/${tenantId}/get-all`;
    return apiClient_employee.get(url);
  };


export const listEmployeeData = (tenantId) => {
const url = `employees/${tenantId}/get-all`;
return apiClient_employee.get(url);
};
 



export const getTenantById = (tenantId)  => {
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};

// paygrade apis
export const listPayGrade = (tenantId) => {
  return apiClient_organization.get(`pay-grades/${tenantId}/get-all`);
};

export const getAllPaygradeByJobId = (tenantId, jobGradeId) => {
  return apiClient_organization.get(
    `pay-grades/${tenantId}/jobgrade/${jobGradeId}`
  );
};
export const fetchJobGradeByJobId = (tenantId,jobId) => {
  return apiClient_organization.get(`job-registrations/${tenantId}/get/${jobId}`);
};


export const jobGradeById = (tenantId ,jobGradeId) => {
  return apiClient_organization.get(`job-grades/${tenantId}/get/${jobGradeId}`);
};

export const getJoblistByDepartementId = (tenantId, departmentId) => {
  return apiClient_organization.get(
    `job-registrations/${tenantId}/jobs/${departmentId}`
  );
};
export const listDepartement = (tenantId) => {
  return apiClient_organization.get(`departments/${tenantId}/get-all`);
};
export const getDepartementById = (tenantId, departmentId) => {
  return apiClient_organization.get(`departments/${tenantId}/get/${departmentId}`);
};

export const listJobRegestration = (tenantId) => {
  return apiClient_organization.get(`job-registrations/${tenantId}/get-all`);
};

export const listLocation = (tenantId) => {
  return apiClient_organization.get(`locations/${tenantId}/get-all`);
};
//mediaType
export const createMediaType = (tenantId,values) => {
  return apiClient_recruitment.post(`/media-types/${tenantId}/add`,values);
};

export const listMediaType = (tenantId)  => {
  const url = `media-types/${tenantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const getMediaTypeById = (tenantId,mediaTypeId) => {
  return apiClient_recruitment.get(`/media-types//${tenantId}/get/${mediaTypeId}`);
};
export const updateMediaType = (tenantId,mediaTypeId,data) => {
  return apiClient_recruitment.put(`/media-types/${tenantId}/update/${mediaTypeId}`,data);
};

export const deleteMedaiType = (tenantId,mediaTypeId) => {
  return apiClient_recruitment.delete(`/media-types//${tenantId}/delete/${mediaTypeId}`);
};
export const getMediatypeByadvertisementId = (tenantId,advertismentId) => {
  return apiClient_recruitment.get(`/media-types/${tenantId}/get/advertisement-media/${advertismentId}`);
};


export const listEducationLevels = (tenantId) => {
  return apiClient_organization.get(`education-levels/${tenantId}/get-all`);
};
export const listFieldStudies = (tenantId) => {
  return apiClient_organization.get(`field-of-studies/${tenantId}/get-all`);
};

export const listAllCountry = (tenantId) => {
  return apiClient_employee.get(`countries/${tenantId}/get-all`);
};

export const createCountry = (tenantId, data) => {
  const url = `countries/${tenantId}/add`;
  return apiClient_employee.post(url, data);
};

export const deleteCountry = (tenantId, countryId) => {
  const url = `countries/${tenantId}/delete/${countryId}`;
  return apiClient_employee.delete(url);
};

export const getCountryById = (tenantId, countryId) => {
  const url = `countries/${tenantId}/get/${countryId}`;
  return apiClient_employee.get(url);
};

export const updateCountry = (tenantId, countryId, data) => {
  const url = `countries/${tenantId}/update/${countryId}`;
  return apiClient_employee.put(url, data);
};

//duty station apis
export const createDutyStation = (tenantId, data) => {
  const url = `duty-stations/${tenantId}/add`;
  return apiClient_employee.post(url, data);
};

export const listDutyStation = (tenantId) => {
  const url = `duty-stations/${tenantId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteDutyStation = (tenantId, dutyStationId) => {
  const url = `duty-stations/${tenantId}/delete/${dutyStationId}`;
  return apiClient_employee.delete(url);
};

export const getDutyStationById = (tenantId, dutyStationId) => {
  const url = `duty-stations/${tenantId}/get/${dutyStationId}`;
  return apiClient_employee.get(url);
};

export const updateDutyStation = (tenantId, dutyStationId, data) => {
  const url = `duty-stations/${tenantId}/update/${dutyStationId}`;
  return apiClient_employee.put(url, data);
};
  export const getEmployeeByEmployeId = (tenantId,employeeId) => {
    const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
    return  apiClient_employee.get(url);
  };

export const createTitleName = (tenantId, data) => {
  const url = `title-names/${tenantId}/add`;
  return apiClient_employee.post(url, data);
};
export const listTitleName = (tenantId) => {
  const url = `title-names/${tenantId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteTitleName = (tenantId, titleNameId) => {
  const url = `title-names/${tenantId}/delete/${titleNameId}`;
  return apiClient_employee.delete(url);
};

export const getTitleNameById = (tenantId, titleNameId) => {
  const url = `title-names/${tenantId}/get/${titleNameId}`;
  return apiClient_employee.get(url);
};

export const updateTitleName = (tenantId, titleNameId, data) => {
  const url = `title-names/${tenantId}/update/${titleNameId}`;
  return apiClient_employee.put(url, data);
};

export const addRecruitment = (tenantId,data) => {
  const url = `recruitments/${tenantId}/add`;
  return apiClient_recruitment.post(url, data);
};

export const listRecruitment = (tenantId)  => {
  const url = `recruitments/${tenantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteRecruitment = (tenantId,recruitmentId) => {
  const url = `recruitments/${tenantId}/delete/${recruitmentId}`;
  return apiClient_recruitment.delete(url);
};

export const getRecruitmentbyId = (tenantId,recruitmentId) => {
  const url = `recruitments/${tenantId}/get/${recruitmentId}`;
  return apiClient_recruitment.get(url);
};

export const editRecruitment = (tenantId,recruitmentId, data) => {
  const url = `recruitments/${tenantId}/update/${recruitmentId}`;
  return apiClient_recruitment.put(url, data);
};

export const editRecruitmentbyapprove = (tenantId,recruitmentId, data) => {
  const url = `recruitments/${tenantId}/approve/${recruitmentId}`;
  return apiClient_recruitment.put(url, data);
};

// Advertisement APIs
export const addAdvertisement = (tenantId,data) => {
  const url = `advertisements/${tenantId}/add`;
  return apiClient_recruitment.post(url, data);
};

export const listAdvertisement = (tenantId)  => {
  const url = `advertisements/${tenantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteAdvertisement = (tenantId,advertisementId) => {
  const url = `advertisements/${tenantId}/delete/${advertisementId}`;
  return apiClient_recruitment.delete(url);
};

export const editAdvertisement = (tenantId,advertisementId, data) => {
  const url = `advertisements/${tenantId}/update/${advertisementId}`;
  return apiClient_recruitment.put(url, data);
};

export const getAdvertisementbyId = (tenantId,advertisementId) => {
  const url = `advertisements/${tenantId}/get/${advertisementId}`;
  return apiClient_recruitment.get(url);
};



// create apis for applicants
export const addAssessment = (tenantId,data) => {
  const url = `assessment-weights/${tenantId}/add`;
  return apiClient_recruitment.post(url, data);
};

export const listAssessment = (tenantId)  => {
  const url = `assessment-weights/${tenantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteAssessment = (tenantId,assessmentId) => {
  const url = `assessment-weights/${tenantId}/delete/${assessmentId}`;
  return apiClient_recruitment.delete(url);
};

export const getAssessmentbyId = (tenantId,assessmentId) => {
  const url = `assessment-weights/${tenantId}/get/${assessmentId}`;
  return apiClient_recruitment.get(url);
};
export const getAssessmentBYrecruitmentId = (tenantId,recruitmentId) => {
  const url = `assessment-weights/${tenantId}/get/recruitment/${recruitmentId}`;
  return apiClient_recruitment.get(url);
};

export const editAssessment = (tenantId,assessmentId, data) => {
  const url = `assessment-weights/${tenantId}/update/${assessmentId}`;
  return apiClient_recruitment.put(url, data);
};


export const addApplicant = (tenantId,data) => {
  const url = `applicants/${tenantId}/add`;
  return apiClient_recruitment.post(url, data);
};


export const listApplicant = (tenantId,recruitmentId) => {
  const url = `applicants/${tenantId}/${recruitmentId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteApplicant = (tenantId,applicantId) => {
  const url = `applicants/${tenantId}/delete/${applicantId}`;
  return apiClient_recruitment.delete(url);
};

export const getApplicantbyId = (tenantId,applicantId) => {
  const url = `applicants/${tenantId}/get/${applicantId}`;
  return apiClient_recruitment.get(url);
};

export const editApplicant = (tenantId,applicantId, data) => {
  const url = `applicants/${tenantId}/update/${applicantId}`;
  return apiClient_recruitment.put(url, data);
};

export const addCriteria = (tenantId,data) => {
  const url = `shortlist-criteria/${tenantId}/add`;
  return apiClient_recruitment.post(url, data);
};

export const listCriteria = (tenantId,recruitmentId) => {
  const url = `shortlist-criteria/${tenantId}/get-all/${recruitmentId}`;
  return apiClient_recruitment.get(url);
};

export const deleteCriteria = (tenantId,criteriaId) => {
  const url = `shortlist-criteria/${tenantId}/delete/${criteriaId}`;
  return apiClient_recruitment.delete(url);
};

export const getCriteriaById = (tenantId,criteriaId) => {
  const url = `shortlist-criteria/${tenantId}/get/${criteriaId}`;
  return apiClient_recruitment.get(url);
};

export const editCriteria = (tenantId,criteriaId, data) => {
  const url = `shortlist-criteria/${tenantId}/update/${criteriaId}`;
  return apiClient_recruitment.put(url, data);
};
export const addApplicantTraining = (tenantId,applicantId, data) => {
  const url = `applicant-trainings/${tenantId}/${applicantId}/add`;
  return apiClient_recruitment.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editApplicantCertificate = (tenantId,applicantId, trainingId, data) => {
  const url = `applicant-trainings/${tenantId}/${applicantId}/update/${trainingId}`;
  return apiClient_recruitment.put(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



export const getApplicatantCertificatefileById = async (
  tenantId,
  applicantId,
  trainingId
) => {
  const url = `applicant-trainings/${tenantId}/${applicantId}/download-certificate/${trainingId}`;
  const response = await apiClient_recruitment.get(url, { responseType: "blob" });
  return response.data; 
};



export const listApplicantCertificate = (tenantId,applicantId) => {
  const url = `applicant-trainings/${tenantId}/${applicantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteApplicantCertificate = (tenantId,applicantId, trainingId) => {
  const url = `applicant-trainings/${tenantId}/${applicantId}/delete/${trainingId}`;
  return apiClient_recruitment.delete(url);
};

export const getApplicantCertificateById = (tenantId,applicantId, trainingId) => {
  const url = `applicant-trainings/${tenantId}/${applicantId}/get/${trainingId}`;
  return apiClient_recruitment.get(url);
};



// create api for applicant Education

export const addApplicantEducations = ( tenantId,applicantId, data) => {
  const url = `applicant-educations/${tenantId}/${applicantId}/add`;
  return apiClient_recruitment.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



export const getApplicatantEducationfileById = async (
  tenantId,
  applicantId,
  educationId
) => {
  const url = `applicant-educations/${tenantId}/${applicantId}/download-document/${educationId}`;
  const response = await apiClient_recruitment.get(url, { responseType: "blob" });
  return response.data; 
};

export const listApplicantEducations = (tenantId,applicantId) => {
  const url = `applicant-educations/${tenantId}/${applicantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteApplicantEducations = (tenantId,applicantId, educationId) => {
  const url = `applicant-educations/${tenantId}/${applicantId}/delete/${educationId}`;
  return apiClient_recruitment.delete(url);
};

export const getApplicantEducationsById = (tenantId,applicantId, educationId) => {
  const url = `applicant-educations/${tenantId}/${applicantId}/get/${educationId}`;
  return apiClient_recruitment.get(url);
};
export const editApplicantEducations = (tenantId,applicantId, educationId, data) => {
  const url = `applicant-educations/${tenantId}/${applicantId}/update/${educationId}`;
  return apiClient_recruitment.put(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// create api for applicant Reference
export const addApplicantReferences = (tenantId,applicantId, data) => {
  const url = `applicant-references/${tenantId}/${applicantId}/add`;
  return apiClient_recruitment.post(url, data);
};

export const listApplicantReferences = (tenantId,applicantId) => {
  const url = `applicant-references/${tenantId}/${applicantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteApplicantReferences = (tenantId,applicantId, referenceId) => {
  const url = `applicant-references/${tenantId}/${applicantId}/delete/${referenceId}`;
  return apiClient_recruitment.delete(url);
};

export const getApplicantReferencesbyId = (tenantId,applicantId, referenceId) => {
  const url = `applicant-references/${tenantId}/${applicantId}/get/${referenceId}`;
  return apiClient_recruitment.get(url);
};

export const editApplicantReference = (tenantId,applicantId, referenceId, data) => {
  const url = `applicant-references/${tenantId}/${applicantId}/update/${referenceId}`;
  return apiClient_recruitment.put(url, data);
};

export const addApplicantLanguages = (tenantId,applicantId, data) => {
  const url = `applicant-languages/${tenantId}/${applicantId}/add`;
  return apiClient_recruitment.post(url, data);
};

export const listApplicantLanguages = (tenantId,applicantId) => {
  const url = `applicant-languages/${tenantId}/${applicantId}/get-all`;
  return apiClient_recruitment.get(url);
};

export const deleteApplicantLanguages = (tenantId,applicantId, LanguagesId) => {
  return apiClient_recruitment.delete(
    `applicant-languages/${tenantId}/${applicantId}/delete/${LanguagesId}`
  );
};


export const getApplicantLanguagesbyId = (tenantId,applicantId, LanguagesId) => {
  return apiClient_recruitment.get(
    `applicant-languages/${tenantId}/${applicantId}/get/${LanguagesId}`
  );
};

export const editApplicantLanguages = (tenantId,applicantId, LanguagesId, data) => {
  return apiClient_recruitment.put(
    `applicant-languages/${tenantId}/${applicantId}/update/${LanguagesId}`,
    data
  );
};

// create api for applicant Experences
export const addApplicantExperences = (tenantId,applicantId, data) => {
  const url = `applicant-experiences/${tenantId}/${applicantId}/add`;
  return apiClient_recruitment.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const listApplicantExperences = (tenantId,applicantId) => {
  return apiClient_recruitment.get(
    `applicant-experiences/${tenantId}/${applicantId}/get-all`
  );
};

export const deleteApplicantExperences = (tenantId,applicantId, experienceId) => {
  return apiClient_recruitment.delete(
    `applicant-experiences/${tenantId}/${applicantId}/delete/${experienceId}`
  );
};

export const getApplicantExperencesbyId = (tenantId,applicantId, experienceId) => {
  return apiClient_recruitment.get(
    `applicant-experiences/${tenantId}/${applicantId}/get/${experienceId}`
  );
};
export const updateApplicantExperience = (tenantId,applicantId, experienceId, data) => {
  const url = `applicant-experiences/${tenantId}/${applicantId}/update/${experienceId}`;
  return apiClient_recruitment.put(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getApplicatantExperiencefileById = async (
  tenantId,
  applicantId,
  educationId
) => {
  const url = `applicant-educations/${tenantId}/${applicantId}/download-document/${educationId}`;
  const response = await apiClient_recruitment.get(url, { responseType: "blob" });
  return response.data; 
};

// create api for Exam Result of applicants
export const addExamResult = (tenantId,recruitmentId, applicantId, data) => {
  return apiClient_recruitment.post(
    `exam-result/${tenantId}/${recruitmentId}/${applicantId}/add`,
    data
  );
};

export const listExamResult = (tenantId,recruitmentId) => {
  return apiClient_recruitment.get(`exam-result/${tenantId}/${recruitmentId}/get-all`);
};

export const deleteExamResult = (tenantId,recruitmentId, applicantId, examResultId) => {
  return apiClient_recruitment.delete(
    `exam-result/${tenantId}/${recruitmentId}/${applicantId}/delete/${examResultId}`
  );
};

export const getExamResultById = (tenantId,recruitmentId, applicantId, examResultId) => {
  return apiClient_recruitment.get(
    `exam-result/${tenantId}/${recruitmentId}/${applicantId}/get/${examResultId}`
  );
};

export const updateExamResult = (
  tenantId,
  recruitmentId,
  applicantId,
  examResultId,
  data
) => {
  return apiClient_recruitment.put(
    `exam-result/${tenantId}/${recruitmentId}/${applicantId}/update/${examResultId}`,
    data
  );
};
//the apis related with training
