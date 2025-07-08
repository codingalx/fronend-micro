import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_SEPARATION = `${BASE_URL}/separation`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
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
const apiClient_separation = createApiClient(REST_API_BASE_URL_SEPARATION);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);



//Temination Api
export const updateTermination = (tenantId, terminationId, data) => {
  return apiClient_separation.put(`/terminations/${tenantId}/update/${terminationId}`, data, {
      headers: {
          'Content-Type': 'multipart/form-data', 
      },
  });
};
  export const approveTermination = (tenantId, terminationId, formData) => {
    return apiClient_separation.put(`/terminations/${tenantId}/approve/${terminationId}`, formData);
  };
  
export const createTermination = (tenantId, data) => {
  return apiClient_separation.post(`/terminations/${tenantId}/add`, data, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensures file data is sent properly
    },
  });
};

  
  export const getTermination = (tenantId, terminationId, employeeId) => {
    return apiClient_separation.get(`/terminations/${tenantId}/get/${terminationId}`, {
        params: {
            employeeId: employeeId
        }
    });
};
  

export const getTerminationFile = (tenantId, terminationId) => {
  return apiClient_separation.get(`/terminations/${tenantId}/get-file/${terminationId}`);
};
  
  export const getAllTerminations = (tenantId) => {
    return apiClient_separation.get(`/terminations/${tenantId}/get-all`);
  };
  

export const deleteTermination = (tenantId, terminationId) => {
  return apiClient_separation.delete(`/terminations/${tenantId}/delete/${terminationId}`);
};
export const getEmployeeTerminations = (tenantId) => {
  return apiClient_separation.get(`/terminations/${tenantId}/get/employee-terminations`);
};

// Termination Type Api
export const updateTerminationType = (tenantId, terminationTypeId, data) => {
    return apiClient_separation.put(`/termination-types/${tenantId}/update/${terminationTypeId}`, data);
  };
  
  export const addTerminationType = (tenantId, data) => {
    return apiClient_separation.post(`/termination-types/${tenantId}/add`, data);
  };
  
  export const getTerminationType = (tenantId, terminationTypeId) => {
    return apiClient_separation.get(`/termination-types/${tenantId}/get/${terminationTypeId}`);
  };
  
  export const getAllTerminationTypes = (tenantId) => {
    return apiClient_separation.get(`/termination-types/${tenantId}/get-all`);
  };
  
  export const deleteTerminationType = (tenantId, terminationTypeId) => {
    return apiClient_separation.delete(`/termination-types/${tenantId}/delete/${terminationTypeId}`);
  };
  

  //Retirment Api
  export const updateRetirement = (tenantId, retirementId, data) => {
    return apiClient_separation.put(`/retirements/${tenantId}/update/${retirementId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  };
  
  export const approveRetirement = (tenantId, retirementId, formData) => {
    return apiClient_separation.put(`/retirements/${tenantId}/approve/${retirementId}`, formData);
  };
  
export const createRetirement = (tenantId, formData) => {
  return apiClient_separation.post(`/retirements/${tenantId}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',  
    },
  });
};

  export const getRetirement = (tenantId, retirementId) => {
    return apiClient_separation.get(`/retirements/${tenantId}/get/${retirementId}`);
  };
  
   

  export const getRetirementFile = (tenantId, retirementId) => {
    return apiClient_separation.get(`/retirements/${tenantId}/get-file/${retirementId}`);
  };
  
 

  export const getAllRetirements = (tenantId) => {
    return apiClient_separation.get(`/retirements/${tenantId}/get-all`);
  };
  
 
  export const deleteRetirement = (tenantId, retirementId) => {
    return apiClient_separation.delete(`/retirements/${tenantId}/delete/${retirementId}`);
  };
  export const getEmployeeRetirements = (tenantId) => {
    return apiClient_separation.get(`/retirements/${tenantId}/get/employee-retirements`);
  };
  
  //Exit Interview Api
export const updateExitInterview = (tenantId, interviewId, data) => {
    return apiClient_separation.put(`/exit-interviews/${tenantId}/update/${interviewId}`, data);
  };
  
  export const createExitInterview = (tenantId, data) => {
    return apiClient_separation.post(`/exit-interviews/${tenantId}/add`, data);
  };
 
  export const getExitInterview = (tenantId, interviewId) => {
    return apiClient_separation.get(`/exit-interviews/${tenantId}/get/${interviewId}`);
  };
  
  
  export const getAllExitInterviews = (tenantId) => {
    return apiClient_separation.get(`/exit-interviews/${tenantId}/get-all`);
  };
  

  export const deleteExitInterview = (tenantId, interviewId) => {
    return apiClient_separation.delete(`/exit-interviews/${tenantId}/delete/${interviewId}`);
  };

 // Clearance Api
  export const updateClearance = (tenantId, clearanceId, status, data) => {
    return apiClient_separation.put(
        `/clearances/${tenantId}/update/${clearanceId}?status=${status}`, 
        data
    );
};

 
  export const createClearance = (tenantId, data) => {
    return apiClient_separation.post(`/clearances/${tenantId}/add`, data);
  };
  
 
  export const getClearance = (tenantId, clearanceId) => {
    return apiClient_separation.get(`/clearances/${tenantId}/get/${clearanceId}`);
  };

  export const getAllClearances = (tenantId) => {
    return apiClient_separation.get(`/clearances/${tenantId}/get-all`);
  };
  
  export const deleteClearance = (tenantId, clearanceId) => {
    return apiClient_separation.delete(`/clearances/${tenantId}/delete/${clearanceId}`);
  };
  

//Clearance Department Api
  export const updateClearanceDepartment = (tenantId, departmentId, sequencePriority, data) => {
    return apiClient_separation.put(
      `/clearance-departments/${tenantId}/update/${departmentId}?sequencePriority=${sequencePriority}`,
      data
    );
  };
  
  
  export const createClearanceDepartment = (tenantId, data) => {
    return apiClient_separation.post(`/clearance-departments/${tenantId}/add`, data);
  };
  

 
  export const getClearanceDepartment = (tenantId, clearanceDepartmentId) => {
    return apiClient_separation.get(`/clearance-departments/${tenantId}/get/${clearanceDepartmentId}`);
  };
  
  
  export const getAllClearanceDepartments = (tenantId) => {
    return apiClient_separation.get(`/clearance-departments/${tenantId}/get-all`);
  };

export const getAllDepartments = (tenantId) => {
  return apiClient_organization.get(`/departments/${tenantId}/get-all`);
};
 
  export const deleteClearanceDepartment = (tenantId, clearanceDepartmentId) => {
    return apiClient_separation.delete(`/clearance-departments/${tenantId}/delete/${clearanceDepartmentId}`);
    
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
export const getTerminationStatus = (tenantId, status) => {
  return apiClient_separation.get(`/terminations/${tenantId}/get/status`, {
    params: { status },
  });
};
export const getRetirementStatus = (tenantId, status) => {
  return apiClient_separation.get(`/retirements/${tenantId}/get/status`, {
      params: { status: status }, 
  });
};