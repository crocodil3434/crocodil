import React from 'react';
import Sidebar from './Sidebar'; // Sidebar bileşenini import edin
import UserMenu from './UserMenu'; // UserMenu bileşenini import edin

const Main = ({ children }) => {
  return (
    <div className="antialiased bg-gray-50 min-h-screen flex flex-row">
      <Sidebar />
      <main className="flex flex-col flex-1 p-4" style={{ marginLeft: '256px', marginRight: '256px' }}>
        {children}
      </main>
      <UserMenu />
    </div>
  );
}

export default Main;
