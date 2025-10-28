import React, { useState } from 'react';
import { Outlet } from 'react-router';
import DashboardLink from '../Components/Dashboard/DashboardLink';
import { FaBars, FaTimes } from 'react-icons/fa';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex min-h-screen bg-base-200'>
      {/* Sidebar */}
      
      {/* Mobile Sidebar - fixed, slides in */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="h-full">
          <DashboardLink />
        </div>
      </div>

      {/* Desktop Sidebar - static */}
      <div className='hidden  md:flex md:w-1/4'>
        <DashboardLink />
      </div>
      
      {/* Main Content */}
      <div className='flex-1 w-full md:w-3/4 flex flex-col'>
        {/* Mobile Header with Menu Button */}
        <div className='md:hidden flex justify-between items-center bg-base-100 p-4 shadow-md'>
          <h1 className='text-xl font-bold text-base-content'>Dashboard</h1>
          <button onClick={toggleSidebar} className="text-2xl text-base-content" aria-label="Toggle menu">
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {/* Page Content */}
        <main className='p-4  flex-1'>
           <Outlet />
        </main>
      </div>

      {/* Overlay for mobile to close sidebar on click */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
