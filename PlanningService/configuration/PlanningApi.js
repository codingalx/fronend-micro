import axios from "axios";
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_PLANNING = `${BASE_URL}/hr-planning`;
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
const apiClient_planning = createApiClient(REST_API_BASE_URL_PLANNING);
const apiClient_leave = createApiClient(REST_API_BASE_URL_LEAVE);



export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_planning.get(url);
};



export const getTenantById = (tenantId)  => {
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};

export const listDepartement = (tenantId) => {
  return apiClient_organization.get(`departments/${tenantId}/get-all`);
  };

  export const getDepartementById = (tenantId,id) => {
    return apiClient_organization.get(`departments/${tenantId}/get/${id}`);
    };
  
    export const listJobRegestration = (tenantId) => {
      return apiClient_organization.get(`job-registrations/${tenantId}/get-all`);
    };




export const createNeedRequest = (tenantId,data) => {
  const url = `need-requests/${tenantId}/add`;
  return apiClient_planning.post(url, data);
};



export const listNeedRequest = (tenantId,data) => {
  const url = `need-requests/${tenantId}/get-all`;
  return apiClient_planning.get(url, data);
};

export const deleteNeedRequest = (tenantId,requestId) => {
  return apiClient_planning.delete(`need-requests/${tenantId}/delete/${requestId}`);
};

export const getByIdNeedRequest = (tenantId,requestId) => {
  return apiClient_planning.get(`need-requests/${tenantId}/get/${requestId}`);
};


export const updateNeedRequest = (tenantId,requestId, data) => {
  return apiClient_planning.put(`need-requests/${tenantId}/update/${requestId}`, data);
};

export const getByStaffplanNeedRequest = (tenantId,staffPlanId) => {
  return apiClient_planning.get(`need-requests/${tenantId}/${staffPlanId}`);
};


export const getAllstafPlan = (tenantId) => {
      return apiClient_organization.get(`staff-plans/${tenantId}/get-all`);
  };

  export const getAllbudgetYears = (tenantId) => {
      return apiClient_leave.get(`budget-years/${tenantId}/get-all`);
  };
  // /api/leave/budget-years/{tenantId}/get-all


  export const getAllWorkunits = (tenantId) => {
      return apiClient_organization.get(`work-units/${tenantId}/get-all`);
  };



  
export const createHrAnalisis = (tenantId,data) => {
  const url = `hr-analyses/${tenantId}/create`;
  return apiClient_planning.post(url, data);
};

  export const listHrAnalisis = (tenantId) => {
      return apiClient_planning.get(`hr-analyses/${tenantId}/all`);
  };

  export const getByIdHrAnalisis = (tenantId,hrAnalsisId) => {
      return apiClient_planning.get(`hr-analyses/${tenantId}/${hrAnalsisId}`);
  };

  export const deleteHrAnalisis = (tenantId,analisisId) => {
    return apiClient_planning.delete(`hr-analyses/${tenantId}/${analisisId}/delete`);
  };

  export const updateHrAnalsis = (tenantId,analisiId, data) => {
    return apiClient_planning.put(`hr-analyses/${tenantId}/${analisiId}/update`, data);
  };


  export const createAnnualRequirementPromotion = (tenantId,data) => {
      const url = `annual-recruitment-promotion/${tenantId}/create`;
    return apiClient_planning.post(url, data);
  };
  export const listAnnualRequirementPromotion = (tenantId) => {
      return apiClient_planning.get(`annual-recruitment-promotion//${tenantId}/all`);
  };

  export const getBAnnualRequirementPromotionById = (tenantId,id) => {
      return apiClient_planning.get(`annual-recruitment-promotion/${tenantId}/${id}`);
  };

  export const deleteAnnualRequirementPromotion = (tenantId,id) => {
    return apiClient_planning.delete(`annual-recruitment-promotion/${tenantId}/${id}/delete`);
  };

  export const updateAnnualRequirementPromotion = (tenantId,id, data) => {
    return apiClient_planning.put(`annual-recruitment-promotion/${tenantId}/${id}/update`, data);
  };
