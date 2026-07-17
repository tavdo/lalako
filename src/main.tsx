import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { PublicPage } from './pages/PublicPage';
import { AdminPage } from './pages/AdminPage';
import badge from './assets/badge.jpg';

// expose the Lalako art to CSS (.phone::before ambient background)
document.documentElement.style.setProperty('--bg-art', `url(${badge})`);

const router = createBrowserRouter([
  { path: '/', element: <PublicPage /> },
  { path: '/admin', element: <AdminPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
