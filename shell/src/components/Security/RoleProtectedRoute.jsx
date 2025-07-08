import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext';
import { canAccessResource } from './canAccessResource';

const RoleProtectedRoute = ({
  requiredResourceName,
  admin,
  apiName,
  NorequiredResourceName,
  children
}) => {
  const { authState } = useContext(AuthContext);
  const { roles } = authState;
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const getUserName = () => localStorage.getItem("username");
  const username = getUserName();

  useEffect(() => {
    const checkAccess = async () => {
      console.log("Roles:", roles);
      console.log("NorequiredResourceName:", NorequiredResourceName);
      console.log("RequiredResourceName:", requiredResourceName);

      if (!roles) {
        setCanAccess(false);
        setLoading(false);
        return;
      }

      if (NorequiredResourceName && !username.toLowerCase().includes("admin") ) {
        setCanAccess(true);
        setLoading(false);
        return;
      }

      if (admin && roles.includes('admin')) {
        setCanAccess(true);
        setLoading(false);
        return;
      }

      if (!requiredResourceName) {
        setCanAccess(false);
        setLoading(false);
        return;
      }

      try {
        const access = await canAccessResource(requiredResourceName, roles, apiName);
        setCanAccess(access);
      } catch (error) {
        console.error("Access check failed:", error);
        setCanAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [roles, requiredResourceName, admin, NorequiredResourceName, apiName]);

  if (loading) return null;

  return canAccess ? (children ? children : <Outlet />) : <Navigate to="/denied-access" replace />;
};

export default RoleProtectedRoute;




// import React, { useContext, useEffect, useState } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import AuthContext from './AuthContext';
// import { canAccessResource } from './canAccessResource';

// const RoleProtectedRoute = ({ requiredResourceName, admin, apiName,NorequiredResourceName, children }) => {
//   const { authState } = useContext(AuthContext);
//   const { isAuthenticated, roles } = authState;
//   const [canAccess, setCanAccess] = useState(false);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const checkAccess = async () => {
//       console.log(NorequiredResourceName,roles)

      
//       if (NorequiredResourceName && roles.includes('insa_default_role')) {
//         setCanAccess(true);
//         setLoading(false);
//         return;
//       }
//       console.log(canAccess)

//       if (admin && roles.includes('admin')) {
//         setCanAccess(true);
//         setLoading(false);
//         return;
//       }


//       if (!roles || !requiredResourceName) {
//         setCanAccess(false);
//         setLoading(false);
//         return;
//       }

//       if (!requiredResourceName && roles ) {
//         setCanAccess(true);
//         setLoading(false);
//         return;
//       }

//       try {
//         const access = await canAccessResource(requiredResourceName, roles, apiName);
//         setCanAccess(access);
//       } catch (error) {
//         console.error("Access check failed:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAccess();
//   }, [roles, requiredResourceName, admin,NorequiredResourceName, apiName]);

//   if (loading) return null;

//   return canAccess ? (children ? children : <Outlet />) : <Navigate to="/denied-access" replace />;
// };

// export default RoleProtectedRoute;


// import React, { useContext, useEffect, useState } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import AuthContext from './AuthContext';
// import { canAccessResource } from './canAccessResource';

// const RoleProtectedRoute = ({ requiredResourceName, admin, apiName, children, checkAccess = true }) => {
//   const { authState } = useContext(AuthContext);
//   const { roles } = authState;
//   const [canAccess, setCanAccess] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAccessRights = async () => {
//       if (admin && roles.includes('admin')) {
//         setCanAccess(true);
//         setLoading(false);
//         return;
//       }

//       if (checkAccess) {
//         setCanAccess(true);
//         setLoading(false);
//         return;
//       }

//       if (!roles || !requiredResourceName) {
//         setCanAccess(false);
//         setLoading(false);
//         return;
//       }

//       try {
//         const access = await canAccessResource(requiredResourceName, roles, apiName);
//         setCanAccess(access);
//       } catch (error) {
//         console.error("Access check failed:", error);
//         setCanAccess(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAccessRights();
//   }, [roles, requiredResourceName, admin, apiName, checkAccess]);

//   if (loading) return null;

//   return canAccess ? (children ? children : <Outlet />) : <Navigate to="/denied-access" replace />;
// };

// export default RoleProtectedRoute;