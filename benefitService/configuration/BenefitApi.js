import axios from 'axios';
const BASE_URL = 'http://172.20.136.101:8000/api';
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_BENEFIT = `${BASE_URL}/benefit`;
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
              'http://172.20.136.101:8282/realms/saas-erp/protocol/openid-connect/token',
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
const apiClient_benefit = createApiClient(REST_API_BASE_URL_BENEFIT);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);



export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_benefit.get(url);
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

    export const createInsuranceCanpany = (tenantId,data) => {
      const url = `insurance_company/${tenantId}/add`;
      return  apiClient_benefit.post(url,data);
    };

    export const getAllInsuranceCanpany = (tenantId) => {
      const url = `insurance_company/${tenantId}/get-all`;
      return  apiClient_benefit.get(url);
    };

    
    export const getInsuranceCanpanyById = (tenantId,companyId) => {
      const url = `insurance_company/${tenantId}/get/${companyId}`;
      return  apiClient_benefit.get(url);
    };

    
    export const deleteInsuranceCanpany = (tenantId,companyId) => {
      const url = `insurance_company/${tenantId}/delete/${companyId}`;
      return  apiClient_benefit.delete(url);
    };

    export const updateInsuranceCanpany = (tenantId,medicalInstutionId,data) => {
      const url = `insurance_company/${tenantId}/update/${medicalInstutionId}`;
      return  apiClient_benefit.put(url,data);
    };
//medical instution

export const createMedicalInstution = (tenantId,data) => {
  const url = `medical-institution/${tenantId}/add`;
  return  apiClient_benefit.post(url,data);
};

export const getAllMedicalInstution = (tenantId) => {
  const url = `medical-institution/${tenantId}/get-all`;
  return  apiClient_benefit.get(url);
};

export const getMedicalInstutionById = (tenantId,medicalInstutionId) => {
  const url = `medical-institution/${tenantId}/get/${medicalInstutionId}`;
  return  apiClient_benefit.get(url);
};
export const deleteMedicalInstution = (tenantId,medicalInstutionId) => {
  const url = `medical-institution/${tenantId}/delete/${medicalInstutionId}`;
  return  apiClient_benefit.delete(url);
};

export const updateMedicalInstution = (tenantId,medicalInstutionId,data) => {
  const url = `medical-institution/${tenantId}/update/${medicalInstutionId}`;
  return  apiClient_benefit.put(url,data);
};
//over time api
export const createOverTime = (tenantId,data) => {
  const url = `overtime/${tenantId}/add`;
  return  apiClient_benefit.post(url,data);
};

export const getAllOverTime = (tenantId) => {
  const url = `overtime/${tenantId}/get-all`;
  return  apiClient_benefit.get(url);
};


export const getOverTimeById = (tenantId,overTimeId) => {
  const url = `overtime/${tenantId}/get/${overTimeId}`;
  return  apiClient_benefit.get(url);
};

export const updateOverTime = (tenantId,overTimeId,data) => {
  const url = `overtime/${tenantId}/update/${overTimeId}`;
  return  apiClient_benefit.put(url,data);
};

export const deleteOverTime = (tenantId,overTimeId) => {
  const url = `overtime/${tenantId}/delete/${overTimeId}`;
  return  apiClient_benefit.delete(url);
};

//uniform
export const createUniform = (tenantId,data) => {
  const url = `uniform/${tenantId}/add`;
  return  apiClient_benefit.post(url,data);
};

export const getAllUniform = (tenantId) => {
  const url = `uniform/${tenantId}/get-all`;
  return  apiClient_benefit.get(url);
};

export const deleteUniform = (tenantId,unifromId) => {
  const url = `uniform/${tenantId}/delete/${unifromId}`;
  return  apiClient_benefit.delete(url);
};

export const getUniformById = (tenantId,unifromId) => {
  const url = `uniform/${tenantId}/get/${unifromId}`;
  return  apiClient_benefit.get(url);
};

export const updateUniform = (tenantId,unifromId,data) => {
  const url = `uniform/${tenantId}/update/${unifromId}`;
  return  apiClient_benefit.put(url,data);
};

export const approveUniform = (tenantId,unifromId,data) => {
  const url = `uniform/${tenantId}/approve/${unifromId}`;
  return  apiClient_benefit.put(url,data);
};
 

