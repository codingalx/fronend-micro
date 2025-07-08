import React from 'react'
import { useAtom } from 'jotai';
import { authAtom } from 'shell/authAtom'; // Adjust the import based on your structure
import AppLogout from './AppLogout';
import Exposed from 'shell/Exposed';



export default function GetAllEmployee() {
  const [authState] = useAtom(authAtom); // Access the shared authentication state

  return (
      <div>
        <AppLogout />
        <Exposed />
          <h3>Authentication Information</h3>
          <ul>
              <li><strong>Access Token:</strong> {authState.accessToken}</li>
              <li><strong>Refresh Token:</strong> {authState.refreshToken}</li>
              <li><strong>Roles:</strong> {JSON.stringify(authState.roles)}</li>
              <li><strong>Tenant ID:</strong> {authState.tenantId}</li>
              <li><strong>Username:</strong> {authState.username}</li>
          </ul>
      </div>
  );
};

