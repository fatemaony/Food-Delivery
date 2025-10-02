import React from 'react'
import DashboardLink from '../Components/Dashboard/DashboardLink'
import { Outlet } from 'react-router'


const DashboardLayout = () => {
  return (
    <div className='max-h-full w-full flex'>
      <div className='w-1/4 bg-secondary'>
        <DashboardLink/>
      </div>
    
      <div className='w-3/4'>
        <Outlet/>
      </div>
    </div>
  )
}

export default DashboardLayout
