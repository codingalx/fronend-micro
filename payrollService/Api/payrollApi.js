import axios from "axios";
const BASE_URL = import.meta.env.BACKEND_BASE_URL
  ? `${import.meta.env.BACKEND_BASE_URL}/api`
  : "http://gateway.172.20.136.101.sslip.io/api";
const KEYCLOAK_BASE_URL = import.meta.env.KEYCLOAK_BASE_URL
  ? `${import.meta.env.KEYCLOAK_BASE_URL}/realms/${
      import.meta.env.KEYCLOAK_REALM
    }/protocol/openid-connect/token`
  : "http://keycloak.172.20.136.101.sslip.io/realms/saas-erp/protocol/openid-connect/token";

export const REST_API_BASE_URL_PAYROLL = `${BASE_URL}/payroll`;
export const REST_API_BASE_URL_LEAVE = `${BASE_URL}/leave`;
export const REST_API_BASE_URL_EMPLOYEE = `${BASE_URL}/employee`;
export const REST_API_BASE_URL_ORGANIZATION = `${BASE_URL}/organization`;

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

const apiClient_payroll = createApiClient(REST_API_BASE_URL_PAYROLL);
const apiClient_leave = createApiClient(REST_API_BASE_URL_LEAVE);
const apiClient_organization = createApiClient(REST_API_BASE_URL_ORGANIZATION);
const apiClient_employee = createApiClient(REST_API_BASE_URL_EMPLOYEE);

export const getResourceByName = (resourceName) => {
  const tenantId = localStorage.getItem("tenantId");
  const url = `resources/${tenantId}/get/resource-name?resourceName=${resourceName}`;
  return apiClient_payroll.get(url);
};

export const getTenantById = () => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) {
    return Promise.resolve(null);
  }
  const url = `tenants/get/${tenantId}`;
  return apiClient_organization.get(url);
};

export const getAllBudgetYear = (tenantId) => {
  const url = `budget-years/${tenantId}/get-all`;
  return apiClient_leave.get(url);
};

export const createTaxRate = (data) => {
  const url = `tax-rates/add`;
  return apiClient_payroll.post(url, data);
};

export const getTaxRateById = (taxRateId) => {
  const url = `tax-rates/get/${taxRateId}`;
  return apiClient_payroll.get(url);
};

export const getAllTaxRate = () => {
  const url = `tax-rates/get-all`;
  return apiClient_payroll.get(url);
};

export const deleteTaxRate = (taxRateId) => {
  const url = `tax-rates/delete/${taxRateId}`;
  return apiClient_payroll.delete(url);
};

export const updateTaxRate = (taxRateId, data) => {
  const url = `tax-rates/update/${taxRateId}`;
  return apiClient_payroll.put(url, data);
};

export const createPayrollGroup = (data) => {
  const url = `payroll-groups/add`;
  return apiClient_payroll.post(url, data);
};

export const getPayrollGroupById = (payrollGroupId) => {
  const url = `payroll-groups/get/${payrollGroupId}`;
  return apiClient_payroll.get(url);
};

export const getAllPayrollGroup = () => {
  const url = `payroll-groups/get-all`;
  return apiClient_payroll.get(url);
};

export const deletePayrollGroup = (payrollGroupId) => {
  const url = `payroll-groups/delete/${payrollGroupId}`;
  return apiClient_payroll.delete(url);
};

export const updatePayrollGroup = (payrollGroupId, data) => {
  const url = `payroll-groups/update/${payrollGroupId}`;
  return apiClient_payroll.put(url, data);
};

export const createPensionRates = (data) => {
  const url = `pension-rates/add`;
  return apiClient_payroll.post(url, data);
};

export const getPensionRatesById = (Id) => {
  const url = `pension-rates/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllPensionRates = () => {
  const url = `pension-rates/get-all`;
  return apiClient_payroll.get(url);
};

export const deletePensionRates = (Id) => {
  const url = `pension-rates/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatePensionRates = (Id, data) => {
  const url = `pension-rates/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createPayrollPeriod = (data) => {
  const url = `payroll-periods/add`;
  return apiClient_payroll.post(url, data);
};

export const getPayrollPeriodById = (Id) => {
  const url = `payroll-periods/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllPayrollPeriod = () => {
  const url = `payroll-periods/get-all`;
  return apiClient_payroll.get(url);
};

export const deletePayrollPeriod = (Id) => {
  const url = `payroll-periods/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatePayrollPeriod = (Id, data) => {
  const url = `payroll-periods/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createpayLocationGroup = (data) => {
  const url = `pay-location-groups/add`;
  return apiClient_payroll.post(url, data);
};

export const getpayLocationGroupById = (Id) => {
  const url = `pay-location-groups/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllpayLocationGroup = () => {
  const url = `pay-location-groups/get-all`;
  return apiClient_payroll.get(url);
};

export const deletepayLocationGroup = (Id) => {
  const url = `pay-location-groups/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatepayLocationGroup = (Id, data) => {
  const url = `pay-location-groups/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createLeaveAdvacementPayment = (data) => {
  const url = `leave-advance-payments/add`;
  return apiClient_payroll.post(url, data);
};

export const getpayLeaveAdvacementPaymentById = (Id) => {
  const url = `leave-advance-payments/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllpayLeaveAdvacementPayment = () => {
  const url = `leave-advance-payments/get-all`;
  return apiClient_payroll.get(url);
};

export const deletepayLeaveAdvacementPayment = (Id) => {
  const url = `leave-advance-payments/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatepaLeaveAdvacementPayment = (Id, data) => {
  const url = `leave-advance-payments/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createMortgageInfos = (data) => {
  const url = `mortgage-infos/add`;
  return apiClient_payroll.post(url, data);
};

export const getMortgageInfosById = (Id) => {
  const url = `mortgage-infos/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllpayMortgageInfos = () => {
  const url = `mortgage-infos/get-all`;
  return apiClient_payroll.get(url);
};

export const deletepayMortgageInfos = (Id) => {
  const url = `mortgage-infos/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatepaMortgageInfos = (Id, data) => {
  const url = `mortgage-infos/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createBackPaymentGroup = (data) => {
  const url = `back-payment-groups/add`;
  return apiClient_payroll.post(url, data);
};

export const getBackPaymentGroupById = (Id) => {
  const url = `back-payment-groups/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllpayBackPaymentGroup = () => {
  const url = `back-payment-groups/get-all`;
  return apiClient_payroll.get(url);
};

export const deletepayBackPaymentGroup = (Id) => {
  const url = `back-payment-groups/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatepeBackPaymentGroup = (Id, data) => {
  const url = `back-payment-groups/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createDepartementPayLocationGroup = (data) => {
  const url = `department-pay-location-groups/add`;
  return apiClient_payroll.post(url, data);
};

export const getDepartementPayLocationGroupById = (Id) => {
  const url = `department-pay-location-groups/get/${Id}`;
  return apiClient_payroll.get(url);
};


export const getAllDepartementPayLocationGroup = () => {
  const url = `department-pay-location-groups/get-all`;
  return apiClient_payroll.get(url);
};


export const deleteDepartementPayLocationGroup = (Id) => {
  const url = `department-pay-location-groups/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatepeDepartementPayLocationGroup = (Id, data) => {
  const url = `department-pay-location-groups/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createDeductionSetUp = (data) => {
  const url = `earning-deduction-setups/add`;
  return apiClient_payroll.post(url, data);
};
export const getDeductionSetUpById = (Id) => {
  const url = `earning-deduction-setups/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllDeductionSetUp = () => {
  const url = `earning-deduction-setups/get-all`;
  return apiClient_payroll.get(url);
};

export const deleteDeductionSetUp = (Id) => {
  const url = `earning-deduction-setups/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updatepeDeductionSetUp = (Id, data) => {
  const url = `earning-deduction-setups/update/${Id}`;
  return apiClient_payroll.put(url, data);
};

export const createEmployeeEarningDeduction = (data) => {
  const url = `employee-earning-deductions/add`;
  return apiClient_payroll.post(url, data);
};

export const getEmployeeEarningDeductionsById = (Id) => {
  const url = `employee-earning-deductions/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllpayEmployeeEarningDeduction = () => {
  const url = `employee-earning-deductions/get-all`;
  return apiClient_payroll.get(url);
};

export const deleteEmployeeEarningDeduction = (Id) => {
  const url = `employee-earning-deductions/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updateEmployeeEarningDeduction = (Id, data) => {
  const url = `employee-earning-deductions/update/${Id}`;
  return apiClient_payroll.put(url, data);
};






export const listEmployee = (tenantId) => {
  const url = `employees/${tenantId}/get-all`;
  return apiClient_employee.get(url);
};
  export const getEmployeeById = (tenantId,id) => {
    const url = `employees/${tenantId}/get/${id}`;
    return apiClient_employee.get(url);
  };
export const listDepartement = (tenantId) => {
  return apiClient_organization.get(`departments/${tenantId}/get-all`);
};

export const getDepartementById = (tenantId, id) => {
  return apiClient_organization.get(`departments/${tenantId}/get/${id}`);
};




export const createCourtCase = (data) => {
  const url = `court-cases/add`;
  return apiClient_payroll.post(url, data);
};
export const getCourtCaseById = (Id) => {
  const url = `court-cases/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllCourtCase = () => {
  const url = `court-cases/get-all`;
  return apiClient_payroll.get(url);
};

export const deleteCourtCase = (Id) => {
  const url = `court-cases/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updateCourtCase = (Id, data) => {
  const url = `court-cases/update/${Id}`;
  return apiClient_payroll.put(url, data);
};





export const createAllEmployeeEarningDeduction = (data) => {
  const url = `all-employee-earning-deductions/add`;
  return apiClient_payroll.post(url, data);
};

export const getAllEmployeeEarningDeductionsById = (Id) => {
  const url = `all-employee-earning-deductions/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllEmployeeEarningDeduction = () => {
  const url = `all-employee-earning-deductions/get-all`;
  return apiClient_payroll.get(url);
};

export const deleteAllEmployeeEarningDeduction = (Id) => {
  const url = `all-employee-earning-deductions/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updateAllEmployeeEarningDeduction = (Id, data) => {
  const url = `all-employee-earning-deductions/update/${Id}`;
  return apiClient_payroll.put(url, data);
};


export const createFamilyDetails = (data) => {
  const url = `family-details/add`;
  return apiClient_payroll.post(url, data);
};

export const getFamilyDetailsById = (Id) => {
  const url = `family-details/get/${Id}`;
  return apiClient_payroll.get(url);
};

export const getAllFamilyDetails = () => {
  const url = `family-details/get-all`;
  return apiClient_payroll.get(url);
};

export const deleteAllFamilyDetails = (Id) => {
  const url = `family-details/delete/${Id}`;
  return apiClient_payroll.delete(url);
};

export const updateFamilyDetails = (Id, data) => {
  const url = `family-details/update/${Id}`;
  return apiClient_payroll.put(url, data);
};



