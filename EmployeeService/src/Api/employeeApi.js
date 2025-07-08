
import axios from 'axios';
const BASE_URL = (import.meta.env.BACKEND_BASE_URL ? 
    `${import.meta.env.BACKEND_BASE_URL}/api` : 
    'http://gateway.172.20.136.101.sslip.io/api');
const KEYCLOAK_BASE_URL = (import.meta.env.KEYCLOAK_BASE_URL ? 
    `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${import.meta.env.KEYCLOAK_REALM}/protocol/openid-connect/token` :
    'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token');

export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_ATTENDANCE = `${BASE_URL}/attendance`;


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
const apiClient_atendance = createApiClient(REST_API_BASE_URL_ATTENDANCE);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);



export const listAllShifts = () => {
  return apiClient_atendance.get(`shifts/get-all`);
};
  
  
export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem('tenantId');
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_employee.get(url);
};

export const getTenantById = () => {
  const tenantId = localStorage.getItem('tenantId');
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};

// paygrade apis
export const listPayGrade = (tenantId) => {
  return apiClient_organization.get(`pay-grades/${tenantId}/get-all`);
};



export const getAllPaygradeByJobId = (tenantId,jobGradeId) => {
  return apiClient_organization.get(`pay-grades/${tenantId}/jobgrade/${jobGradeId}`);
};

export const getJoblistByDepartementId = (tenantId,departmentId) => {
  return apiClient_organization.get(`job-registrations/${tenantId}/jobs/${departmentId}`);
};
export const listDepartement = (tenantId) => {
  return apiClient_organization.get(`departments/${tenantId}/get-all`);
  };
  export const getDepartementById = (tenantId,departmentId) => {
    return apiClient_organization.get(`departments/${tenantId}/get/${departmentId}`);
  };


  export const listJobRegestration = (tenantId) => {
    return apiClient_organization.get(`job-registrations/${tenantId}/get-all`);
  };

  export const listLocation = (tenantId) => {
    return apiClient_organization.get(`locations/${tenantId}/get-all`);
  };

  export const listEducationLevels = (tenantId) => {
    return apiClient_organization.get(`education-levels/${tenantId}/get-all`);
  };
  
  export const listFieldStudies = (tenantId) => {
    return apiClient_organization.get(`field-of-studies/${tenantId}/get-all`);
  };
  



export const listAllCountry = (tenantId) => {
  return  apiClient_employee.get(`countries/${tenantId}/get-all`);
};


  export const createCountry = (tenantId,data) => {
    const url = `countries/${tenantId}/add`;
    return  apiClient_employee.post(url, data);
  };
  


  export const deleteCountry = (tenantId,countryId) => {
    const url = `countries/${tenantId}/delete/${countryId}`;
    return  apiClient_employee.delete(url);
  };

  export const getCountryById = (tenantId,countryId) => {
    const url = `countries/${tenantId}/get/${countryId}`;
    return  apiClient_employee.get(url);
  };
  
  
  export const updateCountry = (tenantId, countryId, data) => {
    const url = `countries/${tenantId}/update/${countryId}`;
    return  apiClient_employee.put(url, data);
  };

  
  //duty station apis
  export const createDutyStation = (tenantId,data) => {
    const url = `duty-stations/${tenantId}/add`;
    return  apiClient_employee.post(url, data);
  };

  export const listDutyStation = (tenantId) => {
    const url = `duty-stations/${tenantId}/get-all`;
    return  apiClient_employee.get(url);
  };

  export const deleteDutyStation = (tenantId,dutyStationId) => {
    const url = `duty-stations/${tenantId}/delete/${dutyStationId}`;
    return  apiClient_employee.delete(url);
  };

  export const getDutyStationById = (tenantId,dutyStationId) => {
    const url = `duty-stations/${tenantId}/get/${dutyStationId}`;
    return  apiClient_employee.get(url);
  };
  
  
  export const updateDutyStation = (tenantId,dutyStationId, data) => {
    const url = `duty-stations/${tenantId}/update/${dutyStationId}`;
    return  apiClient_employee.put(url, data);
  };



   export const createTitleName = (tenantId,data) => {
    const url = `title-names/${tenantId}/add`;
    return  apiClient_employee.post(url, data);
  };
  export const listTitleName = (tenantId) => {
    const url = `title-names/${tenantId}/get-all`;
    return  apiClient_employee.get(url);
  };

  export const deleteTitleName = (tenantId,titleNameId) => {
    const url = `title-names/${tenantId}/delete/${titleNameId}`;
    return  apiClient_employee.delete(url);
  };



  export const getTitleNameById = (tenantId,titleNameId) => {
    const url = `title-names/${tenantId}/get/${titleNameId}`;
    return  apiClient_employee.get(url);
  };
  
  
  export const updateTitleName = (tenantId,titleNameId, data) => {
    const url = `title-names/${tenantId}/update/${titleNameId}`;
    return  apiClient_employee.put(url, data);
  };



  
  //language names apis
  export const createLanguageName = (tenantId,data) => {
    const url = `language-names/${tenantId}/add`;
    return apiClient_employee.post(url, data);
  };
  export const listLanguageName = (tenantId) => {
    const url = `language-names/${tenantId}/get-all`;
    return apiClient_employee.get(url);
  };

  export const deleteLanguageName = (tenantId,languageNameId) => {
    const url = `language-names/${tenantId}/delete/${languageNameId}`;
    return apiClient_employee.delete(url);
  };



  export const getLanguageNameById = (tenantId,languageNameId) => {
    const url = `language-names/${tenantId}/get/${languageNameId}`;
    return apiClient_employee.get(url);
  };
  
  
  export const updateLanguageName = (tenantId,languageNameId, data) => {
    const url = `language-names//${tenantId}/update/${languageNameId}`;
    return apiClient_employee.put(url, data);
  };

  export const listEmployee = (tenantId) => {
  const url = `employees/${tenantId}/get-all`;
  return apiClient_employee.get(url);
  };

  export const createEmployee = (tenantId,formData) => {
    const url = `employees/${tenantId}/add`;
    return apiClient_employee.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
  };

  export const deleteEmployee = (tenantId,employeeId) => {
    const url = `employees/${tenantId}/delete/${employeeId}`;
    return apiClient_employee.delete(url);
  };

  export const getEmployeeImageById = async (tenantId,id) => {
    const url = `employees/${tenantId}/download-image/${id}`;
        const response = await apiClient_employee.get(url, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  };

  export const updateEmployee = (tenantId,employeeId,formData) => {
    const url = `employees/${tenantId}/update/${employeeId}`;
    return apiClient_employee.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
  };

  export const getEmployeeById = (tenantId,id) => {
    const url = `employees/${tenantId}/get/${id}`;
    return apiClient_employee.get(url);
  };

  export const getEmployeeByEmployeId = (tenantId,employeeId) => {
    const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
    return  apiClient_employee.get(url);
  };


  
// Address APIs
export const createAddress = (tenantId,id, address) => {
  const url = `addresses/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, address);
};

export const listAddress = (tenantId,employeeId) => {
  const url = `addresses/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteAddress = (tenantId,employeeId, addressId) => {
  const url = `addresses/${tenantId}/${employeeId}/delete/${addressId}`;
  return apiClient_employee.delete(url);
};

export const getAddressById = (tenantId,id, addressId) => {
  const url = `addresses/${tenantId}/${id}/get/${addressId}`;
  return apiClient_employee.get(url);
};

export const updateAddress = (tenantId,id, addressId, data) => {
  const url = `addresses/${tenantId}/${id}/update/${addressId}`;
  return apiClient_employee.put(url, data);
};


// Education APIs
export const createEducation = (tenantId,id, education) => {
  const url = `educations/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, education, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateEducation = (tenantId,id, educationId, data) => {
  const url = `educations/${tenantId}/${id}/update/${educationId}`;
  return apiClient_employee.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const listOfEducation = (tenantId,employeeId) => {
  const url = `educations/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteEducation = (tenantId,employeeId, educationId) => {
  const url = `educations/${tenantId}/${employeeId}/delete/${educationId}`;
  return apiClient_employee.delete(url);
};
export const getEducationById = (tenantId,id, educationId) => {
  const url = `educations/${tenantId}/${id}/get/${educationId}`;
  return apiClient_employee.get(url);
};
export const getEducationFileById = async (tenantId,employerId, educationId) => {
  const url = `educations/${tenantId}/${employerId}/download-document/${educationId}`;
  
  // Fetch the file as binary data (blob)
  const response = await apiClient_employee.get(url, { responseType: 'blob' });

  return response.data; 
};



export const createSkill = (tenantId,id, skill) => {
  const url = `skills/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, skill);
};

export const listSkills = (tenantId,employeeId) => {
  const url = `skills/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteSkill = (tenantId,employeeId, skillId) => {
  const url = `skills/${tenantId}/${employeeId}/delete/${skillId}`;
  return apiClient_employee.delete(url);
};

export const getSkillById = (tenantId,id, skillId) => {
  const url = `skills/${tenantId}/${id}/get/${skillId}`;
  return apiClient_employee.get(url);
};

export const updateSkill = (tenantId,id, skillId, data) => {
  const url = `skills/${tenantId}/${id}/update/${skillId}`;
  return apiClient_employee.put(url, data);
};


// Language APIs
export const createLanguage = (tenantId,id, language) => {
  const url = `languages/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, language);
};

export const listLanguage = (tenantId,employeeId) => {
  const url = `languages/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteLanguage = (tenantId,employeeId, languageId) => {
  const url = `languages/${tenantId}/${employeeId}/delete/${languageId}`;
  return apiClient_employee.delete(url);
};

export const getLanguageById = (tenantId,id, languageId) => {
  const url = `languages/${tenantId}/${id}/get/${languageId}`;
  return apiClient_employee.get(url);
};

export const updateLanguage = (tenantId,id, languageId, data) => {
  const url = `languages/${tenantId}/${id}/update/${languageId}`;
  return apiClient_employee.put(url, data);
};



// Reference APIs
export const createReference = (tenantId,id, reference) => {
  const url = `references/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, reference);
};

export const listOfReference = (tenantId,employeeId) => {
  const url = `references/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteReference = (tenantId,employeeId, referenceId) => {
  const url = `references/${tenantId}/${employeeId}/delete/${referenceId}`;
  return apiClient_employee.delete(url);
};

export const getReferenceById = (tenantId,id, referenceId) => {
  const url = `references/${tenantId}/${id}/get/${referenceId}`;
  return apiClient_employee.get(url);
};

export const updateReference = (tenantId,id, referenceId, data) => {
  const url = `references/${tenantId}/${id}/update/${referenceId}`;
  return apiClient_employee.put(url, data);
};



// Training APIs
export const createTrainings = (tenantId,id, formData) => {
  const url = `trainings/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateTrainings = (tenantId,id, trainingId, data) => {
  const url = `trainings/${tenantId}/${id}/update/${trainingId}`;
  return apiClient_employee.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const listTrainings = (tenantId,employeeId) => {
  const url = `trainings/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteTrainings = (tenantId,employeeId, trainingId) => {
  const url = `trainings/${tenantId}/${employeeId}/delete/${trainingId}`;
  return apiClient_employee.delete(url);
};

export const getTrainingsById = (tenantId,id, trainingId) => {
  const url = `trainings/${tenantId}/${id}/get/${trainingId}`;
  return apiClient_employee.get(url);
};


export const getTrainingsFileById = async (tenantId,employerId, trainingId) => {
  const url = `trainings/${tenantId}/${employerId}/download-certificate/${trainingId}`;
    const response = await apiClient_employee.get(url, { responseType: 'blob' });
  return response.data; 
};


// Family APIs
export const createFamily = (tenantId,id, family) => {
  const url = `families/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, family);
};

export const listFamily = (tenantId,employeeId) => {
  const url = `families/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteFamily = (tenantId,employeeId, familyId) => {
  const url = `families/${tenantId}/${employeeId}/delete/${familyId}`;
  return apiClient_employee.delete(url);
};

export const getFamilyById = (tenantId,id, familyId) => {
  const url = `families/${tenantId}/${id}/get/${familyId}`;
  return apiClient_employee.get(url);
};

export const updateFamily = (tenantId,id, familyId, data) => {
  const url = `families/${tenantId}/${id}/update/${familyId}`;
  return apiClient_employee.put(url, data);
};



// Experience APIs
export const createExperience = (tenantId,id, experience) => {
  const url = `experiences/${tenantId}/${id}/add`;
  return apiClient_employee.post(url, experience, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const updateExperience = (tenantId,id, experienceId,data) => {
  const url = `experiences/${tenantId}/${id}/update/${experienceId}`;
  return apiClient_employee.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};



export const getExperienceFileById = async (tenantId,employerId, experienceId) => {
  const url = `experiences/${tenantId}/${employerId}/download-document/${experienceId}`;
  const response = await apiClient_employee.get(url, { responseType: 'blob' });
  return response.data; 
};

export const listExperience = (tenantId,employeeId) => {
  const url = `experiences/${tenantId}/${employeeId}/get-all`;
  return apiClient_employee.get(url);
};

export const deleteExperience = (tenantId,employeeId, experienceId) => {
  const url = `experiences/${tenantId}/${employeeId}/delete/${experienceId}`;
  return apiClient_employee.delete(url);
};

export const getExperienceById = (tenantId,id, experienceId) => {
  const url = `experiences/${tenantId}/${id}/get/${experienceId}`;
  return apiClient_employee.get(url);
};

















