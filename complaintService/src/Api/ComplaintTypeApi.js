import axios from 'axios';

const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_COMPLAINT = `${BASE_URL}/complaint`;



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



export const addComplaintType = async (tenantId, data) => {
  const url = `/complaint-types/${tenantId}/add`;
  try {
    const response = await apiClient_complaint.post(url, data);
    return response;
  } catch (error) {
    console.error(
      "Error creating complaint type:",
      error.response || error.message
    );
    throw error;
  }
};

export const updateComplaintType = async (tenantId, complaintTypeId, data) => {
  const url = `/complaint-types/${tenantId}/update/${complaintTypeId}`;
  try {
    const response = await apiClient_complaint.put(url, data);
    return response;
  } catch (error) {
    console.error(
      "Error updating complaint type:",
      error.response || error.message
    );
    throw error;
  }
};

export const getComplaintType = async (tenantId, complaintTypeId) => {
  const url = `/complaint-types/${tenantId}/get/${complaintTypeId}`;
  try {
    const response = await apiClient_complaint.get(url);
    return response;
  } catch (error) {
    console.error(
      "Error fetching complaint type:",
      error.response || error.message
    );
    throw error;
  }
};

// const testGetComplaintType = async () => {
//   const tenantId = "71839b5e-20f6-44b1-925d-65580fee6d58";
//   const complaintTypeId = "1950732d-c8c6-45fc-9313-0fd963c292dc";

//   try {
//     const response = await getComplaintType(tenantId, complaintTypeId);
//     console.log("Complaint Type Data:", response.data);
//   } catch (error) {
//     console.error("Error during testGetComplaintType:", error);
//   }
// };

// // Call the test function
// testGetComplaintType();

export const getAllComplaintTypes = async (tenantId) => {
  const url = `/complaint-types/${tenantId}/get-all`;
  try {
    const response = await apiClient_complaint.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching complaint types:",
      error.response || error.message
    );
    throw error;
  }
};

export const deleteComplaintType = async (tenantId, complaintTypeId) => {
  const url = `/complaint-types/${tenantId}/delete/${complaintTypeId}`;
  try {
    const response = await apiClient_complaint.delete(url);
    return response;
  } catch (error) {
    console.error(
      "Error deleting complaint type:",
      error.response || error.message
    );
    throw error;
  }
};

export default apiClient_complaint;
