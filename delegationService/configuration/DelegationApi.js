import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_DELEGATION = `${BASE_URL}/delegation`;
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

const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);
const apiClient_delegation = createApiClient(REST_API_BASE_URL_DELEGATION);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);



export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_delegation.get(url);
};

export const getTenantById = () => {
  const tenantId = localStorage.getItem('tenantId');
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};

  export const listEmployee = (tenantId) => {
  const url = `employees/${tenantId}/get-all`;
  return apiClient_employee.get(url);
  };
  

 
  export const createDelegation = (tenantId, education) => {
    const url = `delegations/${tenantId}/add`;
    return apiClient_delegation.post(url, education, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };
   export const getEmployeeByEmployeId = (tenantId,employeeId) => {
      const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
      return  apiClient_employee.get(url);
    };

 

  export const getallActiveDelegation = (tenantId) => {
    const url = `delegations/${tenantId}/get-all/active`;
    return  apiClient_delegation.get(url);
  };

  export const getDelegationByEmployeeId = (tenantId,employeeId) => {
    const url = `delegations/${tenantId}/employee/${employeeId}`;
    return  apiClient_delegation.get(url);
  };

  export const deleteDelegation = (tenantId,delegationId) => {
    const url = `delegations/${tenantId}/delete/${delegationId}`;
    return  apiClient_delegation.delete(url);
  };
 

  export const updateDelegation = (tenantId,delegationId,data) => {
    const url = `delegations/${tenantId}/update/${delegationId}`;
    return apiClient_delegation.put(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  export const getDelegationById = (tenantId,delegationId) => {
    const url = `delegations/${tenantId}/get/${delegationId}`;
    return  apiClient_delegation.get(url);
  };

  export const getFileByDelegationId = async (
    tenantId,
    delegationId,
  ) => {
    const url = `delegations/${tenantId}/download-document/${delegationId}`;
    const response = await apiClient_delegation.get(url, { responseType: "blob" });
    return response.data; 
  };

  export const terminateDelegation = (tenantId,terminateId,data) => {
    const url = `delegations/${tenantId}/${terminateId}/terminate`;
    return  apiClient_delegation.put(url,data);
  };

