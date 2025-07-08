import axios from "axios";

const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_AUTH = `${BASE_URL}/auth`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_RECRUITMENT = `${BASE_URL}/recruitment`;
export const REST_API_BASE_URL_PLANNING = `${BASE_URL}/hr-planning`;
export const REST_API_BASE_URL_LEAVE = `${BASE_URL}/leave`;
export const REST_API_BASE_URL_TRAINING = `${BASE_URL}/training`;
export const REST_API_BASE_URL_EVALUATION = `${BASE_URL}/evaluation`;
export const REST_API_BASE_URL_DELEGATION = `${BASE_URL}/delegation`;
export const REST_API_BASE_URL_DOCUMENT = `${BASE_URL}/document`;
export const REST_API_BASE_URL_TRANSFER = `${BASE_URL}/transfer`;
export const REST_API_BASE_URL_SEPARATION = `${BASE_URL}/separation`;
export const REST_API_BASE_URL_PROMOTION = `${BASE_URL}/promotion`;
export const REST_API_BASE_URL_COMPLAINT = `${BASE_URL}/complaint`;
export const REST_API_BASE_URL_DISCIPLINE = `${BASE_URL}/discipline`;

// Function to create an Axios client with interceptors
const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // Add request interceptor for setting the token
  client.interceptors.request.use(
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
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the error is a 401
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite loop
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const data = new URLSearchParams({
              grant_type: "refresh_token",
              client_id: "saas-client",
              client_secret: "APHalzvUVsfz9Jffe5ZAZ1XImFwv5a8K",
              refresh_token: refreshToken,
            });

            // Request new access token
            const response = await axios.post(
              KEYCLOAK_BASE_URL,
              data,
              { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            const newAccessToken = response.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return client(originalRequest); // Retry the original request
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            // Optionally, you can log out the user if refresh fails
          }
        }
      }

      return Promise.reject(error); // Reject if not handled
    }
  );

  return client;
};

// Create API clients with original names
export const apiClient_leave = createApiClient(REST_API_BASE_URL_LEAVE);
export const apiClient_planning = createApiClient(REST_API_BASE_URL_PLANNING);
export const apiClient_recruitment = createApiClient(REST_API_BASE_URL_RECRUITMENT);
export const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
export const apiClient_auth = createApiClient(REST_API_BASE_URL_AUTH);
export const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);
export const apiClient_training = createApiClient(REST_API_BASE_URL_TRAINING);

export const apiClient_evaluation = createApiClient(REST_API_BASE_URL_EVALUATION);
export const apiClient_delegation = createApiClient(REST_API_BASE_URL_DELEGATION);
export const apiClient_document = createApiClient(REST_API_BASE_URL_DOCUMENT);


export const apiClient_transfer = createApiClient(REST_API_BASE_URL_TRANSFER);
export const apiClient_separation = createApiClient(REST_API_BASE_URL_SEPARATION);
export const apiClient_promotion = createApiClient(REST_API_BASE_URL_PROMOTION);

export const apiClient_complaint = createApiClient(REST_API_BASE_URL_COMPLAINT);
export const apiClient_discipline = createApiClient(REST_API_BASE_URL_DISCIPLINE);





export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_auth.get(url);
};

export const getTenantById = () => {
  const tenantId = localStorage.getItem("tenantId");
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


export const addUser = (tenantId,data, employeeId) => {
  return apiClient_auth.post(`users/${tenantId}/add`, data, {
    params: { employeeId },
  });
};

export const getAllRole = (tenantId) => {
  return apiClient_auth.get(`roles/${tenantId}/get-all`);
};

export const assignRoleForUser = (tenantId,data, userId, roleName) => {
  return apiClient_auth.put(
    `roles/${tenantId}/${userId}/assign-role/${roleName}`,
    data
  );
};

export const unAssignRoleForUser = (tenantId,userId, roleName) => {
  return apiClient_auth.delete(
    `roles/${tenantId}/${userId}/unassign-role/${roleName}`
  );
};

export const getAllUser = (tenantId) => {
  return apiClient_auth.get(`users/${tenantId}/get-all`);
};

export const getUserRoles = (tenantId,userId) => {
  return apiClient_auth.get(`users/${tenantId}/get/user-roles/${userId}`);
};

export const EnableUser = (tenantId,userId) => {
  return apiClient_auth.put(`users/${tenantId}/enable-user/${userId}`);
};

export const DisableUser = (tenantId,userId) => {
  return apiClient_auth.put(`users/${tenantId}/disable-user/${userId}`);
};

export const addDefaultRole = (tenantId) => {
  return apiClient_auth.post(`roles/${tenantId}/add/admin-and-default`);
};

export const addAdmin = (tenantId) => {
  return apiClient_auth.post(`users/${tenantId}/add/admin`);
};

export const addresourses = (tenantId) => {
  return apiClient_auth.post(`resources/${tenantId}/add`);
};

export const deleteresourses = (tenantId) => {
  return apiClient_auth.delete(`resources/${tenantId}/delete-all`);
};

export const getAllResourseWithTenant = (tenantId) => {
  return apiClient_auth.get(`resources/${tenantId}/get-all`);
};

export const getAllRoleWithTenant = (tenantId) => {
  return apiClient_auth.get(`roles/${tenantId}/get-all`);
};

export const getRoleByRoleName = (tenantId, roleName) => {
  return apiClient_auth.get(`roles/${tenantId}/get/${roleName}`);
};

export const getAllUserWithTenant = (tenantId) => {
  return apiClient_auth.get(`users/${tenantId}/get-all`);
};

export const changeResourseStatus = (data, tenantId, status) => {
  return apiClient_auth.put(`resources/${tenantId}/change-status`, data, {
    params: { status },
  });
};

export const resetPassWord = (tenantId,userId, data) => {
  return apiClient_auth.put(
    `users/${tenantId}/${userId}/reset-password`,
    data
  );
};

export const getUserByuseName = (tenantId,username) => {
  return apiClient_auth.get(`users/${tenantId}/get/username`, {
    params: { username },
  });
};


// Roles Management Endpoints
export const getAllRolesEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/roles`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addRoleEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/roles`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});



export const updateRoleEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/roles`,
  headers: {
    Authorization: `Bearer ${authToken}`, // Add Authorization header
  },
});



export const deleteRoleEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/roles`,
  headers: {
    Authorization: `Bearer ${authToken}`, // Add Authorization header
  },
});


export const getRoleUsersEndpoint = (authToken, roleId) => ({
  url: `${REST_API_BASE_URL_AUTH}/roles`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

// User Management Endpoints
export const getAllUsersEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/users`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addUserEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/users`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});


export const deleteUserEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/users`,
  headers: {
    Authorization: `Bearer ${authToken}`, // Add Authorization header
  },
});


export const updateEmailEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/users`,
  headers: {
    Authorization: `Bearer ${authToken}`, // Add Authorization header
  },
});

export const assignUserRoleEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/users`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const unassignUserRoleEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/roles`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});


// Resources Management Endpoints
export const getAllResourcesEndpoint = (authToken) => ({
  url: `${REST_API_BASE_URL_AUTH}/resources`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});




export const getAuthResourse = (tenantId) => {
  return apiClient_auth.get(`resources/${tenantId}/get-all`);
};

export const assignAuthResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_auth.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignAuthResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_auth.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};

export const getEmployeeResourse = (tenantId) => {
  return apiClient_employee.get(`resources/${tenantId}/get-all`);
};

export const assignEmployeeResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_employee.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignEmployeeResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_employee.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};

export const getOrganizationResourse = (tenantId) => {
  return apiClient_organization.get(`resources/${tenantId}/get-all`);
};

export const assignOrganizationResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_organization.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignOrganizationResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_organization.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};


export const getRecruitmentResourse = (tenantId) => {
  return apiClient_recruitment.get(`resources/${tenantId}/get-all`);
};

export const assignRecruitmentResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_recruitment.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignRecruitmentResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_recruitment.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};




export const getPlanningResourse = (tenantId) => {
  return apiClient_planning.get(`resources/${tenantId}/get-all`);
};

export const assignPlanningResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_planning.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignPlanningResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_planning.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};



export const getLeaveResourse = (tenantId) => {
  return apiClient_leave.get(`resources/${tenantId}/get-all`);
};

export const assignLeaveResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_leave.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignLeaveResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_leave.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};




export const getTrainingResourse = (tenantId) => {
  return apiClient_training.get(`resources/${tenantId}/get-all`);
};

export const assignTrainingResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_training.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignTrainingResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_training.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};


export const getEvaluationResourse = (tenantId) => {
  return apiClient_evaluation.get(`resources/${tenantId}/get-all`);
};

export const assignEvaluationResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_evaluation.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignEvaluationResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_evaluation.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};


export const getDelegationResourse = (tenantId) => {
  return apiClient_delegation.get(`resources/${tenantId}/get-all`);
};

export const assignDelegationResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_delegation.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignDelegationResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_delegation.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};



export const getDocumentResourse = (tenantId) => {
  return apiClient_document.get(`resources/${tenantId}/get-all`);
};

export const assignDocumentResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_document.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignDocumentResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_document.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};




export const getTransferResourse = (tenantId) => {
  return apiClient_transfer.get(`resources/${tenantId}/get-all`);
};

export const assignTransferResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_transfer.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignTransferResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_transfer.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};



export const getSeparationResourse = (tenantId) => {
  return apiClient_separation.get(`resources/${tenantId}/get-all`);
};

export const assignSeparationResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_separation.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignSeparationResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_separation.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};



export const getPromotionResourse = (tenantId) => {
  return apiClient_promotion.get(`resources/${tenantId}/get-all`);
};

export const assignPromotionResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_promotion.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignPromotionResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_promotion.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};




export const getDisciplineResourse = (tenantId) => {
  return apiClient_discipline.get(`resources/${tenantId}/get-all`);
};

export const assignDisciplineResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_discipline.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignDisciplineResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_discipline.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};


export const getComplaintResourse = (tenantId) => {
  return apiClient_complaint.get(`resources/${tenantId}/get-all`);
};

export const assignComplaintResourseForRole = (tenantId,resourceId,roleName, data) => {
  return apiClient_complaint.put(
    `resources/${tenantId}/role/grant-access/${resourceId}/${roleName}`,
    data
  );
};

export const UnassignComplaintResourseForRole = (tenantId,resourceId, roleName) => {
  return apiClient_complaint.delete(
    `resources/${tenantId}/role/revoke-access/${resourceId}/${roleName}`
  );
};









  















  












  












  










  















  















  












  












  










  








  
