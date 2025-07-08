import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_EVALUATION = `${BASE_URL}/evaluation`;
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

const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);
const apiClient_evaluation = createApiClient(REST_API_BASE_URL_EVALUATION);
const apiClient_leave = createApiClient(REST_API_BASE_URL_LEAVE);


export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_evaluation.get(url);
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

//category apis 
 export const getAllbudgetYears = (tenantId) => {
      return apiClient_leave.get(`budget-years/${tenantId}/get-all`);
  };

export const getAllCategory = (tenantId) => {
  return  apiClient_evaluation.get(`categories/${tenantId}/get-all`);
};


  export const createCategory = (tenantId,data) => {
    const url = `categories/${tenantId}/add`;
    return  apiClient_evaluation.post(url, data);
  };
  


  export const deleteCategory = (tenantId,categoryId) => {
    const url = `categories/${tenantId}/delete/${categoryId}`;
    return  apiClient_evaluation.delete(url);
  };

  export const getCategoryById = (tenantId,categoryId) => {
    const url = `categories/${tenantId}/get/${categoryId}`;
    return  apiClient_evaluation.get(url);
  };
  
  
  export const updateCategory = (tenantId, categoryId, data) => {
    const url = `categories/${tenantId}/update/${categoryId}`;
    return  apiClient_evaluation.put(url, data);
  };

  //criterial apis 

  
export const getAllCriterial = (tenantId) => {
  return  apiClient_evaluation.get(`criteria/${tenantId}/get-all`);
};


  export const createCriterial = (tenantId,data) => {
    const url = `criteria/${tenantId}/add`;
    return  apiClient_evaluation.post(url, data);
  };
  


  export const deleteCriterial = (tenantId,criteriaId) => {
    const url = `criteria/${tenantId}/delete/${criteriaId}`;
    return  apiClient_evaluation.delete(url);
  };

  export const getCriterialById = (tenantId,criteriaId) => {
    const url = `criteria/${tenantId}/get/${criteriaId}`;
    return  apiClient_evaluation.get(url);
  };
  
  
  export const updateCriterial = (tenantId, criteriaId, data) => {
    const url = `criteria/${tenantId}/update/${criteriaId}`;
    return  apiClient_evaluation.put(url, data);
  };


// levels apis


export const getAllLevel = (tenantId) => {
  return  apiClient_evaluation.get(`levels/${tenantId}/get-all`);
};


  export const createLevel = (tenantId,data) => {
    const url = `levels/${tenantId}/add`;
    return  apiClient_evaluation.post(url, data);
  };



  export const deleteLevel = (tenantId,levelId) => {
    const url = `levels/${tenantId}/delete/${levelId}`;
    return  apiClient_evaluation.delete(url);
  };

  export const getLevelById = (tenantId,levelId) => {
    const url = `levels/${tenantId}/get/${levelId}`;
    return  apiClient_evaluation.get(url);
  };
  
  
  export const updateLevel = (tenantId, levelId, data) => {
    const url = `levels/${tenantId}/update/${levelId}`;
    return  apiClient_evaluation.put(url, data);
  };


  
// sessions apis


export const getAllSession = (tenantId) => {
  return  apiClient_evaluation.get(`sessions/${tenantId}/get-all`);
};


  export const createSession = (tenantId,data) => {
    const url = `sessions/${tenantId}/add`;
    return  apiClient_evaluation.post(url, data);
  };
  


  export const deleteSession = (tenantId,sessionId) => {
    const url = `sessions/${tenantId}/delete/${sessionId}`;
    return  apiClient_evaluation.delete(url);
  };

  export const getSessionById = (tenantId,sessionId) => {
    const url = `sessions/${tenantId}/get/${sessionId}`;
    return  apiClient_evaluation.get(url);
  };
  
  
  export const updateSession = (tenantId, sessionId, data) => {
    const url = `sessions/${tenantId}/update/${sessionId}`;
    return  apiClient_evaluation.put(url, data);
  };


  
// results apis
export const getAllResult = (tenantId) => {
  return  apiClient_evaluation.get(`results/${tenantId}/get-all`);
};


  export const createResult = (tenantId,data) => {
    const url = `results/${tenantId}/add`;
    return  apiClient_evaluation.post(url, data);
  };
  


  export const deleteResult = (tenantId,resultId) => {
    const url = `results/${tenantId}/delete/${resultId}`;
    return  apiClient_evaluation.delete(url);
  };

  export const getResultById = (tenantId,resultId) => {
    const url = `results/${tenantId}/get/${resultId}`;
    return  apiClient_evaluation.get(url);
  };
  
  
  export const updateResult = (tenantId, resultId, data) => {
    const url = `results/${tenantId}/update/${resultId}`;
    return  apiClient_evaluation.put(url, data);
  };



