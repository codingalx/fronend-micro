import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_DOCUMENT = `${BASE_URL}/document`;
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
const apiClient_document = createApiClient(REST_API_BASE_URL_DOCUMENT);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);



export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_document.get(url);
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
  
  export const getEmployeeByEmployeId = (tenantId,employeeId) => {
    const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
    return  apiClient_employee.get(url);
  };


 
  export const createDocumentType = (tenantId,data) => {
    const url = `document-types/${tenantId}/add`;
    return apiClient_document.post(url, data);
  };


  export const getAllDocumentType = (tenantId) => {
    const url = `document-types/${tenantId}/get-all`;
    return  apiClient_document.get(url);
  };



  export const getDocumentTypeById = (tenantId,documentTypeId) => {
    const url = `document-types/${tenantId}/get/${documentTypeId}`;
    return  apiClient_document.get(url);
  };


  export const deleteDocumentType = (tenantId,documentTypeId) => {
    const url = `document-types/${tenantId}/delete/${documentTypeId}`;
    return  apiClient_document.delete(url);
  };

  export const updateDocumentType = (tenantId,documentTypeId,data) => {
    const url = `document-types/${tenantId}/update/${documentTypeId}`;
    return  apiClient_document.put(url,data);
  };

  export const createDocument = (tenantId,data) => {
    const url = `documents/${tenantId}/add`;
    return apiClient_document.post(url, data);
  };

  export const getAllDocument = (tenantId) => {
    const url = `documents/${tenantId}/get-all`;
    return  apiClient_document.get(url);
  };
  
  export const getAllDocumentRequest = (tenantId) => {
    const url = `documents/${tenantId}/get-all-requested`;
    return  apiClient_document.get(url);
  };

  export const getAllDocumentApproved = (tenantId) => {
    const url = `documents/${tenantId}/get-all-approved`;
    return  apiClient_document.get(url);
  };
  export const getAllDocumentGenerated = (tenantId) => {
    const url = `documents/${tenantId}/get-all-generated`;
    return  apiClient_document.get(url);
  };

  export const getAllDocumentByEmployeeId = (tenantId,employeeId) => {
    const url = `documents/${tenantId}/get-by-employee/${employeeId}`;
    return  apiClient_document.get(url);
  };


  export const getDocumentById = (tenantId,documentId) => {
    const url = `documents/${tenantId}/get/${documentId}`;
    return  apiClient_document.get(url);
  };

  export const getDocumentByEmployeeId = (tenantId,employeeId) => {
    const url = `documents/${tenantId}/get-by-employee/${employeeId}`;
    return  apiClient_document.get(url);
  };
 

  export const deleteDocument = (tenantId,documentId) => {
    const url = `documents/${tenantId}/delete/${documentId}`;
    return  apiClient_document.delete(url);
  };
  export const updateDocument = (tenantId,documentId,data) => {
    const url = `documents/${tenantId}/update/${documentId}`;
    return  apiClient_document.put(url,data);
  };

  export const approveDocument = (tenantId,documentId,data) => {
    const url = `documents/${tenantId}/approve/${documentId}`;
    return  apiClient_document.put(url,data);
  };
  export const generateDocument = (tenantId,documentId,data) => {
    const url = `documents/${tenantId}/generate/${documentId}`;
    return  apiClient_document.put(url,data);
  };
