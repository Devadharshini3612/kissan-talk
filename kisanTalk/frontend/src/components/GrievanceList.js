import React, { useState, useEffect } from 'react';
import { FiPhone, FiMapPin, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';

const GrievanceList = () => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/grievances');
      setGrievances(response.data);
    } catch (error) {
      alert('Error fetching grievances');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffd93d',
      'In Progress': '#6bceff',
      'Resolved': '#51cf66'
    };
    return colors[status] || '#999';
  };

  if (loading) {
    return <div className="container" style={{ paddingTop: '30px', color: 'white' }}><span className="loader"></span> Loading grievances...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>Grievance Records</h1>

      <div className="grid-2">
        <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {grievances.map(grievance => (
            <div
              key={grievance.id}
              className="card"
              onClick={() => setSelectedGrievance(grievance)}
              style={{
                cursor: 'pointer',
                borderLeft: `4px solid ${getStatusColor(grievance.status)}`,
                backgroundColor: selectedGrievance?.id === grievance.id ? '#f0f0f0' : 'white'
              }}
            >
              <h3 style={{ marginBottom: '10px' }}>{grievance.id}</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{grievance.title}</p>
              <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#666' }}>
                <span className={`badge badge-${grievance.status.toLowerCase().replace(' ', '-')}`}>
                  {grievance.status}
                </span>
                <span className={`badge badge-${grievance.priority.toLowerCase()}`}>
                  {grievance.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          {selectedGrievance ? (
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h2>{selectedGrievance.id}</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>{selectedGrievance.title}</p>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#667eea' }}>FARMER DETAILS</h3>
                <p><strong>Name:</strong> {selectedGrievance.farmerName}</p>
                <p><FiPhone style={{ marginRight: '8px' }} />{selectedGrievance.phone}</p>
                <p><FiMapPin style={{ marginRight: '8px' }} />{selectedGrievance.village}, {selectedGrievance.district}</p>
                <p><FiCalendar style={{ marginRight: '8px' }} />{selectedGrievance.date}</p>
              </div>

              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#667eea' }}>STATUS & PRIORITY</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span className={`badge badge-${selectedGrievance.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedGrievance.status}
                  </span>
                  <span className={`badge badge-${selectedGrievance.priority.toLowerCase()}`}>
                    {selectedGrievance.priority}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#667eea' }}>CATEGORY</h3>
                <p>{selectedGrievance.category}</p>
                {selectedGrievance.assignedAdmin && (
                   <p style={{ marginTop: '5px', fontSize: '14px', color: '#555' }}>
                     <strong>Routed To:</strong> {selectedGrievance.assignedAdmin}
                   </p>
                )}
              </div>

              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#667eea' }}>DESCRIPTION</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>{selectedGrievance.description}</p>
              </div>

              {selectedGrievance.resolution && (
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#667eea' }}>
                    <FiMessageSquare style={{ marginRight: '8px' }} />RESOLUTION
                  </h3>
                  <p style={{ color: '#51cf66', fontWeight: 'bold', lineHeight: '1.6' }}>✓ {selectedGrievance.resolution}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#999' }}>Select a grievance to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrievanceList;
