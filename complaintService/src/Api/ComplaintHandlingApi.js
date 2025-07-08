
import axios from "axios";
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_COMPLAINT = `${BASE_URL}/complaint`;
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


const apiClient_complaintHandling = createApiClient(REST_API_BASE_URL_COMPLAINT);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);


// Add a new complaint handling
export const addComplaintHandling = async (tenantId, data) => {
  const url = `/complaint-handling/${tenantId}/add`;
  try {
    const response = await apiClient_complaintHandling.post(url, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding complaint handling:",
      error.response || error.message
    );
    throw error;
  }
};

// Update an existing complaint handling
export const updateComplaintHandling = async (tenantId, handlingId, data) => {
  const url = `/complaint-handling/${tenantId}/update/${handlingId}`;
  try {
    const response = await apiClient_complaintHandling.put(url, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating complaint handling:",
      error.response || error.message
    );
    throw error;
  }
};

export const updateComplaintHandlingDecision = async (
  tenantId,
  handlingId,
  data
) => {
  const url = `/complaint-handling/${tenantId}/decision/${handlingId}`;
  try {
    const response = await apiClient_complaintHandling.put(url, data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating complaint handling decision:",
      error.response || error.message
    );
    throw error;
  }
};

// Get a specific complaint handling by ID
export const getComplaintHandling = async (tenantId, handlingId) => {
  const url = `/complaint-handling/${tenantId}/get/${handlingId}`;
  try {
    const response = await apiClient_complaintHandling.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching complaint handling:",
      error.response || error.message
    );
    throw error;
  }
};

// Get complaint handling(s) by complaintId
export const getComplaintHandlingsByComplaint = async (
  tenantId,
  complaintId
) => {
  const url = `/complaint-handling/${tenantId}/get-by-complaint/${complaintId}`;
  try {
    const response = await apiClient_complaintHandling.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching complaint handling by complaintId:",
      error.response || error.message
    );
    throw error;
  }
};

// Get complaint handlings by departmentId
export const getComplaintHandlingsByDepartment = async (
  tenantId,
  departmentId
) => {
  const url = `/complaint-handling/${tenantId}/get-by-department/${departmentId}`;
  try {
    const response = await apiClient_complaintHandling.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching complaint handling by departmentId:",
      error.response || error.message
    );
    throw error;
  }
};

// Delete a specific complaint handling by ID
export const deleteComplaintHandling = async (tenantId, handlingId) => {
  const url = `/complaint-handling/${tenantId}/delete/${handlingId}`;
  try {
    const response = await apiClient_complaintHandling.delete(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting complaint handling:",
      error.response || error.message
    );
    throw error;
  }
};

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

// --- Employee API Methods (added as in ComplaintApi.js) ---

// Get employee by employee ID
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

// Get employee by ID
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

export default apiClient_complaintHandling;
