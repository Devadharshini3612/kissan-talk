import React, { useState, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX, FiDownload } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = ({ department = 'All', onBack }) => {
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
    fetchStats();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      // Pass department to backend for filtering
      const response = await axios.get('http://localhost:5000/api/grievances', {
        params: { department }
      });
      setGrievances(response.data);
    } catch (error) {
      alert('Error fetching grievances');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesFilter = filter === 'All' || g.status === filter;
    const matchesSearch = 
      g.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleEditClick = (grievance) => {
    setEditingId(grievance.id);
    setEditData({ status: grievance.status, resolution: grievance.resolution, priority: grievance.priority });
  };

  const handleSaveEdit = async (grievanceId) => {
    try {
      await axios.put(`http://localhost:5000/api/grievances/${grievanceId}`, editData);
      setEditingId(null);
      fetchGrievances();
      alert('Grievance updated successfully!');
    } catch (error) {
      alert('Error updating grievance');
    }
  };

  const getAudioUrl = (filename) => {
    if (!filename) return null;
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
    if (cleanFilename.startsWith('http')) return cleanFilename;
    return `http://localhost:5000/${cleanFilename}`;
  };

  const getDownloadUrl = (filename) => {
    if (!filename) return null;
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
    // If it's a full URL, return as is (though download might not work if cross-origin)
    if (cleanFilename.startsWith('http')) return cleanFilename;
    return `http://localhost:5000/api/download/${cleanFilename}`;
  };

  const getStatusBadge = (status) => {
    const className = `badge badge-${status.toLowerCase().replace(' ', '-')}`;
    return <span className={className}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const className = `badge badge-${priority.toLowerCase()}`;
    return <span className={className}>{priority} Priority</span>;
  };

  return (
    <div className="container" style={{ paddingTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: 'white' }}>{department === 'All' ? 'Central Command' : department} Dashboard</h1>
          <p style={{ color: '#a0aec0' }}>Real-time monitoring and resolution</p>
        </div>
        {onBack && (
          <button className="btn btn-secondary" onClick={onBack}>
            &larr; Switch Department
          </button>
        )}
      </div>

      {stats && (
        <div className="grid-3" style={{ marginBottom: '40px' }}>
          <div className="stat-card">
            <h3>{stats.totalGrievances}</h3>
            <p>Total Grievances</p>
          </div>
          <div className="stat-card">
            <h3 style={{ color: '#ffd93d' }}>{stats.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3 style={{ color: '#51cf66' }}>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
          <div className="stat-card">
            <h3 style={{ color: '#6bceff' }}>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3 style={{ color: '#ff6b6b' }}>{stats.highPriority}</h3>
            <p>High Priority</p>
          </div>
          <div className="stat-card">
            <h3>{stats.categories.length}</h3>
            <p>Categories</p>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2>Filter & Search</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
              {['All', 'Pending', 'In Progress', 'Resolved'].map(status => (
                <button
                  key={status}
                  className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search by Name, ID, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                fontSize: '16px'
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'white' }}><span className="loader"></span> Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Farmer</th>
                <th>Category</th>
                <th>Title / Audio</th>
                <th style={{ width: '25%' }}>Description & Resolution</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map(grievance => (
                <tr key={grievance.id}>
                  <td>
                    <strong>{grievance.id}</strong>
                    <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                      {grievance.date}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{grievance.farmerName}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{grievance.phone}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{grievance.village}, {grievance.district}</div>
                  </td>
                  <td>
                    <span style={{ 
                      backgroundColor: '#ebf8ff', color: '#2b6cb0', 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' 
                    }}>
                      {grievance.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ marginBottom: '5px', fontWeight: '600' }}>{grievance.title}</div>
                    {grievance.voiceFile && (
                      <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <audio 
                          controls 
                          src={getAudioUrl(grievance.voiceFile)} 
                          style={{ height: '30px', width: '200px' }} 
                        />
                        <a 
                          href={getDownloadUrl(grievance.voiceFile)} 
                          download
                          style={{ color: '#4299e1', fontSize: '14px' }}
                          title="Download Audio"
                        >
                          <FiDownload />
                        </a>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ color: '#718096', fontSize: '12px', fontWeight: 'bold' }}>ISSUE:</span>
                      <p style={{ margin: '4px 0' }}>{grievance.description}</p>
                    </div>
                    
                    {editingId === grievance.id ? (
                      <div style={{ marginTop: '10px' }}>
                        <span style={{ color: '#2f855a', fontSize: '12px', fontWeight: 'bold' }}>RESOLUTION NOTE:</span>
                        <textarea
                          value={editData.resolution || ''}
                          onChange={(e) => setEditData({...editData, resolution: e.target.value})}
                          placeholder="Enter resolution details..."
                          style={{ 
                            width: '100%', padding: '8px', borderRadius: '4px', 
                            border: '1px solid #cbd5e0', fontSize: '13px', minHeight: '60px'
                          }}
                        />
                      </div>
                    ) : (
                      grievance.resolution && (
                        <div style={{ marginTop: '10px', backgroundColor: '#f0fff4', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #48bb78' }}>
                          <span style={{ color: '#2f855a', fontSize: '12px', fontWeight: 'bold' }}>RESOLUTION:</span>
                          <p style={{ margin: '4px 0', fontSize: '13px', color: '#276749' }}>{grievance.resolution}</p>
                        </div>
                      )
                    )}
                  </td>
                  <td>
                    {editingId === grievance.id ? (
                      <select 
                        value={editData.status} 
                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                        style={{ padding: '5px', borderRadius: '4px', width: '100%' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    ) : (
                      getStatusBadge(grievance.status)
                    )}
                  </td>
                  <td>
                    {editingId === grievance.id ? (
                      <select 
                        value={editData.priority} 
                        onChange={(e) => setEditData({...editData, priority: e.target.value})}
                        style={{ padding: '5px', borderRadius: '4px', width: '100%' }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    ) : (
                      getPriorityBadge(grievance.priority)
                    )}
                  </td>
                  <td>
                    {editingId === grievance.id ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          onClick={() => handleSaveEdit(grievance.id)}
                          className="btn btn-primary"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                          title="Save"
                        >
                          <FiCheck />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                          title="Cancel"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEditClick(grievance)}
                        style={{ 
                          background: 'none', border: 'none', cursor: 'pointer', 
                          color: '#4299e1', fontSize: '18px' 
                        }}
                        title="Edit Status/Resolution"
                      >
                        <FiEdit2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
