import axios from "axios";
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_TRANSFER = `${BASE_URL}/transfer`;
export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
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


const apiClient_transfer = createApiClient(REST_API_BASE_URL_TRANSFER);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);

export const listDepartments = async (tenantId) => {
  const url = `departments/${tenantId}/get-all`;
  try {
    const response = await apiClient_organization.get(url);
    return response;
  } catch (error) {
    console.error(
      "Error fetching departments:",
      error.response || error.message
    );
    throw error;
  }
};

export const listDutyStations = async (tenantId) => {
  const url = `duty-stations/${tenantId}/get-all`;
  try {
    const response = await apiClient_employee.get(url);
    return response;
  } catch (error) {
    console.error(
      "Error fetching duty stations:",
      error.response || error.message
    );
    throw error;
  }
};

export const createTransfer = async (tenantId, employeeId, transferData) => {
  const url = `transfers/${tenantId}/add`;
  try {
    const response = await apiClient_transfer.post(url, {
      ...transferData,
      employeeId,
    });
    return response;
  } catch (error) {
    console.error("Error creating transfer:", error.response || error.message);
    throw error;
  }
};

export const updateTransfer = async (tenantId, transferId, transferData) => {
  const url = `transfers/${tenantId}/update/${transferId}`;
  return apiClient_transfer.put(url, transferData);
};

export const getDepartementById = (tenantId, id) => {
  return apiClient_organization.get(`departments/${tenantId}/get/${id}`);
};

export const deleteTransfer = async (tenantId, transferId) => {
  const url = `transfers/${tenantId}/delete/${transferId}`;
  return apiClient_transfer.delete(url);
};

export const getDepartmentById = async (tenantId, departmentId) => {
  const url = `departments/${tenantId}/get/${departmentId}`;
  try {
    const response = await apiClient_organization.get(url);
    return response;
  } catch (error) {
    console.error(
      "Error fetching department:",
      error.response || error.message
    );
    throw error;
  }
};

export const getDutyStationById = async (tenantId, stationId) => {
  const url = `duty-stations/${tenantId}/get/${stationId}`;
  try {
    const response = await apiClient_employee.get(url);
    return response;
  } catch (error) {
    console.error(
      "Error fetching duty station:",
      error.response || error.message
    );
    throw error;
  }
};

export const getAllEmployees = async (tenantId) => {
  const url = `employees/${tenantId}/get-all`;
  try {
    const response = await apiClient_employee.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching employees:", error.response || error.message);
    throw error;
  }
};

export const getAllTransfers = async (tenantId) => {
  const url = `transfers/${tenantId}/get-all`;
  try {
    const response = await apiClient_transfer.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching transfers from getAllTransfers:",
      error.response || error.message
    );
    throw error;
  }
};

export const getEmployeeById = async (tenantId, employeeId) => {
  const url = `employees/${tenantId}/get/${employeeId}`;
  try {
    const response = await apiClient_employee.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching employee by ID:",
      error.response || error.message
    );
    throw error;
  }
};

export const getTransfersByEmployee = async (tenantId, employeeId, status) => {
  const url = `transfers/${tenantId}/get/employee/${employeeId}?status=${status}`;
  try {
    const response = await apiClient_transfer.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching transfers by employee:",
      error.response || error.message
    );
    throw error;
  }
};

export const getTransferById = async (tenantId, transferId) => {
  const url = `transfers/${tenantId}/get/${transferId}`;
  try {
    const response = await apiClient_transfer.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching transfer by ID:",
      error.response || error.message
    );
    throw error;
  }
};

export const getEmployeeByEmployeeId = async (tenantId, employeeId) => {
  const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
  try {
    const response = await apiClient_employee.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching employee by ID:",
      error.response || error.message
    );
    throw error;
  }
};

export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_transfer.get(url);
};

export const getTenantById = (tenantId) => {
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};
