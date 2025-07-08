import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateNestedCriteria from "./components/PromoCriteriaName/NestedCriteria";
import NestedCriteria from "./components/PromotionCriteria/NestedCriteria";
import CreateName from "./components/PromoCriteriaName/CreateName";
import ListPromotion from "./components/PromoCriteriaName/ListPromotion";
import DeleteCriteria from "./components/PromoCriteriaName/DeleteCriteria";
import DeletePromotionCriteria from "./components/PromotionCriteria/DeletePromotionCriteria";
import CreatePromotionCriteria from "./components/PromotionCriteria/CreatePromotionCriteria";
import ListNestedCriteria from "./components/PromoCriteriaName/ListNestedCriteria";
import EditNestedCriteria from "./components/PromoCriteriaName/EditNestedCriteria";
import DeleteChildCriteria from "./components/PromoCriteriaName/DeleteChildCriteria";
import ListPromotionCriteria from "./components/PromotionCriteria/ListPromotionCriteria";
import CreatePromotionCandidate from "./components/PromotionCandidate/CreatePromotionCandidate";
import ListPromotionCandidates from "./components/PromotionCandidate/ListPromotionCandidate";
import DeletePromotionCandidate from "./components/PromotionCandidate/DeletePromotionCandidate";
import CreatePromoteCandidate from "./components/PromoteCandidate/CreatePromoteCandidate";

import AppLogin from "./components/AppLogin";
import ListCandidateEvaluation from "./components/CandidateEvaluation/ListCandidateEvaluation";
import ListPromoteCandidates from "./components/PromoteCandidate/ListPromoteCandidate";
import UpdateCriteria from "./components/PromoCriteriaName/UpdateCriteria";
import UpdatePromotionCriteria from "./components/PromotionCriteria/UpdatePromotionCriteria";
import UpdatePromotionCandidate from "./components/PromotionCandidate/UpdatePromotionCandidate";
import CreateCandidateEvaluation from "./components/CandidateEvaluation/CreateCandidateEvaluation";
import EditCandidateEvaluation from "./components/CandidateEvaluation/EditCandidateEvaluation";
import DeleteCandidateEvaluation from "./components/CandidateEvaluation/DeletCandidateEvaluation";

const App = () => {
  return (
    <>
      <div>
      </div>

      <Router>
        <Routes>
          <Route path="/login" element={<AppLogin />} />
          <Route path="promotion/criteria_name" element={<CreateName />} />

          <Route
            path="/CreatePromoteCandidate"
            element={<CreatePromoteCandidate />}
          />
          <Route
            path="/ListPromoteCandidates"
            element={<ListPromoteCandidates />}
          />
          
          <Route
            path="/CreateCandidateEvaluation"
            element={<CreateCandidateEvaluation />}
          />

          <Route path="/list" element={<ListPromotion />} />
          <Route path="/deleteCriteria" element={<DeleteCriteria />} />
          <Route path="/updateCriteria/" element={<UpdateCriteria />} />
          <Route
            path="/CreatePromotionCriteria"
            element={<CreatePromotionCriteria />}
          />

          <Route
            path="/listpromotioncriteria"
            element={<ListPromotionCriteria />}
          />
         
          <Route path="/updateCriteria" element={<UpdateCriteria />} />
          <Route
            path="/updatePromotionCriteria"
            element={<UpdatePromotionCriteria />}
          />

          <Route
            path="/createPromotionCandidate"
            element={<CreatePromotionCandidate />}
          />

          <Route
            path="/listpromotioncandidate"
            element={<ListPromotionCandidates />}
          />
          <Route
            path="/updatePromotionCandidates"
            element={<UpdatePromotionCandidate />}
          />
          <Route
            path="/deleteCandidate"
            element={<DeletePromotionCandidate />}
          />
         
          <Route
            path="/DeletePromotionCriteria"
            element={<DeletePromotionCriteria />}
          />
           <Route
            path="/CreateCandidateEvaluation"
            element={<CreateCandidateEvaluation />}
          />
          <Route path="/listEvaluation" element={<ListCandidateEvaluation />} />
          <Route path="/editevaluation" element={<EditCandidateEvaluation />} />
          <Route
            path="/deleteevaluation"
            element={<DeleteCandidateEvaluation />}
          />
           <Route
            path="/nestedcriteria"
            element={<CreateNestedCriteria />}
          />
       <Route path="/nested-criteria/" element={<NestedCriteria />} />
       <Route
            path="/nested-name"
            element={<ListNestedCriteria />}
          />
          <Route
            path="/editednestedcriteria"
            element={<EditNestedCriteria />}
          />
          <Route
            path="/deleteChildCriteria"
            element={<DeleteChildCriteria />}
          />

        </Routes>
        
      </Router>
    </>
  );
};
export default App;
