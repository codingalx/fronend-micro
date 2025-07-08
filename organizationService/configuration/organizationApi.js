import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_AUTH = `${BASE_URL}/auth`;


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
const apiClient_auth = createApiClient(REST_API_BASE_URL_AUTH);


export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_organization.get(url);
};

export const addDepartmentWithParent = (tenantId,parentId,data) => {
  return apiClient_organization.post(`departments/${tenantId}/${parentId}/sub-departments`,data);
};

export const listOfdepartementType = (tenantId) => {
  return apiClient_organization.get(`department-types/${tenantId}/get-all`);
};

export const listDepartement = (tenantId) => {
  return apiClient_organization.get(`departments/${tenantId}/get-all`);
  };
  export const updateDepartement = (tenantId,departmentId,data) => {
    return apiClient_organization.put(`departments/${tenantId}/update/${departmentId}`,data);
  };
  export const deleteDepartement = (tenantId,departmentId) => {
    return apiClient_organization.delete(`departments/${tenantId}/${departmentId}`);
  };
  
  export const createDepartement = (tenantId,data) => {
    return apiClient_organization.put(`departments/${tenantId}/add-department`,data);
  };
  
  export const listLocation = (tenantId) => {
    return apiClient_organization.get(`locations/${tenantId}/get-all`);
  };

  export const createStructureChange = (tenantId,childDepartmentId,newParentDepartmentId,data) => {
    return  apiClient_organization.put(`departments/${tenantId}/${childDepartmentId}/parent/${newParentDepartmentId}`,data);
  };

  export const getDepartementById = (tenantId,departmentId) => {
    return apiClient_organization.get(`departments/${tenantId}/get/${departmentId}`);
  };



export const getTenantById = () => {
  const tenantId = localStorage.getItem('tenantId');
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};
//field of study
export const createFieldOfstudy = (tenantId,data) => {
  return apiClient_organization.post(`field-of-studies/${tenantId}/add`,data);
};
export const listFieldOfstudy = (tenantId) => {
  return apiClient_organization.get(`field-of-studies/${tenantId}/get-all`);
};
export const deleteFieldOfstudy = (tenantId,fieldStudId) => {
  return apiClient_organization.delete(`field-of-studies/${tenantId}/delete/${fieldStudId}`);
};

export const getFieldofstudyById = (tenantId,fieldStudId) => {
  return apiClient_organization.get(`field-of-studies/${tenantId}/get/${fieldStudId}`);
};
export const updateFieldofstudy = (tenantId,fieldStudId,data) => {
  return apiClient_organization.put(`field-of-studies/${tenantId}/update/${fieldStudId}`,data);
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

export const getRoleByRoleName = (tenantId,roleName) => {
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






const API_BASE_URL = import.meta.env.BACKEND_BASE_URL + '/api' || 'http://gateway.172.20.136.101.sslip.io/api';


// Axios client with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const data = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: 'saas-client',
            client_secret: 'APHalzvUVsfz9Jffe5ZAZ1XImFwv5a8K',
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

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);


export const jobGradeEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/job-grades`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllJobGradeEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/job-grades`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addJobGradesEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/job-grades`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const deleteJobGradesEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/job-grades`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

// Tenants

export const getImgTenantsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/tenants`,
  headers: {
    Authorization: `Bearer ${authToken}`, // Add Authorization header
  },
});

export const getAllTenantsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/tenants/get-all`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const deleteTenantsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/tenants/delete-tenant`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getTenantsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/tenants/get`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addTenantsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/tenants/add-tenant`,
  headers: {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "multipart/form-data",
  },
});

export const updateTenantsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/tenants/update-tenant`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});


// Departments
export const departmentEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/departments`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllDepartmentsEndpoint = (authToken, tenantsId) => ({
  url: `${API_BASE_URL}/departments/${tenantsId}/get-all`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getDepartmentsEndpoint = (authToken, tenantsId) => ({
  url: `${API_BASE_URL}/departments/${tenantsId}/get`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const deleteDepartmentsEndpoint = (authToken, tenantsId) => ({
  url: `${API_BASE_URL}/departments/${tenantsId}`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const updateDepartmentsEndpoint = (authToken, tenantsId) => ({
  url: `${API_BASE_URL}/departments/${tenantsId}/update`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addDepartmentsEndpoint = (authToken, tenantsId) => ({
  url: `${API_BASE_URL}/departments/${tenantsId}/add-department`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

// Department Types
export const departmentTypesEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/department-types`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllDepartmentTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/department-types/${tenantsId}/get-all`;

export const getDepartmentTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/department-types/${tenantsId}/get`;

export const deleteDepartmentTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/department-types/${tenantsId}/delete-departmentType`;

export const updateDepartmentTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/department-types/${tenantsId}/update-departmentType`;

export const addDepartmentTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/department-types/${tenantsId}/add-department-type`;

// Educational Levels
export const educationalLevelEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/education-levels`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addEducationalLevelsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/education-levels/${tenantsId}/add`;

export const getEducationalLevelsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/education-levels/${tenantsId}/get`;

export const getAllEducationalLevelsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/education-levels/${tenantsId}/get-all`;

export const updateEducationalLevelsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/education-levels/${tenantsId}/update`;

export const deleteEducationalLevelsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/education-levels/${tenantsId}/delete`;

// Job Categories
export const jobCategoriesEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/job-categories`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addJobCategoriesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-categories/${tenantsId}/add`;

export const getJobCategoriesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-categories/${tenantsId}/get`;

export const getAllJobCategoriesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-categories/${tenantsId}/get-all`;

export const updateJobCategoriesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-categories/${tenantsId}/update`;

export const deleteJobCategoriesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-categories/${tenantsId}/delete`;

// Work Units
export const workUnitEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/work-units`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllWorkUnitsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/work-units/${tenantsId}/get-all`;

export const getWorkUnitsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/work-units/${tenantsId}/get`;

export const deleteWorkUnitsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/work-units/${tenantsId}/delete`;

export const updateWorkUnitsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/work-units/${tenantsId}/update`;

export const addWorkUnitsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/work-units/${tenantsId}/add-work-unit`;

// Job Registrations
export const jobRegistrationsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/job-registrations`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const addJobRegistrationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-registrations/${tenantsId}/add-job`;

export const getAllJobRegistrationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-registrations/${tenantsId}/get-all`;

export const getJobRegistrationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-registrations/${tenantsId}/get`;

export const updateJobRegistrationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-registrations/${tenantsId}/update-job`;

export const deleteJobRegistrationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/job-registrations/${tenantsId}/delete-job`;

// Qualifications
export const qualificationEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/qualifications`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllQualificationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/qualifications/${tenantsId}/get-all`;

export const getQualificationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/qualifications/${tenantsId}/get`;

export const deleteQualificationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/qualifications/${tenantsId}/delete`;

export const updateQualificationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/qualifications/${tenantsId}/update`;

export const addQualificationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/qualifications/${tenantsId}/add`;

// Staff Plans
export const staffPlanEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/staff-plans`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllStaffPlansEndpoint = (tenantsId) =>
  `${API_BASE_URL}/staff-plans/${tenantsId}/get-all`;

export const getStaffPlansEndpoint = (tenantsId) =>
  `${API_BASE_URL}/staff-plans/${tenantsId}/get`;

export const deleteStaffPlanEndpoint = (tenantsId) =>
  `${API_BASE_URL}/staff-plans/${tenantsId}/delete-staff-plan`;

export const addStaffPlanEndpoint = (tenantsId) =>
  `${API_BASE_URL}/staff-plans/${tenantsId}/add-staff-plan`;

export const updateStaffPlanEndpoint = (tenantsId) =>
  `${API_BASE_URL}/staff-plans/${tenantsId}/update-staff-plan`;

export const getDepStaffPlanEndpoint = (tenantsId) =>
  `${API_BASE_URL}/staff-plans/${tenantsId}/departments`;

// Location Types
export const locationsTypeEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/location-types`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});




export const getAllLocationTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/Location-types/${tenantsId}/get-all`;

export const getLocationTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/Location-types/${tenantsId}/get`;

export const addLocationTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/Location-types/${tenantsId}/add-location-type`;

export const deleteLocationTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/Location-types/${tenantsId}/delete-locationType`;

export const updateLocationTypesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/Location-types/${tenantsId}/update-locationType`;

// Addresses
export const addressEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/addresses`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllAddressEndpoint = (tenantsId) =>
  `${API_BASE_URL}/addresses/${tenantsId}/get-all`;

export const getAddressEndpoint = (tenantsId) =>
  `${API_BASE_URL}/addresses/${tenantsId}/get`;

export const addAddressEndpoint = (tenantsId) =>
  `${API_BASE_URL}/addresses/${tenantsId}/add-address`;

export const deleteAddressEndpoint = (tenantsId) =>
  `${API_BASE_URL}/addresses/${tenantsId}/remove-address`;

export const updateAddressEndpoint = (tenantsId) =>
  `${API_BASE_URL}/addresses/${tenantsId}/edit-address`;

export const getDepAddressEndpoint = (tenantsId) =>
  `${API_BASE_URL}/addresses/${tenantsId}/departments`;

// Locations
export const locationsEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/locations`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllLocationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/locations/${tenantsId}/get-all`;

export const getLocationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/locations/${tenantsId}/get`;

export const addLocationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/locations/${tenantsId}/add-location`;

export const deleteLocationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/locations/${tenantsId}/delete-location`;

export const updateLocationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/locations/${tenantsId}/update-location`;

export const parentLocationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/locations/${tenantsId}/parent-location`;

export const addSubLocationsEndpoint = (tenantsId) =>
  `${API_BASE_URL}/locations/${tenantsId}`;

// Locations


// pay grades
export const payGradeEndpoint = (authToken) => ({
  url: `${API_BASE_URL}/organization/pay-grades`,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

export const getAllPayGradeEndpoint = (tenantsId) =>
  `${API_BASE_URL}/pay-grades/${tenantsId}/get-all`;
export const deletePayGradeEndpoint = (tenantsId) =>
  `${API_BASE_URL}/pay-grades/${tenantsId}/delete-pay-grade`;
export const addPayGradesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/pay-grades/${tenantsId}/add-pay-grade`;
export const getPayGradesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/pay-grades/${tenantsId}/get`;
export const updatePayGradesEndpoint = (tenantsId) =>
  `${API_BASE_URL}/pay-grades/${tenantsId}/update-pay-grade`;

