// src/state/authAtom.js
import { atom } from 'jotai';

// Create the atom for authentication state
const initialAuthState = {
    accessToken: '',
    refreshToken: '',
    roles: [],
    tenantId: '',
    username: '',
    
};

// Only access localStorage in the browser
if (typeof window !== 'undefined') {
    initialAuthState.accessToken = localStorage.getItem('accessToken') || '';
    initialAuthState.refreshToken = localStorage.getItem('refreshToken') || '';
    initialAuthState.roles = JSON.parse(localStorage.getItem('roles')) || [];
    initialAuthState.tenantId = localStorage.getItem('tenantId') || '';
    initialAuthState.username = localStorage.getItem('username') || '';
}

export const authAtom = atom(initialAuthState);