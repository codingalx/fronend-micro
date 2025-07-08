import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_FIXEDASSET = `${BASE_URL}/fixed-asset`;
export const REST_API_BASE_URL_ITEM = `${BASE_URL}/item`;
export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_STORE = `${BASE_URL}/store`;
export const REST_API_BASE_URL_STORE_MOVEMENT = `${BASE_URL}/stock-movement`;
 




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

const apiClient_fixedAsset = createApiClient(REST_API_BASE_URL_FIXEDASSET);
const apiClient_item = createApiClient(REST_API_BASE_URL_ITEM);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_store = createApiClient(REST_API_BASE_URL_STORE);
const apiClient_store_movement = createApiClient(REST_API_BASE_URL_STORE_MOVEMENT);




export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_fixedAsset.get(url);
};

export const getTenantById = () => {
  const tenantId = localStorage.getItem('tenantId');
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};



  export const getAllstoreIssueVoucher = (tenantId) => {
  const url = `storeIssueVoucher/${tenantId}/get-all`;
  return apiClient_store_movement.get(url);
  };


  export const getAllStore = (tenantId) => {
  const url = `stores/${tenantId}/get-all`;
  return apiClient_store.get(url);
  };

   export const getAllStoreRequisitions = (tenantId) => {
  const url = `store-requisitions/${tenantId}/get-all`;
  return apiClient_store.get(url);
  };


    export const getAllItem = (tenantId) => {
  const url = `items/${tenantId}/get-all`;
  return apiClient_item.get(url);
  };

  export const getAllDepartement = (tenantId) => {
  const url = `departments/${tenantId}/get-all`;
  return apiClient_organization.get(url);
  };

  export const getAllRequision = (tenantId) => {
  const url = `store-requisitions/${tenantId}/get-all`;
  return apiClient_store.get(url);
  };


   export const createFixedAsset = (tenantId,data) => {
  const url = `${tenantId}/add`;
  return apiClient_fixedAsset.post(url,data);
  };

     export const getFixedAssetById = (tenantId,fixedAssetId) => {
  const url = `${tenantId}/get/${fixedAssetId}`;
  return apiClient_fixedAsset.get(url);
  };

    export const getAllFixedAsset = (tenantId) => {
  const url = `${tenantId}/get-all`;
  return apiClient_fixedAsset.get(url);
  };

   export const deletefixedAsset = (tenantId,fixedAssetId) => {
  const url = `${tenantId}/delete/${fixedAssetId}`;
  return apiClient_fixedAsset.delete(url);
  };

     export const updatefixedAsset = (tenantId,fixedAssetId,data) => {
  const url = `${tenantId}/update/${fixedAssetId}`;
  return apiClient_fixedAsset.put(url,data);
  };

   export const getDepartementById = (tenantId,id) => {
      return apiClient_organization.get(`departments/${tenantId}/get/${id}`);
      };





   
