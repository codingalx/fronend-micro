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
export const REST_API_BASE_URL_PLANNING = `${BASE_URL}/hr-planning`;
export const REST_API_BASE_URL_LEAVE = `${BASE_URL}/leave`;
export const REST_API_BASE_URL_TRAINING = `${BASE_URL}/training`;
export const REST_API_BASE_URL_AUTH = `${BASE_URL}/auth`;
export const REST_API_BASE_URL_EVALUATION = `${BASE_URL}/evaluation`;
export const REST_API_BASE_URL_DELEGATION = `${BASE_URL}/delegation`;
export const REST_API_BASE_URL_DOCUMENT = `${BASE_URL}/document`;
export const REST_API_BASE_URL_PROMOTION = `${BASE_URL}/promotion`;
export const REST_API_BASE_URL_SEPARATION = `${BASE_URL}/separation`;
export const REST_API_BASE_URL_TRANSFER = `${BASE_URL}/transfer`;
export const REST_API_BASE_URL_DISCIPLINE = `${BASE_URL}/discipline`;
export const REST_API_BASE_URL_COMPLAINT = `${BASE_URL}/complaint`;
export const REST_API_BASE_URL_ATTENDANCE = `${BASE_URL}/attendance`;
export const REST_API_BASE_URL_ITEM = `${BASE_URL}/item`;
export const REST_API_BASE_URL_STORE = `${BASE_URL}/store`;
export const REST_API_BASE_URL_STOREMOVEMENT = `${BASE_URL}/stock-movement`;
export const REST_API_BASE_URL_FIXED_ASSET = `${BASE_URL}/fixed-asset`;






const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Add request interceptor for setting the token
  client.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for handling token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the error is a 401
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loop
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const data = new URLSearchParams({
              grant_type: "refresh_token",
              client_id: "saas-client",
              client_secret: "APHalzvUVsfz9Jffe5ZAZ1XImFwv5a8K",
              refresh_token: refreshToken,
            });

            // Request new access token
            const response = await axios.post(
             KEYCLOAK_BASE_URL,
              data,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );

            const newAccessToken = response.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return client(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            // Optionally, you can log out the user if refresh fails
          }
        }
      }

      return Promise.reject(error); // Reject if not handled
    }
  );

  return client;
};

export const apiClient_auth = createApiClient(REST_API_BASE_URL_AUTH);
export const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
export const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);
export const apiClient_recruitment = createApiClient(REST_API_BASE_URL_RECRUITMENT);
export const apiClient_planning = createApiClient(REST_API_BASE_URL_PLANNING);
export const apiClient_leave = createApiClient(REST_API_BASE_URL_LEAVE);
export const apiClient_training = createApiClient(REST_API_BASE_URL_TRAINING);
export const apiClient_evaluation = createApiClient(REST_API_BASE_URL_EVALUATION);
export const apiClient_delegation = createApiClient( REST_API_BASE_URL_DELEGATION);
export const apiClient_document = createApiClient(REST_API_BASE_URL_DOCUMENT);
export const apiClient_promotion = createApiClient(REST_API_BASE_URL_PROMOTION);
export const apiClient_separation = createApiClient(REST_API_BASE_URL_SEPARATION);
export const apiClient_transfer = createApiClient(REST_API_BASE_URL_TRANSFER);
export const apiClient_discipline = createApiClient(REST_API_BASE_URL_DISCIPLINE);
export const apiClient_complaint = createApiClient(REST_API_BASE_URL_COMPLAINT);
export const apiClient_attendance = createApiClient(REST_API_BASE_URL_ATTENDANCE);
export const apiClient_item = createApiClient(REST_API_BASE_URL_ITEM);
export const store_item = createApiClient(REST_API_BASE_URL_STORE);
export const storeMovement_item = createApiClient(REST_API_BASE_URL_STOREMOVEMENT);
export const fixedAsset_item = createApiClient(REST_API_BASE_URL_FIXED_ASSET);








export const getEmployeeResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_employee.get(url);
};

export const getOrganizationResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_organization.get(url);
};

export const getTransferResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_transfer.get(url);
};

export const getPlanningResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_planning.get(url);
};

export const getRecruitmentResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_recruitment.get(url);
};

export const getLeaveResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_leave.get(url);
};

export const getTrainingResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_training.get(url);
};

export const getUserResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_auth.get(url);
};

export const getEvaluationResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_evaluation.get(url);
};

export const getDelegationResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_delegation.get(url);
};

export const getDocumentResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_document.get(url);
};

export const getPromotionResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_promotion.get(url);
};

export const getSeparationResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_separation.get(url);
};

export const getComplaintResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_complaint.get(url);
};
export const getDisciplineResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_discipline.get(url);
};

export const getAttendanceResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_attendance.get(url);
};

export const getItemResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_item.get(url);
};

export const getStoreResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return store_item.get(url);
};
export const getStoreMovementResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return storeMovement_item.get(url);
};

export const getFixedAssetResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return fixedAsset_item.get(url);
};





export const getEmployeeByEmployeId = (employeeId) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
  return apiClient_employee.get(url);
};

export const getTenantById = () => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};
