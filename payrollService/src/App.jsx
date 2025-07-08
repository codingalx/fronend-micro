import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLogin from "./components/AppLogin";
import CreateTaxRate from "./components/taxRate/CreateTaxRate";
import CreatePayrollGroup from "./components/PayrollGroup/CreatePayrollGroup";
import DeletePayrollGroup from "./components/PayrollGroup/DeletePayrollGroup";
import UpdatePayrollGroup from "./components/PayrollGroup/UpdatePayrollGroup";

import DeleteTaxRate from "./components/taxRate/DeleteTaxRate";
import UpdateTaxRate from "./components/taxRate/UpdateTaxRate";
import CreatePensionRate from "./components/PensionRate/CreatePensionRate";
import DeletePensionRate from "./components/PensionRate/DeletePensionRate";
import UpdatePensionRate from "./components/PensionRate/UpdatePensionRate";
import CreatePayrollPeriod from "./components/PayrollPeriod/CreatePayrollPeriod";
import DeletePayrollPeriod from "./components/PayrollPeriod/DeletePayrollPeriod";
import UpdatePayrollPeriod from "./components/PayrollPeriod/UpdatePayrollPeriod";
import CreatePayLocationAndGroup from "./components/PayLocationAndGroup/CreatePayLocationAndGroup";
import DeletePayLocationAndGroup from "./components/PayLocationAndGroup/DeletePayLocationAndGroup";
import UpdatePayLocationAndGroup from "./components/PayLocationAndGroup/UpdatePayLocationAndGroup";
import CreateLeaveAdvancePayment from "./components/LeaveAdvancePayment/CreateLeaveAdvancePayment";
import DeleteLeaveAdvancePayment from "./components/LeaveAdvancePayment/DeleteLeaveAdvancePayment";
import UpdateLeaveAdvancePayment from "./components/LeaveAdvancePayment/UpdateLeaveAdvancePayment";
import CreateMortgageInfo from "./components/MortgageInfo/CreateMortgageInfo";
import CreateBackPaymentGroup from "./components/BackPaymentGroup/CreateBackPaymentGroup";
import DeleteBackPaymentGroup from "./components/BackPaymentGroup/DeleteBackPaymentGroup";
import UpdateBackPaymentGroup from "./components/BackPaymentGroup/UpdateBackPaymentGroup";
import CreateDepartmentPayLocationAndGroup from "./components/DepartmentPayLocationAndGroup/CreateDepartmentPayLocationAndGroup";
import DeleteDepartmentPayLocationAndGroup from "./components/DepartmentPayLocationAndGroup/DeleteDepartmentPayLocationAndGroup";
import CreateEarningDeductionSetup from "./components/EarningDeductionSetup/CreateEarningDeductionSetup";
import DeleteEarningDeductionSetup from "./components/EarningDeductionSetup/DeleteEarningDeductionSetup";
import UpdateEarningDeductionSetup from "./components/EarningDeductionSetup/UpdateEarningDeductionSetup";
import CreateEmployeeEarningDeduction from "./components/EmployeeEarningDeduction/CreateEmployeeEarningDeduction";
import DeleteEmployeeEarningDeduction from "./components/EmployeeEarningDeduction/DeleteEmployeeEarningDeduction";
import UpdateEmployeeEarningDeduction from "./components/EmployeeEarningDeduction/UpdateEmployeeEarningDeduction";
import CreateCourtCase from "./components/CourtCase/CreateCourtCase";
import CreateAllEmployeeEarningDeduction from "./components/AllEmployeeEarningDeduction/CreateAllEmployeeEarningDeduction";
import DeleteAllEmployeeEarningDeduction from "./components/AllEmployeeEarningDeduction/DeleteAllEmployeeEarningDeduction";
import UpdateAllEmployeeEarningDeduction from "./components/AllEmployeeEarningDeduction/UpdateAllEmployeeEarningDeduction";

function App() {
  return (
    <Router>
      <Routes>
   

        <Route path="/login" element={<AppLogin />} />

        <Route path="/payroll/create_tax_rate" element={<CreateTaxRate />} />
        <Route path="/payroll/delete_tax_rate" element={<DeleteTaxRate />} />
        <Route path="/payroll/update_tax_rate" element={<UpdateTaxRate />} />

        <Route
          path="/payroll/create_payroll_group"
          element={<CreatePayrollGroup />}
        />

        <Route
          path="/payroll/delete_payroll_group"
          element={<DeletePayrollGroup />}
        />

        <Route
          path="/payroll/update_payroll_group"
          element={<UpdatePayrollGroup />}
        />

         <Route
          path="/payroll/create_pension_rate"
          element={<CreatePensionRate />}
        />

          <Route
          path="/payroll/delete_pension_rate"
          element={<DeletePensionRate />}
        />
         <Route
          path="/payroll/update_pension_rate"
          element={<UpdatePensionRate />}
        />

         <Route
          path="/payroll/create_payroll_period"
          element={<CreatePayrollPeriod />}
        />

          <Route
          path="/payroll/delete_payroll_period"
          element={<DeletePayrollPeriod />}
        />

          <Route
          path="/payroll/update_payroll_period"
          element={<UpdatePayrollPeriod />}
        />

         <Route
          path="/payroll/create_paylocation_group"
          element={<CreatePayLocationAndGroup />}
        />
         <Route
          path="/payroll/delete_paylocation_group"
          element={<DeletePayLocationAndGroup />}
        />
         <Route
          path="/payroll/update_paylocation_group"
          element={<UpdatePayLocationAndGroup />}
        />

          <Route
          path="/payroll/create_leave_advance_payment"
          element={<CreateLeaveAdvancePayment />}
        />
        <Route
          path="/payroll/delete_leave_advance_payment"
          element={<DeleteLeaveAdvancePayment />}
        />
             <Route
          path="/payroll/update_leave_advance_payment"
          element={<UpdateLeaveAdvancePayment />}
        />

          <Route
          path="/payroll/create_mortgage-infos"
          element={<CreateMortgageInfo />}
        />

         <Route
          path="/payroll/create_backpayment_group"
          element={<CreateBackPaymentGroup />}
        />

           <Route
          path="/payroll/delete_backpayment_group"
          element={<DeleteBackPaymentGroup />}
        />
             <Route
          path="/payroll/update_backpayment_group"
          element={<UpdateBackPaymentGroup />}
        />

        <Route
          path="/payroll/create_departement_payLocation_group"
          element={<CreateDepartmentPayLocationAndGroup />}
        />

         <Route
          path="/payroll/delete_departement_payLocation_group"
          element={<DeleteDepartmentPayLocationAndGroup />}
        />

              
         <Route
          path="/payroll/create_earning_eduction_setup"
          element={<CreateEarningDeductionSetup />}
        />
         <Route
          path="/payroll/delete_earning_earning_setup"
          element={<DeleteEarningDeductionSetup />}
        />
              <Route
          path="/payroll/update_earning_earning_setup"
          element={<UpdateEarningDeductionSetup />}
        />

              <Route
          path="/payroll/create_employee_earning_deduction"
          element={<CreateEmployeeEarningDeduction />}
        />

                <Route
          path="/payroll/delete_employee_earning_deduction"
          element={<DeleteEmployeeEarningDeduction />}
        />
                   <Route
          path="/payroll/update_employee_earning_deduction"
          element={<UpdateEmployeeEarningDeduction />}
        />

                       <Route
          path="/payroll/create_court_case"
          element={<CreateCourtCase />}
        />

          <Route
          path="/payroll/create_Allemployee_earning_deduction"
          element={<CreateAllEmployeeEarningDeduction />}
        />

            <Route
          path="/payroll/delete_Allemployee_earning_deduction"
          element={<DeleteAllEmployeeEarningDeduction />}
        />

                 <Route
          path="/payroll/update_Allemployee_earning_deduction"
          element={<UpdateAllEmployeeEarningDeduction />}
        />




        

       

    


        


        

      </Routes>
    </Router>
  );
}

export default App;
