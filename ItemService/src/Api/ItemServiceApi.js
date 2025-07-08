
import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ITEM = `${BASE_URL}/item`;

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

const apiClient_item = createApiClient(REST_API_BASE_URL_ITEM);



export const createItem = async (tenantId, itemData) => {
  const url = `/items/${tenantId}/add`;
  return apiClient_item.post(url, itemData);
};

export const updateItem = async (tenantId, id, itemData) => {
  const url = `/items/${tenantId}/update/${id}`;
  return apiClient_item.put(url, itemData);
};

export const getItemById = async (tenantId, id) => {
  const url = `/items/${tenantId}/get/${id}`;
  return apiClient_item.get(url);
};

export const getAllItems = async (tenantId) => {
  const url = `/items/${tenantId}/get-all`;
  return apiClient_item.get(url);
};

export const getItemsBySubCategory = async (tenantId, subCategory) => {
  const url = `/items/${tenantId}/get/sub-category/${subCategory}`;
  return apiClient_item.get(url);
};


  export const getItemsByCategory = async (tenantId, category) => {
  const url = `/items/${tenantId}/get/category/${category}`;
  return apiClient_item.get(url);
};

export const deleteItem = async (tenantId, id) => {
  const url = `/items/${tenantId}/delete/${id}`;
  return apiClient_item.delete(url);
};

export const createPurchaseInspection = async (tenantId, inspectionData) => {
  const url = `/inspections/${tenantId}/purchase`;
  return apiClient_item.post(url, inspectionData);
};

export const createOtherInspection = async (tenantId, inspectionData) => {
  const url = `/inspections/${tenantId}/other`;
  return apiClient_item.post(url, inspectionData);
};

export const updatePurchaseInspection = async (tenantId, id, inspectionData) => {
  const url = `/inspections/${tenantId}/update/purchase/${id}`;
  return apiClient_item.put(url, inspectionData);
};

/api/item/inspections/{tenantId}/update/purchase/{id}

export const updateOtherInspection = async (tenantId, id, inspectionData) => {
  const url = `/inspections/${tenantId}/update/other/${id}`;
  return apiClient_item.put(url, inspectionData);
};

export const getInspectionById = async (tenantId, id) => {
  const url = `/inspections/${tenantId}/get/${id}`;
  return apiClient_item.get(url);
};

export const getAllInspections = async (tenantId) => {
  const url = `/inspections/${tenantId}/get-all`;
  return apiClient_item.get(url);
};

export const deleteInspection = async (tenantId, id) => {
  const url = `/inspections/${tenantId}/delete/${id}`;
  return apiClient_item.delete(url);
};

