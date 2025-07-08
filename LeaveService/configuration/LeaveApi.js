import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');


export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
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
const apiClientLeave = createApiClient(REST_API_BASE_URL_LEAVE);



// Leave Request Endpoints

export const getEmployeeByEmployeId = (tenantId,employeeId) => {
  const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
  return  apiClient_employee.get(url);
};

export const leaveRequestEndpoint = (authToken) => ({
  url: `${BASE_URL}/leave/leave-requests`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllLeaveRequestsEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-requests/${tenantsId}/get-all`;

export const getLeaveRequestEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-requests/${tenantsId}/get`;

export const addLeaveRequestEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-requests/${tenantsId}/add`;

export const deleteLeaveRequestEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-requests/${tenantsId}/delete`;

export const updateLeaveRequestEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-requests/${tenantsId}/update`;

// holiday management
export const holidayManagementEndpoint = (authToken) => ({
  url: `${BASE_URL}/leave/holiday-managements`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

// Holidays Endpoints
export const holidayEndpoint = (authToken) => ({
  url: `${BASE_URL}/leave/holidays`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllHolidaysEndpoint = (tenantsId) =>
  `${BASE_URL}/holidays/${tenantsId}/get-all`;

export const addHolidaysEndpoint = (tenantsId) =>
  `${BASE_URL}/holidays/${tenantsId}/add`;

export const deleteHolidaysEndpoint = (tenantsId) =>
  `${BASE_URL}/holidays/${tenantsId}/delete`;

export const getHolidaysEndpoint = (tenantsId) =>
  `${BASE_URL}/holidays/${tenantsId}/get`;

export const updateHolidaysEndpoint = (tenantsId) =>
  `${BASE_URL}/holidays/${tenantsId}/update`;

// Budget Years Endpoints
export const budgetYearEndpoint = (authToken) => ({
  url: `${BASE_URL}/leave/budget-years`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllBudgetYearEndpoint = (tenantsId) =>
  `${BASE_URL}/budget-years/${tenantsId}/get-all`;

export const addBudgetYearEndpoint = (tenantsId) =>
  `${BASE_URL}/budget-years/${tenantsId}/add`;

export const getBudgetYearEndpoint = (tenantsId) =>
  `${BASE_URL}/budget-years/${tenantsId}/get`;

export const deleteBudgetYearEndpoint = (tenantsId) =>
  `${BASE_URL}/budget-years/${tenantsId}/delete`;

export const updateBudgetYearEndpoint = (tenantsId) =>
  `${BASE_URL}/budget-years/${tenantsId}/update`;

// Leave Types Endpoints
export const leaveTypesEndpoint = (authToken) => ({
  url: `${BASE_URL}/leave/leave-types`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllLeaveTypesEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-types/${tenantsId}/get-all`;

export const getLeaveTypesEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-types/${tenantsId}/get`;

export const addLeaveTypesEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-types/${tenantsId}/add`;

export const deleteLeaveTypesEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-types/${tenantsId}/delete`;

export const updateLeaveTypesEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-types/${tenantsId}/update`;

// Leave Settings Endpoints
export const leaveSettingsEndpoint = (authToken) => ({
  url: `${BASE_URL}/leave/leave-settings`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllLeaveSettingsEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-settings/${tenantsId}/get-all`;

export const getLeaveSettingsEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-settings/${tenantsId}/get`;

export const addLeaveSettingsEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-settings/${tenantsId}/add`;

export const deleteLeaveSettingsEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-settings/${tenantsId}/delete`;

export const updateLeaveSettingsEndpoint = (tenantsId) =>
  `${BASE_URL}/leave-settings/${tenantsId}/update`;




export const getAllLeaveType = (tenantId) => {
  return apiClientLeave.get(`leave/leave-types/${tenantId}/get-all`);
};

export const calculateLeaverequest = (tenantId,data) => {
  return apiClientLeave.post(`leave/leave-requests/${tenantId}/calculate`,data);
};

export const getAllLeaveRequest = (tenantId) => {
  return apiClientLeave.get(`leave/leave-requests/${tenantId}/get-all`);
};


export const addLeaveRequest = (tenantId,data) => {
  return apiClientLeave.post(`leave/leave-requests/${tenantId}/add`,data);
};

export const deleteLeaveRequest = (tenantId,id) => {
  return apiClientLeave.delete(`leave/leave-requests/${tenantId}/delete/${id}`);
};

export const getLeaveRequestById = (tenantId,id) => {
  return apiClientLeave.get(`leave/leave-requests/${tenantId}/get/${id}`);
};

export const getLeaveRequestByStatus = (tenantId,decision) => {
  const url = `leave/leave-requests/${tenantId}/get/status?decision=${decision}`;
  return apiClientLeave.get(url);
};

export const getAllbudgetYears = (tenantId) => {
  return apiClientLeave.get(`leave/budget-years/${tenantId}/get-all`);
};


export const approvanceOfLeaveRequestDepartement = (tenantId,requestId, data) => {
  return apiClientLeave.put(`leave/leave-requests/${tenantId}/department-approve/${requestId}`, data);
};


export const approvanceOfLeaveRequestHr = (tenantId,requestId, data) => {
  return apiClientLeave.put(`leave/leave-requests/${tenantId}/hr-approve/${requestId}`, data);
};

export const getLeaveRequestByEmployeId = (tenantId,employeeId) => {
  return apiClientLeave.get(`leave/leave-requests/${tenantId}/leave-requests/employees/${employeeId}`);
};


export const addleaveschedule = (tenantId,data) => {
  return apiClientLeave.post(`leave/leave-schedules/${tenantId}/add`,data);
};

export const getAlleaveschedule = (tenantId) => {
  return apiClientLeave.get(`leave/leave-schedules/${tenantId}/get-all`);
};

export const deleteLeaveSchedule = (tenantId,id) => {
  return apiClientLeave.delete(`leave/leave-schedules/${tenantId}/delete/${id}`);
};

export const getLeaveScheduleById = (tenantId,id) => {
  return apiClientLeave.get(`leave/leave-schedules/${tenantId}/get/${id}`);
};

export const updateLeaveSchedule = (tenantId,id, data) => {
  return apiClientLeave.put(`leave/leave-schedules/${tenantId}/update/${id}`, data);
};

export const getLeaveScedulesByEmployeId = (tenantId,employeeId) => {
  return apiClientLeave.get(`leave/leave-schedules/${tenantId}/leave-schedules/employees/${employeeId}`);
};

export const getLeaveBalance = (tenantId,budgetYearId,employeeId) => {
  return apiClientLeave.get(`leave/leave-balance/${tenantId}/calculate/${budgetYearId}/${employeeId}`);
};

export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `leave/resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClientLeave.get(url);
};


export const getTenantById = () => {
  const tenantId = localStorage.getItem('tenantId');
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};


