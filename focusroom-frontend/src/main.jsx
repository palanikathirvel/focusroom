import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('🚀 FocusRoom Frontend Loading...');
console.log('📅 Loaded at:', new Date().toLocaleString());
console.log('✅ All latest changes are now active!');

// Fix for SockJS/STOMP polyfill: provide Node.js 'global' shim for browser
window.global = window;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
