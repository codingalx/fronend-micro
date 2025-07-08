import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react'
const AuthProvider = React.lazy(() => import('shell/AuthContext').then(module => ({ default: module.AuthProvider })));

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
   </AuthProvider>
)
