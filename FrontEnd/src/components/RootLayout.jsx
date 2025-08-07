
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

const RootLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SideBar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
