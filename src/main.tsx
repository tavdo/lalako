import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { PublicPage } from './pages/PublicPage';
import { AdminPage } from './pages/AdminPage';
import lalako from './assets/lalako.png';

// Cute Lalako portrait as the visible app background
document.documentElement.style.setProperty('--bg-art', `url(${lalako})`);

const router = createBrowserRouter([
  { path: '/', element: <PublicPage /> },
  { path: '/admin', element: <AdminPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
