import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppLogin from "./components/AppLogin";
import CreateStoreIssueVoucher from "./components/StoreIssueVoucher/CreateStoreIssueVoucher";
import UpdateStoreIssueVoucher from "./components/StoreIssueVoucher/UpdateStoreIssueVoucher";
import DeleteStoreIssueVoucher from "./components/StoreIssueVoucher/DeleteStoreIssueVoucher";
import CreateGoodReceivingNote from "./components/GoodReceivingNote/CreateGoodReceivingNote";
import DeleteGoodReceivingNote from "./components/GoodReceivingNote/DeleteGoodReceivingNote";
import UpdateGoodReceivingNote from "./components/GoodReceivingNote/UpdateGoodReceivingNote";
import CreateGatePassInformation from "./components/GatePassInformation/CreateGatePassInformation";
import DeleteGatePassInformation from "./components/GatePassInformation/DeleteGatePassInformation";
import UpdateGatePassInformation from "./components/GatePassInformation/UpdateGatePassInformation";
import DecisionGatePassInformation from "./components/GatePassInformation/DecisionGatePassInformation";
import CreateInterStoreIssueVoucherForIssue from "./components/InterStoreIssueVoucherForIssue/CreateInterStoreIssueVoucherForIssue";
import DeleteInterStoreIssueVoucherForIssue from "./components/InterStoreIssueVoucherForIssue/DeleteInterStoreIssueVoucherForIssue";
import UpdateInterStoreIssueVoucherForIssue from "./components/InterStoreIssueVoucherForIssue/UpdateInterStoreIssueVoucherForIssue";
import DecisionInterStoreIssueVoucherForIssue from "./components/InterStoreIssueVoucherForIssue/DecisionInterStoreIssueVoucherForIssue";
import CreateInterStoreIssueVoucherForReceiving from "./components/InterStoreIssueVoucherForReceiving/CreateInterStoreIssueVoucherForReceiving";
import UpdateInterStoreIssueVoucherForReceiving from "./components/InterStoreIssueVoucherForReceiving/UpdateInterStoreIssueVoucherForReceiving";
import DeleteInterStoreIssueVoucherForReceiving from "./components/InterStoreIssueVoucherForReceiving/DeleteInterStoreIssueVoucherForReceiving";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AppLogin />} />
        <Route path="/login" element={<AppLogin />} />
        <Route path="/storeMovent/create_storeIssued_voucher" element={<CreateStoreIssueVoucher />} />

        <Route path="/storeMovent/update_storeIssued_voucher" element={<UpdateStoreIssueVoucher />} />

        <Route path="/storeMovent/delete_storeIssued_voucher" element={<DeleteStoreIssueVoucher />} />

        <Route path="/storeMovent/create_goodReceiving_note" element={<CreateGoodReceivingNote />} />

        <Route path="/storeMovent/delete_goodReceiving_note" element={<DeleteGoodReceivingNote />} />


        <Route path="/storeMovent/update_goodReceiving_note" element={<UpdateGoodReceivingNote />} />


        <Route path="/storeMovent/create_gatepass_infomation" element={<CreateGatePassInformation />} />

        <Route path="/storeMovent/delete_gatepass_infomation" element={<DeleteGatePassInformation />} />
        

        <Route path="/storeMovent/update_gatepass_infomation" element={<UpdateGatePassInformation />} />

        <Route path="/storeMovent/decision_gatepass_infomation" element={<DecisionGatePassInformation />} />



        <Route path="/storeMovent/create_inter_Store_Issue" element={<CreateInterStoreIssueVoucherForIssue />} />
        <Route path="/storeMovent/delete_inter_Store_Issue" element={<DeleteInterStoreIssueVoucherForIssue />} />

        <Route path="/storeMovent/update_inter_Store_Issue" element={<UpdateInterStoreIssueVoucherForIssue />} />

        <Route path="/storeMovent/decision_inter_Store_Issue" element={<DecisionInterStoreIssueVoucherForIssue />} />

        <Route path="/storeMovent/create_inter_Store_receiving" element={<CreateInterStoreIssueVoucherForReceiving />} />


        <Route path="/storeMovent/update_inter_Store_receiving" element={<UpdateInterStoreIssueVoucherForReceiving />} />

        <Route path="/storeMovent/delete_inter_Store_receiving" element={<DeleteInterStoreIssueVoucherForReceiving />} />











      </Routes>
    </Router>
  );
}

export default App;
