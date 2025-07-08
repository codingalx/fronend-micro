
import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');


export const REST_API_BASE_URL_DISCIPLINE = `${BASE_URL}/discipline`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;

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

const apiClient_discipline = createApiClient(REST_API_BASE_URL_DISCIPLINE);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);

    //Penality Api
  export const createPenalty = (tenantId, data) => {
    return apiClient_discipline.post(`/penalty/${tenantId}/add`, data);
  };
  
  export const updatePenalty = (tenantId, penaltyId, data) => {
    return apiClient_discipline.put(`/penalty/${tenantId}/update/${penaltyId}`, data);
  };
  
  export const getPenalty = (tenantId, penaltyId) => {
    return apiClient_discipline.get(`/penalty/${tenantId}/get/${penaltyId}`);
  };
  
  export const getAllPenalties = (tenantId) => {
    return apiClient_discipline.get(`/penalty/${tenantId}/get-all`);
  };
  
  export const deletePenalty = (tenantId, penaltyId) => {
    return apiClient_discipline.delete(`/penalty/${tenantId}/delete/${penaltyId}`);
  };

  //Offense Api
  export const createOffense = (tenantId, data) => {
    return apiClient_discipline.post(`/offense/${tenantId}/add`, data);
  };
  
  export const updateOffense = (tenantId,offenseId, data) => {
    return apiClient_discipline.put(`/offense/${tenantId}/update/${offenseId}`, data);
  };
  
  export const getOffense = (tenantId, offenseId) => {
    return apiClient_discipline.get(`/offense/${tenantId}/get/${offenseId}`);
  };
  
  export const getAllOffenses = (tenantId) => {
    return apiClient_discipline.get(`/offense/${tenantId}/get-all`);
  };
  
  export const deleteOffense = (tenantId, offenseId) => {
    return apiClient_discipline.delete(`/offense/${tenantId}/delete/${offenseId}`);
  };

  // Discipline API
  export const createDiscipline = (tenantId, data) => {
    return apiClient_discipline.post(`/${tenantId}/add`, data);
  };
  
  export const updateDiscipline = (tenantId, disciplineId, data) => {
    return apiClient_discipline.put(`/${tenantId}/update/${disciplineId}`, data);
  };
  
  export const approveDiscipline = (tenantId, disciplineId , data) => {
    return apiClient_discipline.put(`/${tenantId}/approve/${disciplineId}`, data);
  };
  
  export const getDiscipline = (tenantId, disciplineId) => {
    return apiClient_discipline.get(`/${tenantId}/get/${disciplineId}`);
  };
  
  export const getAllDisciplines = (tenantId) => {
    return apiClient_discipline.get(`/${tenantId}/get-all`);
  };
 
  export const deleteDiscipline = (tenantId, disciplineId) => {
    return apiClient_discipline.delete(`/${tenantId}/delete/${disciplineId}`);
  };
  export const getDisciplineUser = (tenantId,offenderId) => {
    return apiClient_discipline.get(`/${tenantId}/offender/${offenderId}`);
  };
  export const getDisciplineForUser = (tenantId,employeeId) => {
    return apiClient_discipline.get(`/${tenantId}/employee/${employeeId}`);
  };
  // Appeal API
export const createAppeal = (tenantId, data) => {
  return apiClient_discipline.post(`/appeal/${tenantId}/add`, data);
};

export const updateAppeal = (tenantId, appealId, data) => {
  return apiClient_discipline.put(`/appeal/${tenantId}/update/${appealId}`, data);
};

export const getAppeal = (tenantId, appealId) => {
  return apiClient_discipline.get(`/appeal/${tenantId}/get/${appealId}`);
};

export const getAllAppeals = (tenantId) => {
  return apiClient_discipline.get(`/appeal/${tenantId}/get-all`);
};

export const deleteAppeal = (tenantId, appealId) => {
  return apiClient_discipline.delete(`/appeal/${tenantId}/delete/${appealId}`);
};

export const getEmployeeById = (tenantId,employeeId) => {
  const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
  return  apiClient_employee.get(url);
};
export const getEmployeeByEId = (tenantId, employeeId) => {
  return apiClient_employee.get(`/employees/${tenantId}/get/${employeeId}`);
};

export const getAllEmployees = (tenantId) => {
return apiClient_employee.get(`/employees/${tenantId}/get-all`);
};