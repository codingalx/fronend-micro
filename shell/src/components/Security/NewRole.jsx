import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext';

const NewRole = ({ children, noResourseIsRequired }) => {
  const { authState } = useContext(AuthContext);
  const { isAuthenticated } = authState;
  const [canAccess, setCanAccess] = useState(true);
  const [loading, setLoading] = useState(true);

  console.log(noResourseIsRequired);

  useEffect(() => {
    // Allow access if no resource is required
    if (noResourseIsRequired) {
      setCanAccess(false);
      console.log(canAccess);

    } else {
      // If resources are required, check if the user is authenticated
      setCanAccess(isAuthenticated);
    }
    setLoading(false);
  }, [noResourseIsRequired, isAuthenticated]);

  if (loading) return null;

  return canAccess ? (children ? children : <Outlet />) : <Navigate to="/denied-access" replace />;
};

export default NewRole;