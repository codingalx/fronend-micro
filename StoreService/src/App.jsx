import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import CreateStoreCategory from "./components/StoreCategory/CreateStoreCategory";
import AppLogin from "./components/AppLogin";
import ListStoreCategory from "./components/StoreCategory/ListStoreCategory";
import UpdateStoreCategory from "./components/StoreCategory/UpdateStoreCategory";
import DeleteStoreCategory from "./components/StoreCategory/DeleteStoreCategory";
import CreateStore from "./components/Store/CreateStore";
import ListStore from "./components/Store/ListStore";
import UpdateStore from "./components/Store/UpdateStore";
import DeleteStore from "./components/Store/DeleteStore";
import CreateShelf from "./components/Shelf/CreateShelf";
import ListShelf from "./components/Shelf/ListShelf";
import UpdateShelf from "./components/Shelf/UpdateShelf";
import DeleteShelf from "./components/Shelf/DeleteShelf";
import CreateCell from "./components/Cell/CreateCell";
import ListCell from "./components/Cell/ListCell";
import DeleteCell from "./components/Cell/DeleteCell";
import UpdateCell from "./components/Cell/UpdateCell";
import CreateStoreRequisition from "./components/Store Requisition/CreateStoreRequisition";
import ListStoreRequisition from "./components/Store Requisition/ListStoreRequisition";
import DeleteStoreRequisition from "./components/Store Requisition/DeleteStoreRequisition";
import UpdateStoreRequisition from "./components/Store Requisition/UpdateStoreRequisition";
import CreateReceivableItem from "./components/ReceivableItem/CreateReceivableItem";
import ListReceivableItem from "./components/ReceivableItem/ListReceivableItem";
import DeleteReceivableItem from "./components/ReceivableItem/DeleteReceivableItem";
import UpdateReceivableItem from "./components/ReceivableItem/UpdateReceivableItem";
import CreateIssuableItem from "./components/IssuableItem/CreateIssuableItem";
import ListIssuableItem from "./components/IssuableItem/ListIssuableItem";
import DeleteIssuableItem from "./components/IssuableItem/DeleteIssuableItem";
import UpdateIssuableItem from "./components/IssuableItem/UpdateIssuableItem";
import ListReceivableItemByStore from "./components/ReceivableItem/ListReceivableItemByStore";
import ListIssuableItemByStore from "./components/IssuableItem/ListIssuableItemByStore";

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/login" element={<AppLogin />} />
        

            {/* Store Category Routes */}
          <Route path="/store/create-store-category" element={<CreateStoreCategory />} />
          <Route path="/store/list-store-category" element={<ListStoreCategory />} />
          <Route path="/store/update-store-category" element={<UpdateStoreCategory />} />
          <Route path="/store/delete-store-category" element={<DeleteStoreCategory />} />
          
                {/* Store Routes */}
          <Route path="/store/create-store" element={<CreateStore />} />
          <Route path="/store/list-store" element={<ListStore />} />
          <Route path="/store/update-store" element={<UpdateStore />} />
          <Route path="/store/delete-store" element={<DeleteStore />} />

                 {/* Shelf Routes */}
          <Route path="/store/create-shelf" element={<CreateShelf />} />
          <Route path="/store/list-shelf" element={<ListShelf />} />
          <Route path="/store/update-shelf" element={<UpdateShelf/>} />
          <Route path="/store/delete-shelf" element={<DeleteShelf />} />

              {/* Cell Routes */}
          <Route path="/store/create-cell" element={<CreateCell />} />
          <Route path="/store/list-cell" element={<ListCell />} />
          <Route path="/store/update-cell" element={<UpdateCell/>} />
          <Route path="/store/delete-cell" element={<DeleteCell />} />

           {/* Store Requisition Routes */}
          <Route path="/store/create-store-requisition" element={<CreateStoreRequisition/>} />
          <Route path="/store/list-store-requisition" element={<ListStoreRequisition />} />
          <Route path="/store/update-store-requisition" element={<UpdateStoreRequisition />} />
          <Route path="/store/delete-store-requisition" element={<DeleteStoreRequisition />} />
    

               {/* Store Requisition Routes */}
          <Route path="/store/create-receivable-item" element={<CreateReceivableItem/>} />
          <Route path="/store/list-receivable-item" element={<ListReceivableItem />} />
          <Route path="/store/update-receivable-item" element={<UpdateReceivableItem />} />
          <Route path="/store/delete-receivable-item" element={<DeleteReceivableItem />} />
          <Route path="/store/list-receivable-item-by-store" element={<ListReceivableItemByStore/>} />

          
               {/* Store Requisition Routes */}
          <Route path="/store/create-issuable-item" element={<CreateIssuableItem/>} />
          <Route path="/store/list-issuable-item" element={<ListIssuableItem/>} />
          <Route path="/store/update-issuable-item" element={<UpdateIssuableItem />} />
          <Route path="/store/delete-issuable-item" element={<DeleteIssuableItem/>} />
          <Route path="/store/list-issuable-item-by-store" element={<ListIssuableItemByStore/>} />

          </Routes>

    </Router>
  );
}

export default App;