
import axios from "axios";
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_COMPLAINT = `${BASE_URL}/complaint`;
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


const apiClient_complaint = createApiClient(REST_API_BASE_URL_COMPLAINT);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);


// Add a new complaint with file attachments
export const addComplaint = async (tenantId, formData) => {
  const url = `/complaints/${tenantId}/add`;
  try {
    const response = await apiClient_complaint.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating complaint:", error.response || error.message);
    throw error;
  }
};

// ...existing code...

// Update an existing complaint
export const updateComplaint = async (tenantId, complaintId, data) => {
  const url = `/complaints/${tenantId}/update/${complaintId}`;
  try {
    const response = await apiClient_complaint.put(url, data);
    return response;
  } catch (error) {
    console.error("Error updating complaint:", error.response || error.message);
    throw error;
  }
};

// Get a specific complaint by ID
export const getComplaint = async (tenantId, complaintId) => {
  const url = `/complaints/${tenantId}/get/${complaintId}`;
  try {
    const response = await apiClient_complaint.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching complaint:", error.response || error.message);
    throw error;
  }
};

// Get all complaints for a tenant
export const getAllComplaints = async (tenantId) => {
  const url = `/complaints/${tenantId}/get-all`;
  try {
    const response = await apiClient_complaint.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching complaints:",
      error.response || error.message
    );
    throw error;
  }
};

// Get complaints by type
export const getComplaintsByType = async (tenantId, complaintTypeId) => {
  const url = `/complaints/${tenantId}/get-by-type/${complaintTypeId}`;
  try {
    const response = await apiClient_complaint.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching complaints by type:",
      error.response || error.message
    );
    throw error;
  }
};

// Get complaints by employee
export const getComplaintsByEmployee = async (tenantId, employeeId) => {
  const url = `/complaints/${tenantId}/get-by-employee/${employeeId}`;
  try {
    const response = await apiClient_complaint.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching complaints by employee:",
      error.response || error.message
    );
    throw error;
  }
};

// Get employee by employee ID
export const getEmployeeByEmployeeId = async (tenantId, employeeId) => {
  const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
  try {
    const response = await apiClient_employee.get(url); // Correctly using apiClient_employee
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching employee by ID:",
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

// Delete a specific complaint by ID
export const deleteComplaint = async (tenantId, complaintId) => {
  const url = `/complaints/${tenantId}/delete/${complaintId}`;
  try {
    const response = await apiClient_complaint.delete(url);
    return response;
  } catch (error) {
    console.error("Error deleting complaint:", error.response || error.message);
    throw error;
  }
};

export default apiClient_complaint;
