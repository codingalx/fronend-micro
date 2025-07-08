import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLogin from "./components/AppLogin";
import CreateItem from "./components/Item/CreateItem";
import UpdateItem from './components/Item/UpdateItem';
import DeleteItem from './components/Item/DeleteItem';
import CreateInspection from './components/Inspection/CreateInspection';
import ListItems from './components/Inspection/listInspectedItem';
import UpdateInspection from './components/Inspection/UpdateInspection';
import DeleteInspection from './components/Inspection/DeleteInspection';
const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<AppLogin />} />
      
<Route path="/item/create-item" element={<CreateItem />} />
      <Route path="/item/update-item" element={<UpdateItem />} />
      <Route path="/item/delete-item" element={<DeleteItem />} />
      <Route path="/item/create-inspection" element={<CreateInspection />} />
      <Route path='/item/list-inpected-item' element={<ListItems/>} />
      <Route path="/item/update-inspection" element={<UpdateInspection />} />
      <Route path="/item/delete-inspection" element={<DeleteInspection />} />

      </Routes>
      </Router>
  )
}

export default App
