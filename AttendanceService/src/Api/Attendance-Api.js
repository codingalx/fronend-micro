import axios from 'axios';
const BASE_URL = 'http://gateway.172.20.136.101.sslip.io/api';
export const REST_API_BASE_URL_ATTENDANCE = `${BASE_URL}/attendance`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;

const KEYCLOAK_BASE_URL = import.meta.env.KEYCLOAK_BASE_URL + "/realms/" + import.meta.env.KEYCLOAK_REALM + "/protocol/openid-connect/token" + "/realms/" + import.meta.env.KEYCLOAK_REALM + "/protocol/openid-connect/token" || 'http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token';

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
const apiClient_attendance = createApiClient(REST_API_BASE_URL_ATTENDANCE);






  
export const createShifts = async (data) => {
    const url = `shifts/add`;
    return apiClient_attendance.post(url, data);
  };


  export const updateShift = async (shiftId,data) => {
    const url = `shifts/update/${shiftId}`;
    return apiClient_attendance.put(url, data);
  };
  
  export const getAllshift = async () => {
    const url = `shifts/get-all`;
    return apiClient_attendance.get(url);
  };

  export const getShiftById = async (shiftId) => {
    const url = `shifts/get/${shiftId}`;
    return apiClient_attendance.get(url);
  };
  export const deleteShift = async (shiftId) => {
    const url = `shifts/delete/${shiftId}`;
    return apiClient_attendance.delete(url);
  };

  export const createWeeknds = async (data) => {
    const url = `weekends/add`;
    return apiClient_attendance.post(url,data);
  };
  export const getWeekendByShiftId = async (shiftId) => {
    const url = `weekends/get-all/${shiftId}`;
    return apiClient_attendance.get(url);
  };
  ///weekends/get-all/2097b363-98a6-4776-97fa-6b236ddb817c
  export const updateWeekend = async (wekId, data) => {
    const url = `weekends/update/${wekId}`;
    return apiClient_attendance.put(url, data);
  };
  export const deleteWeekend = async (wekId) => {
    const url = `weekends/delete/${wekId}`;
    return apiClient_attendance.delete(url);
  };
  ///api/attendance/weekends/delete/{weekendId}
  

// /api/attendance/weekends/update/{weekendId}
export const createOverTime = async (data) => {
  const url = `overtimes/add`;
  return apiClient_attendance.post(url, data);
};



export const getOverTime = async () => {
  const url = `overtimes/get-all`;
  return apiClient_attendance.get(url);
};

export const getOverTimeById = async (overtimeId) => {
  const url = `overtimes/get/${overtimeId}`;
  return apiClient_attendance.get(url);
};
export const updateOverTime = async (overtimeId,data) => {
  const url = `overtimes/update/${overtimeId}`;
  return apiClient_attendance.put(url,data);
};
export const deleteOverTime = async (overtimeId) => {
  const url = `overtimes/delete/${overtimeId}`;
  return apiClient_attendance.delete(url);
};

export const createTimeTolerance = async (data) => {
  const url = `time-tolerances/add`;
  return apiClient_attendance.post(url, data);
}

export const getAllTimeTolerances = async () => {
  const url = `time-tolerances/get-all`;
  return apiClient_attendance.get(url);
};

export const getTimeTolernaceByShiftId = async (shiftId) => {
  const url = `time-tolerances/get/${shiftId}`;
  return apiClient_attendance.get(url);
};

export const deleteTimeTolerance = async (toleranceId) => {
  const url = `time-tolerances/delete/${toleranceId}`;
  return apiClient_attendance.delete(url);
}
export const updateTimeTolerance = async (toleranceId,data) => {
  const url = `time-tolerances/update/${toleranceId}`;
  return apiClient_attendance.put(url,data);
}
export const getTimeToleranceById = async (toleranceId) => {
  const url = `time-tolerances/get/${toleranceId}`;
  return apiClient_attendance.get(url);


}
export const createExcuseType = async (data) => {
  const url = `excuse-types/add`;
  return apiClient_attendance.post(url,data);
}
export const getAllExcuse = async () => {
  const url = `excuse-types/get-all`;
  return apiClient_attendance.get(url);
}
export const getExcuseById = async (ExcuseId) => {
  const url = `excuse-types/get/${ExcuseId}`;
  return apiClient_attendance.get(url);
}
export const updateExcuse = async (ExcuseId,data) => {
  const url = `excuse-types/update/${ExcuseId}`;
  return apiClient_attendance.put(url,data);
}
export const deleteExcuse = async (ExcuseId) => {
  const url = `excuse-types/delete/${ExcuseId}`;
  return apiClient_attendance.delete(url);
}

export const createAttendanceLog = async (data) => {
  const url = `attendance-logs/add`;
  return apiClient_attendance.post(url,data);
}
export const createAttendanceResult = async (startDate, endDate) => {
  const url = `attendance-results/add?startDate=${startDate}&endDate=${endDate}`;
  return apiClient_attendance.post(url);
};
export const hrApproval = async (resultId,payLoad) => {
  const url = `attendance-results/hr-approve/${resultId}`;
  return apiClient_attendance.patch(url,payLoad);
};
export const getAttendanceByStatus = async (status) => {
  const url = `attendance-results/get/department-decision?departmentDecision=${status}`;
  return apiClient_attendance.get(url);
};
export const getAttendanceByStatusHr = async (status) => {
  const url = `attendance-results/get/hr-decision?hrDecision=${status}`;
  return apiClient_attendance.get(url);
};



export const departemntApprove = (resultId, payload) => {
  const formData = new FormData();
  
  // Add request as a JSON string
  formData.append('request', new Blob([JSON.stringify(payload.request)], {
    type: 'application/json'
  }));
  
  // Add file if it exists
  if (payload.file) {
    formData.append('file', payload.file);
  }

  return apiClient_attendance.patch(
    `attendance-results/department-approve/${resultId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',  
      },
    }
  );
};

export const getLongId = (tenantId, employeeId) => {
  const url = `employees/${tenantId}/get?employee-id=${employeeId}`;
  return apiClient_employee.get(url);
};

export const getEmployeeByEmployeId = (tenantId, employeeId) => {
  const url = `employees/${tenantId}/get/${employeeId}`;
  return apiClient_employee.get(url);
};
export const getFile = (resultId) => {
  const url = `attendance-results/get-file/${resultId}`;
  return apiClient_attendance.get(url, { responseType: 'blob' }); // important!
};
export const getResultForEmployee = (employeeId) => {
  const url = `attendance-results/get/employee/${employeeId}`;
  return apiClient_attendance.get(url);
};
export const getEmployeeName = (tenantId, firstName, middleName, lastName) => {
  const queryParams = new URLSearchParams({
    'first-name': firstName,
    'middle-name': middleName,
    'last-name': lastName
  }).toString();

  const url = `employees/${tenantId}/get-employee?${queryParams}`;
  return apiClient_employee.get(url);
};


////api/employee/employees/{tenant-id}/get-employee






