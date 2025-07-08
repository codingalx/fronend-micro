import axios from "axios";

// Environment-based URLs with fallback
const BASE_URL =
  import.meta.env.BASE_SERVER_URL ||
  "http://gateway.172.20.136.101.sslip.io/api";
const TOKEN_URL =
  import.meta.env.TOKEN_URL ||
  "http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token";

export const REST_API_BASE_URL_STOREMOVEMENT = `${BASE_URL}/stock-movement`;
export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_STORE = `${BASE_URL}/store`;
export const REST_API_BASE_URL_ITEM = `${BASE_URL}/item`;






// Generic API client factory
const createApiClient = (baseURL) => {
  const apiClient = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  apiClient.interceptors.request.use(
    async (config) => {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const data = new URLSearchParams({
              grant_type: "refresh_token",
              client_id: "saas-client",
              client_secret: "APHalzvUVsfz9Jffe5ZAZ1XImFwv5a8K",
              refresh_token: refreshToken,
            });

            const response = await axios.post(TOKEN_URL, data, {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const newAccessToken = response.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

const apiClient_storemovement = createApiClient(REST_API_BASE_URL_STOREMOVEMENT);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_store = createApiClient(REST_API_BASE_URL_STORE);
const apiClient_item = createApiClient(REST_API_BASE_URL_ITEM);




export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_storemovement.get(url);
};

export const getTenantById = () => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};


export const getAllDepartments = (tenantId) => {
  const url = `departments/${tenantId}/get-all`;
  return apiClient_organization.get(url);
};

export const getAllInspections = (tenantId) => {
  const url = `inspections/${tenantId}/get-all`;
  return apiClient_item.get(url);
};

export const getAllItems = (tenantId) => {
  const url = `items/${tenantId}/get-all`;
  return apiClient_item.get(url);
};


export const getAllStores = (tenantId) => {
  const url = `stores/${tenantId}/get-all`;
  return apiClient_store.get(url);
};
export const getAllStoreRequisitions = (tenantId) => {
  const url = `store-requisitions/${tenantId}/get-all`;
  return apiClient_store.get(url);
};





export const createStoreIssueVouncher = (tenantId,data) => {
  const url = `storeIssueVoucher/${tenantId}/add`;
  return apiClient_storemovement.post(url, data);
};


export const getStoreIssueVouncherById = (tenantId,id) => {
  const url = `storeIssueVoucher/${tenantId}/get/${id}`;
  return apiClient_storemovement.get(url);
};


export const getAllStoreIssueVouncher = (tenantId) => {
  const url = `storeIssueVoucher/${tenantId}/get-all`;
  return apiClient_storemovement.get(url);
};


export const deleteStoreIssueVouncher = (tenantId,id) => {
  const url = `storeIssueVoucher/${tenantId}/delete/${id}`;
  return apiClient_storemovement.delete(url);
};


export const updateStoreIssueVouncher = (tenantId,id, data) => {
  const url = `storeIssueVoucher/${tenantId}/update/${id}`;
  return apiClient_storemovement.put(url, data);
};





export const createGoodReceivingNote = (tenantId,data) => {
  const url = `good-receiving-note/${tenantId}/add`;
  return apiClient_storemovement.post(url, data);
};


export const getGoodReceivingNoteById = (tenantId,id) => {
  const url = `good-receiving-note/${tenantId}/get/${id}`;
  return apiClient_storemovement.get(url);
};


export const getAllGoodReceivingNote = (tenantId) => {
  const url = `good-receiving-note/${tenantId}/get-all`;
  return apiClient_storemovement.get(url);
};


export const deleteGoodReceivingNote = (tenantId,id) => {
  const url = `good-receiving-note/${tenantId}/delete/${id}`;
  return apiClient_storemovement.delete(url);
};


export const updateGoodReceivingNote = (tenantId,id, data) => {
  const url = `good-receiving-note/${tenantId}/update/${id}`;
  return apiClient_storemovement.put(url, data);
};




export const createGatePassInformation = (tenantId,data) => {
  const url = `gate-pass/${tenantId}/add`;
  return apiClient_storemovement.post(url, data);
};


export const getGatePassInformationById = (tenantId,id) => {
  const url = `gate-pass/${tenantId}/get/${id}`;
  return apiClient_storemovement.get(url);
};


export const getAllGatePassInformation = (tenantId) => {
  const url = `gate-pass/${tenantId}/get-all`;
  return apiClient_storemovement.get(url);
};


export const deleteGatePassInformation = (tenantId,id) => {
  const url = `gate-pass/${tenantId}/delete/${id}`;
  return apiClient_storemovement.delete(url);
};


export const updateGatePassInformation = (tenantId,id, data) => {
  const url = `gate-pass/${tenantId}/update/${id}`;
  return apiClient_storemovement.put(url, data);
};

export const decisionGatePassInformation = (tenantId,id, data) => {
  const url = `gate-pass/${tenantId}/approve/${id}`;
  return apiClient_storemovement.put(url, data);
};





export const createInterStoreIssueVoucherForIssue = (tenantId,data) => {
  const url = `isiv-for-issue/${tenantId}/add`;
  return apiClient_storemovement.post(url, data);
};


export const getInterStoreIssueVoucherForIssuenById = (tenantId,id) => {
  const url = `isiv-for-issue/${tenantId}/get/${id}`;
  return apiClient_storemovement.get(url);
};


export const getAllInterStoreIssueVoucherForIssue = (tenantId) => {
  const url = `isiv-for-issue/${tenantId}/get-all`;
  return apiClient_storemovement.get(url);
};


export const deleteInterStoreIssueVoucherForIssue = (tenantId,id) => {
  const url = `isiv-for-issue/${tenantId}/delete/${id}`;
  return apiClient_storemovement.delete(url);
};


export const updateInterStoreIssueVoucherForIssue = (tenantId,id, data) => {
  const url = `isiv-for-issue/${tenantId}/update/${id}`;
  return apiClient_storemovement.put(url, data);
};

export const decisionInterStoreIssueVoucherForIssue = (tenantId,id, data) => {
  const url = `isiv-for-issue/${tenantId}/approve/${id}`;
  return apiClient_storemovement.put(url, data);
};



export const createInterStoreIssueVoucherForReceiving = (tenantId,data) => {
  const url = `isiv-for-receiving/${tenantId}/add`;
  return apiClient_storemovement.post(url, data);
};


export const getInterStoreIssueVoucherForReceivingById = (tenantId,id) => {
  const url = `isiv-for-receiving/${tenantId}/get/${id}`;
  return apiClient_storemovement.get(url);
};


export const getAllInterStoreIssueVoucherForReceiving = (tenantId) => {
  const url = `isiv-for-receiving/${tenantId}/get-all`;
  return apiClient_storemovement.get(url);
};


export const deleteInterStoreIssueVoucherForReceiving = (tenantId,id) => {
  const url = `isiv-for-receiving/${tenantId}/delete/${id}`;
  return apiClient_storemovement.delete(url);
};


export const updateInterStoreIssueVoucherForReceiving = (tenantId,id, data) => {
  const url = `isiv-for-receiving/${tenantId}/update/${id}`;
  return apiClient_storemovement.put(url, data);
};










