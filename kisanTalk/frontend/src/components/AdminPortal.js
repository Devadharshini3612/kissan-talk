import React from 'react';
import { FiUsers, FiActivity, FiDroplet, FiDollarSign, FiShoppingBag, FiTool } from 'react-icons/fi';

const AdminPortal = ({ onSelectDepartment }) => {
  const departments = [
    { id: 'Admin_CropHealth', name: 'Crop Health Dept', icon: <FiActivity />, color: '#48bb78' },
    { id: 'Admin_WaterSupply', name: 'Water & Irrigation', icon: <FiDroplet />, color: '#4299e1' },
    { id: 'Admin_Finance', name: 'Finance & Subsidy', icon: <FiDollarSign />, color: '#ecc94b' },
    { id: 'Admin_SupplyChain', name: 'Supply Chain (Seeds)', icon: <FiShoppingBag />, color: '#ed8936' },
    { id: 'Admin_Machinery', name: 'Machinery Dept', icon: <FiTool />, color: '#a0aec0' },
    { id: 'All', name: 'Central Command (All)', icon: <FiUsers />, color: '#667eea' },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>
      <h1 style={{ color: 'white', marginBottom: '10px' }}>Department Administration</h1>
      <p style={{ color: '#a0aec0', marginBottom: '50px' }}>Select your department to view specific grievances and analytics.</p>

      <div className="grid-3">
        {departments.map((dept) => (
          <div 
            key={dept.id} 
            className="card admin-card"
            onClick={() => onSelectDepartment(dept.id)}
            style={{ 
              cursor: 'pointer', 
              transition: 'transform 0.2s',
              borderTop: `4px solid ${dept.color}`
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '40px', color: dept.color, marginBottom: '15px' }}>
              {dept.icon}
            </div>
            <h3>{dept.name}</h3>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              View Dashboard &rarr;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPortal;
