import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLogin from "./components/AppLogin";
import CreateFixedAsset from "./components/FixedAsset/UpdateFixedAsset";
import UpdateFixedAsset from "./components/FixedAsset/CreateFixedAsset";
import GetAllFixedAsset from "./components/FixedAsset/GetAllFixedAsset";
import DeleteFixedAsset from "./components/FixedAsset/DeleteFixedAsset";


const App = () => {
  return (
    <>
      <div>
      </div>

      <Router>
        <Routes>
          <Route path="/login" element={<AppLogin />} />
          <Route path="/asset/create_fixed_asset" element={<CreateFixedAsset />} />
          <Route path="/asset/update_fixed_asset" element={<UpdateFixedAsset />} />
          <Route path="/asset/list_fixed_assets" element={<GetAllFixedAsset />} />
          <Route path="/asset/delete_fixed_asset" element={<DeleteFixedAsset />} />
        </Routes>

      </Router>
    </>
  );
};
export default App;
