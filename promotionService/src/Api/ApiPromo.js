import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_PROMOTION = `${BASE_URL}/promotion`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
const REST_API_BASE_URL_RECRUITMENT = `${BASE_URL}/recruitment`;
export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;


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

const apiClient_promotion = createApiClient(REST_API_BASE_URL_PROMOTION);
const apiClient_recruitments = createApiClient(REST_API_BASE_URL_RECRUITMENT);
const apiClient_organaization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);


export const listPromotionCriteria = async (tenantId) => {
  const url = `criteria-names/${tenantId}/get-all`;
  return apiClient_promotion.get(url);
};

export const createPromotionCriteriaName = async (tenantId, criteriaData) => {
  const url = `criteria-names/${tenantId}/add`;
  return apiClient_promotion.post(url, criteriaData);
};

export const fetchAllPromotionCriteriaName = async (tenantId) => {
  const url = `criteria-names/${tenantId}/get-all`;
  return apiClient_promotion.get(url);
};
export const CreateNestedCriteriaName = async (tenantId,parentId,nestedData) => {
  const url = `criteria-names/${tenantId}/sub-criteria${parentId}/add`;
  return apiClient_promotion.post(url,nestedData);
};
///api/promotion/criteria-names/{tenantId}/sub-criteria{parentId}/add



export const fetchExistingNestedCriteriaName  = async (tenantId,parentId) => {
  const url = `criteria-names/${tenantId}/sub-criteria${parentId}/get-all`;
  return apiClient_promotion.get(url);
};
/////api/promotion/criteria-names/{tenantId}/sub-criteria{parentId}/get-all

export const deletePromotionCriteriaName = async (tenantId, criteriaNameId) => {
  const url = `criteria-names/${tenantId}/delete/${criteriaNameId}`;
  return apiClient_promotion.delete(url);
};

export const fetchPromotionCriteriaNameById = async (tenantId, criteriaNameId) => {
  const url = `criteria-names/${tenantId}/get/${criteriaNameId}`;
  return apiClient_promotion.get(url);
};

export const updatePromotionCriteriaName = async (tenantId, criteriaNameId, criteriaData) => {
  const url = `criteria-names/${tenantId}/update/${criteriaNameId}`;
  return apiClient_promotion.put(url, criteriaData);
};

export const fetchSinglePromotionCriteriaById = async (tenantId, criteriaNameId) => {
  const url = `criteria/${tenantId}/get/${criteriaNameId}`;
  return apiClient_promotion.get(url);
};

export const createPromotionCriteria = async (tenantId, criteriaData) => {
  const url = `criteria/${tenantId}/add`;
  return apiClient_promotion.post(url, criteriaData);
};
export const createNestedPromotionCriteria = async (tenantId, parentId,data) => {
  const url = `criteria/${tenantId}/sub-criteria/${parentId}/add`;
  return apiClient_promotion.post(url, data);
};
export const fetchNestedPromotionCriteria = async (tenantId, parentId) => {
  const url = `criteria/${tenantId}/sub-criteria/${parentId}`;
  return apiClient_promotion.post(url, data);
};



////api/promotion/criteria/{tenantId}/sub-criteria/{parentId}

export const fetchAllPromotionCriteria = async (tenantId) => {
  const url = `criteria/${tenantId}/get-all`;
  return apiClient_promotion.get(url);
};

export const deletePromotionCriteria = async (tenantId, promotionCriteriaId) => {
  const url = `criteria/${tenantId}/delete/${promotionCriteriaId}`;
  return apiClient_promotion.delete(url);
};

export const fetchPromotionCriteriaById = async (tenantId, promotionCriteriaId) => {
  const url = `criteria/${tenantId}/get/${promotionCriteriaId}`;
  return apiClient_promotion.get(url);
};

export const updatePromotionCriteria = async (tenantId, promotionCriteriaId, criteriaData) => {
  const url = `criteria/${tenantId}/update/${promotionCriteriaId}`;
  return apiClient_promotion.put(url, criteriaData);
};

export const createPromotionCandidate = async (tenantId, candidateData) => {
  const url = `candidates/${tenantId}/add`;
  return apiClient_promotion.post(url, candidateData);
};

export const fetchAllPromotionCandidate = async (tenantId) => {
  const url = `candidates/${tenantId}/get-all`;
  return apiClient_promotion.get(url);
};

export const deletePromotionCandidate = async (tenantId, promotionId) => {
  const url = `candidates/${tenantId}/delete/${promotionId}`;
  return apiClient_promotion.delete(url);
};

export const fetchPromotionCandidateById = async (tenantId, promotionId) => {
  const url = `candidates/${tenantId}/get/${promotionId}`;
  return apiClient_promotion.get(url);
};

export const updatePromotionCandidate = async (tenantId, promotionId, candidateData) => {
  const url = `candidates/${tenantId}/update/${promotionId}`;
  return apiClient_promotion.put(url, candidateData);
};

export const createPromoteCandidate = async (tenantId, candidateData) => {
  const url = `promotes/${tenantId}/add`;
  return apiClient_promotion.post(url, candidateData);
};

export const fetchAllPromoteCandidate = async (tenantId) => {
  const url = `promotes/${tenantId}/get-all`;
  return apiClient_promotion.get(url);
};

export const updateCandidateEvaluation = async (tenantId, candidateId, evaluationId,evaluationData) => {
  const url = `evaluations/${tenantId}/${candidateId}/update/${evaluationId}`;
  return apiClient_promotion.put(url, evaluationData);
};

export const createCandidateEvaluation = async (tenantId, candidateId, evaluationData) => {
  const url = `evaluations/${tenantId}/${candidateId}/add`;
  return apiClient_promotion.post(url, evaluationData);
};

export const getCandidateEvaluationById = async (tenantId, candidateId, evaluationId) => {
  const url = `evaluations/${tenantId}/${candidateId}/get/${evaluationId}`;
  return apiClient_promotion.get(url);
};
export const deleteCandidateEvaluation = async (tenantId, candidateId, evaluationId,evaluationData) => {
  const url = `evaluations/${tenantId}/${candidateId}/delete/${evaluationId}`;
  return apiClient_promotion.delete(url, evaluationData);
};


export const getAllEmployee = async (tenantId) => {
  const url = `employees/${tenantId}/get-all`;
  return apiClient_employee.get(url);
};

export const fetchAllCandidateEvaluation = async (tenantId, candidateId) => {
  const url = `evaluations/${tenantId}/${candidateId}/get-all`;
  return apiClient_promotion.get(url);
};

export const getEmployeeByEmployeId = (tenantId, employeeId) => {
  const url = `employees/${tenantId}/get/${employeeId}`;
  return apiClient_employee.get(url);
};
export const getEmployeeByEmployeIdd = (tenantId, employeeId) => {
  const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
  return apiClient_employee.get(url);
};

export const updateMyEvaluation = async (tenantId, candidateId, evaluationId,res) => {
  const url = `evaluations/${tenantId}/${candidateId}/update/${evaluationId}?result=${res}`;
  return apiClient_promotion.put(url);
};

        
export const fetchAllPayGrade = async (tenantId) => {
  const url = `pay-grades/${tenantId}/get-all`;
  return apiClient_organaization.get(url);
};


export const fetchAllRecruitments = async (tenantId) => {
  const url = `recruitments/${tenantId}/get-all`;
  return apiClient_recruitments.get(url);
};

export const fetchAllRecruitmentsById = async (tenantId, reqId) => {
  const url = `recruitments/${tenantId}/get/${reqId}`;
  return apiClient_recruitments.get(url);
};

export const fetchAllApprovedRecruitments = async (tenantId) => {
  const url = `recruitments/${tenantId}/get/internal/approved`;
  return apiClient_recruitments.get(url);
};

export const fetchJobGrade = async (tenantId, id) => {
  const url = `job-registrations/${tenantId}/get/${id}`;
  return apiClient_organaization.get(url);
};

export const fetchJobGradeID = async (tenantId , id) => {
  const url = `job-grades/${tenantId}/get/${id}`;
  return apiClient_organaization.get(url);
};

export const fetchPayGradeByJobGrade = async (tenantId, id) => {
  const url = `pay-grades/${tenantId}/jobgrade/${id}`;
  return apiClient_organaization.get(url);
};