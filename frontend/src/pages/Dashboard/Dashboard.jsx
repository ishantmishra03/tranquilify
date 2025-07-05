import React from 'react'
import Navbar from '../../components/Navbar/Navbar';

import Sidebar from '../../components/Dashboard/Sidebar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />

      <div className="pt-15 flex">
        <Sidebar />
      </div>
    </div>
  )
}

export default Dashboard
