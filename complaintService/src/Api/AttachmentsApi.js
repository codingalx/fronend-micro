
import axios from "axios";
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


const apiClient_attachments = createApiClient(REST_API_BASE_URL_COMPLAINT);


// Download attachment file
export const downloadAttachment = async (tenantId, attachmentId) => {
  const url = `/attachments/${tenantId}/${attachmentId}/download`;
  try {
    const response = await apiClient_attachments.get(url, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error(
      "Error downloading attachment:",
      error.response || error.message
    );
    throw error;
  }
};

// Get attachment metadata and file bytes
export const getAttachment = async (tenantId, attachmentId) => {
  const url = `/attachments/${tenantId}/get/${attachmentId}`;
  try {
    const response = await apiClient_attachments.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching attachment:",
      error.response || error.message
    );
    throw error;
  }
};

// Get all attachments for a complaint
export const getAllAttachmentsByComplaint = async (tenantId, complaintId) => {
  const url = `/attachments/${tenantId}/get-all/${complaintId}`;
  try {
    const response = await apiClient_attachments.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching attachments by complaint:",
      error.response || error.message
    );
    throw error;
  }
};

// Delete an attachment
export const deleteAttachment = async (tenantId, attachmentId) => {
  const url = `/attachments/${tenantId}/delete/${attachmentId}`;
  try {
    const response = await apiClient_attachments.delete(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting attachment:",
      error.response || error.message
    );
    throw error;
  }
};

export default apiClient_attachments;
