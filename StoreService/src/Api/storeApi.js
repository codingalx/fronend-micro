
import axios from "axios";
const BASE_URL = import.meta.env.BACKEND_BASE_URL
  ? `${import.meta.env.BACKEND_BASE_URL}/api`
  : "http://gateway.172.20.136.101.sslip.io/api";
const KEYCLOAK_BASE_URL = import.meta.env.KEYCLOAK_BASE_URL
  ? `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${
      import.meta.env.KEYCLOAK_REALM
    }/protocol/openid-connect/token`
  : "http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token";

export const REST_API_BASE_URL_STORE = `${BASE_URL}/store`;
export const REST_API_BASE_URL_ITEM = `${BASE_URL}/item`;
export const REST_API_BASE_URL_STOCK = `${BASE_URL}/stock-movement`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;

const createApiClient = (baseURL) => {
  const apiClient = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Add request interceptor for setting the token
  apiClient.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for handling token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const data = new URLSearchParams({
              grant_type: "refresh_token",
              client_id: import.meta.env.KEYCLOAK_CLIENT_ID || "saas-client",
              client_secret:
                import.meta.env.KEYCLOAK_CLIENT_SECRET ||
                "APHalzvUVsfz9Jffe5ZAZ1XImFwv5a8K",
              refresh_token: refreshToken,
            });

            const response = await axios.post(KEYCLOAK_BASE_URL, data, {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            const newAccessToken = response.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

const apiClient_store = createApiClient(REST_API_BASE_URL_STORE);
const apiClient_item = createApiClient(REST_API_BASE_URL_ITEM);
const apiClient_stock = createApiClient(REST_API_BASE_URL_STOCK);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);


// Store Api
// Create a store
export const createStore = (tenantId, data) => {
  return apiClient_store.post(`/stores/${tenantId}/add`, data);
};

// Update a store
export const updateStore = (tenantId, id, data) => {
  return apiClient_store.put(`/stores/${tenantId}/update/${id}`, data);
};

// Get a store by ID
export const getStoreById = (tenantId, id) => {
  return apiClient_store.get(`/stores/${tenantId}/get/${id}`);
};

// Get all stores
export const getAllStores = (tenantId) => {
  return apiClient_store.get(`/stores/${tenantId}/get-all`);
};

// Delete a store
export const deleteStore = (tenantId, id) => {
  return apiClient_store.delete(`/stores/${tenantId}/delete/${id}`);
};


// Create a store requisition
export const createStoreRequisition = (tenantId, formData) => {
  return apiClient_store.post(`/store-requisitions/${tenantId}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// Update a store requisition
// export const updateStoreRequisition = (tenantId, id, data) => {
//   return apiClient_store.put(`/store-requisitions/${tenantId}/update/${id}`, data);
// };
export const updateStoreRequisition = (tenantId,id, formData) => {
  return apiClient_store.put(`/store-requisitions/${tenantId}/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// Get a store requisition by ID
export const getStoreRequisitionById = (tenantId, id) => {
  return apiClient_store.get(`/store-requisitions/${tenantId}/get/${id}`);
};

// Get all store requisitions
export const getAllStoreRequisitions = (tenantId) => {
  return apiClient_store.get(`/store-requisitions/${tenantId}/get-all`);
};

// Delete a store requisition
export const deleteStoreRequisition = (tenantId, id) => {
  return apiClient_store.delete(`/store-requisitions/${tenantId}/delete/${id}`);
};


//Storage Catagory Api

// Create a store category
export const createStoreCategory = (tenantId, data) => {
  return apiClient_store.post(`/store-categories/${tenantId}/add`, data);
};

// Update a store category
export const updateStoreCategory = (tenantId, id, data) => {
  return apiClient_store.put(`/store-categories/${tenantId}/update/${id}`, data);
};

// Get a store category by ID
export const getStoreCategoryById = (tenantId, id) => {
  return apiClient_store.get(`/store-categories/${tenantId}/get/${id}`);
};

// Get all store categories
export const getAllStoreCategories = (tenantId) => {
  return apiClient_store.get(`/store-categories/${tenantId}/get-all`);
};

// Delete a store category
export const deleteStoreCategory = (tenantId, id) => {
  return apiClient_store.delete(`/store-categories/${tenantId}/delete/${id}`);
};

//Shelf Api

// Create a shelf
export const createShelf = (tenantId, data) => {
  return apiClient_store.post(`/shelves/${tenantId}/add`, data);
};

// Update a shelf
export const updateShelf = (tenantId, shelfId, data) => {
  return apiClient_store.put(`/shelves/${tenantId}/update/${shelfId}`, data);
};

// Get a shelf by ID
export const getShelfById = (tenantId, storeId, shelfId) => {
  return apiClient_store.get(`/shelves/${tenantId}/${storeId}/get/${shelfId}`);
};

// Get all shelves for a store
export const getAllShelves = (tenantId, storeId) => {
  return apiClient_store.get(`/shelves/${tenantId}/${storeId}/get-all`);
};

// Delete a shelf
export const deleteShelf = (tenantId, shelfId) => {
  return apiClient_store.delete(`/shelves/${tenantId}/delete/${shelfId}`);
};

//Receviable Item Api

// Create a receivable item
export const createReceivableItem = (tenantId, data) => {
  return apiClient_store.post(`/receivable-items/${tenantId}/add`, data);
};

// Update a receivable item
export const updateReceivableItem = (tenantId, id, data) => {
  return apiClient_store.put(`/receivable-items/${tenantId}/update/${id}`, data);
};

// Get a receivable item by ID
export const getReceivableItemById = (tenantId, id) => {
  return apiClient_store.get(`/receivable-items/${tenantId}/get/${id}`);
};

// Get receivable items by store ID
export const getReceivableItemsByStore = (tenantId, storeId) => {
  return apiClient_store.get(`/receivable-items/${tenantId}/get-by-store/${storeId}`);
};

// Get all receivable items
export const getAllReceivableItems = (tenantId) => {
  return apiClient_store.get(`/receivable-items/${tenantId}/get-all`);
};

// Delete a receivable item
export const deleteReceivableItem = (tenantId, id) => {
  return apiClient_store.delete(`/receivable-items/${tenantId}/delete/${id}`);
};

//Issuable Item Api

// Create an issuable item
export const createIssuableItem = (tenantId, data) => {
  return apiClient_store.post(`/issuable-items/${tenantId}/add`, data);
};

// Update an issuable item
export const updateIssuableItem = (tenantId, id, data) => {
  return apiClient_store.put(`/issuable-items/${tenantId}/update/${id}`, data);
};

// Get an issuable item by ID
export const getIssuableItemById = (tenantId, id) => {
  return apiClient_store.get(`/issuable-items/${tenantId}/get/${id}`);
};

// Get issuable items by store ID
export const getIssuableItemsByStore = (tenantId, storeId) => {
  return apiClient_store.get(`/issuable-items/${tenantId}/get-by-store/${storeId}`);
};

// Get all issuable items
export const getAllIssuableItems = (tenantId) => {
  return apiClient_store.get(`/issuable-items/${tenantId}/get-all`);
};

// Delete an issuable item
export const deleteIssuableItem = (tenantId, id) => {
  return apiClient_store.delete(`/issuable-items/${tenantId}/delete/${id}`);
};

// Cell Api
// Create a cell
export const createCell = (tenantId, data) => {
  return apiClient_store.post(`/cells/${tenantId}/add`, data);
};

// Update a cell
export const updateCell = (tenantId, cellId, data) => {
  return apiClient_store.put(`/cells/${tenantId}/update/${cellId}`, data);
};

// Get a cell by ID
export const getCellById = (tenantId, shelfId, cellId) => {
  return apiClient_store.get(`/cells/${tenantId}/${shelfId}/get/${cellId}`);
};

// Get all cells by shelf
export const getAllCells = (tenantId, shelfId) => {
  return apiClient_store.get(`/cells/${tenantId}/${shelfId}/get-all`);
};

// Delete a cell
export const deleteCell = (tenantId, cellId) => {
  return apiClient_store.delete(`/cells/${tenantId}/delete/${cellId}`);
};

// Get all items
export const getAllItems = (tenantId) => {
  return apiClient_item.get(`/items/${tenantId}/get-all`);
};

export const getItemById = (tenantId, itemId, ) => {
  return apiClient_item.get(`/items/${tenantId}/get/${itemId}`);
};

export const getAllForReceivableItems = (tenantId) => {
  return apiClient_stock.get(`/isiv-for-receiving/${tenantId}/get-all`);
};
export const getForReceivableItemsById = (tenantId,id) => {
  return apiClient_stock.get(`/isiv-for-receiving/${tenantId}/get/${id}`);
};

export const getAllForIssuableItems = (tenantId) => {
  return apiClient_stock.get(`/isiv-for-issue/${tenantId}/get-all`);
};
export const getForIssuableItemsById = (tenantId,id) => {
  return apiClient_stock.get(`/isiv-for-issue/${tenantId}/get/${id}`);
};

export const getAllGoodReceivingNotes = (tenantId) => {
  return apiClient_stock.get(`/good-receiving-note/${tenantId}/get-all`);
};

export const getGoodReceivingNoteById = (tenantId,id) => {
  return apiClient_stock.get(`/good-receiving-note/${tenantId}/get/${id}`);
};


export const getAllStoreIssueVoucher = (tenantId) => {
  return apiClient_stock.get(`/storeIssueVoucher/${tenantId}/get-all`);
};

export const getStoreIssueVoucherById = (tenantId,id) => {
  return apiClient_stock.get(`/storeIssueVoucher/${tenantId}/get/${id}`);
};
