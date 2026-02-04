import React, { useState } from 'react';
import axios from 'axios';
import { FiHome, FiFileText, FiBarChart2, FiGlobe, FiPhoneCall, FiX, FiUsers, FiSearch, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from './LanguageContext';
import { languages } from './languages';
import LanguageSelector from './components/LanguageSelector';
import VoiceRecorder from './components/VoiceRecorder';
import GrievanceForm from './components/GrievanceForm';
import Dashboard from './components/Dashboard';
import AdminPortal from './components/AdminPortal';
import GrievanceList from './components/GrievanceList';
import './App.css';

function App() {
  const { language } = useLanguage();
  const t = languages[language];
  const [currentPage, setCurrentPage] = useState('home');
  const [adminDepartment, setAdminDepartment] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // To force re-render components
  
  // Tracking State
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleGrievanceSubmitted = () => {
    setCurrentPage('home');
  };

  const handleTrackGrievance = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsTracking(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/grievances/${trackingId}`);
      setTrackingResult(response.data);
    } catch (error) {
      console.error("Tracking error:", error);
      setTrackingError('Grievance ID not found. Please check and try again.');
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#cbd5e0';
    const s = status.toLowerCase();
    if (s.includes('pending')) return '#ecc94b';
    if (s.includes('progress')) return '#4299e1';
    if (s.includes('resolved')) return '#48bb78';
    return '#a0aec0';
  };

  // Show language selector if no language is selected
  if (!language) {
    return <LanguageSelector />;
  }

  return (
    <div className="App">
      {/* Main Content */}
      {currentPage === 'home' && (
        <div style={{ 
          minHeight: '100vh',
          backgroundColor: '#f7fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ color: '#2d3748', fontSize: '42px', fontWeight: '800', marginBottom: '10px' }}>KisanTalk</h1>
            <p style={{ color: '#718096', fontSize: '18px' }}>Farmer Grievance & Emergency Support</p>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '30px', 
            width: '100%', 
            maxWidth: '1000px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            
            {/* Option 1: Online Complaint Form (Blue) */}
            <div 
              className="card"
              style={{ 
                flex: '1',
                minWidth: '300px',
                backgroundColor: '#ebf8ff', 
                borderTop: '6px solid #4299e1',
                padding: '40px 30px',
                textAlign: 'center',
                borderRadius: '15px',
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => setCurrentPage('grievance-form')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
               <div style={{ 
                 width: '100px', height: '100px', 
                 backgroundColor: '#bee3f8', 
                 borderRadius: '50%', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 marginBottom: '20px'
               }}>
                 <div style={{ fontSize: '50px', color: '#4299e1' }}>📝</div>
               </div>
               <h2 style={{ color: '#2b6cb0', fontSize: '28px', marginBottom: '10px' }}>Register Complaint</h2>
               <p style={{ color: '#2c5282', fontSize: '16px', marginBottom: '25px' }}>Fill Form & Record Voice Note</p>
               
               <button 
                style={{
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  fontSize: '18px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(66, 153, 225, 0.3)'
                }}
               >
                 Open Form
               </button>
            </div>

            {/* Option 2: Kisan Helpline (Red) */}
            <div 
              className="card"
              style={{ 
                flex: '1',
                minWidth: '300px',
                backgroundColor: '#fff5f5', 
                borderTop: '6px solid #f56565',
                padding: '40px 30px',
                textAlign: 'center',
                borderRadius: '15px',
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                setRefreshKey(prev => prev + 1);
                setCurrentPage('grievances');
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
               <div style={{ 
                 width: '100px', height: '100px', 
                 backgroundColor: '#fed7d7', 
                 borderRadius: '50%', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 marginBottom: '20px'
               }}>
                 <div style={{ fontSize: '50px', color: '#f56565' }}>📞</div>
               </div>
               <h2 style={{ color: '#c53030', fontSize: '28px', marginBottom: '10px' }}>Kisan Helpline</h2>
               <p style={{ color: '#9b2c2c', fontSize: '16px', marginBottom: '25px' }}>Toll-Free 1800-KISAN-HELP</p>
               
               <button 
                style={{
                  backgroundColor: '#f56565',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  fontSize: '18px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(245, 101, 101, 0.3)'
                }}
               >
                 Call Now
               </button>
            </div>

          </div>

          {/* Track Complaint Section */}
          <div style={{ marginTop: '50px', width: '100%', maxWidth: '600px' }}>
            <div className="card" style={{ padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ textAlign: 'center', color: '#4a5568', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <FiSearch /> Track Complaint Status
              </h3>
              <form onSubmit={handleTrackGrievance} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Complaint ID (e.g. GRV001)"
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e0',
                    fontSize: '16px'
                  }}
                />
                <button 
                  type="submit" 
                  disabled={isTracking}
                  style={{ 
                    backgroundColor: '#2d3748', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 25px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isTracking ? 'Checking...' : 'Check'}
                </button>
              </form>

              {trackingError && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff5f5', borderRadius: '8px', color: '#c53030', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiAlertCircle /> {trackingError}
                </div>
              )}

              {trackingResult && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0fff4', borderRadius: '8px', border: '1px solid #c6f6d5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#2f855a' }}>{trackingResult.id}</span>
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '15px', 
                      backgroundColor: getStatusColor(trackingResult.status), 
                      color: 'white', 
                      fontSize: '12px', 
                      fontWeight: 'bold' 
                    }}>
                      {trackingResult.status}
                    </span>
                  </div>
                  <p style={{ margin: '5px 0', color: '#4a5568' }}><strong>Category:</strong> {trackingResult.category}</p>
                  <p style={{ margin: '5px 0', color: '#4a5568' }}><strong>Date:</strong> {trackingResult.date}</p>
                  {trackingResult.resolution && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e0' }}>
                      <p style={{ color: '#2f855a', fontWeight: 'bold' }}>Resolution:</p>
                      <p style={{ color: '#4a5568' }}>{trackingResult.resolution}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
            <button onClick={() => setCurrentPage('admin-portal')} style={{ background: 'none', border: 'none', color: '#718096', cursor: 'pointer', fontSize: '14px' }}>
              Admin Access
            </button>
          </div>
        </div>
      )}

      {currentPage === 'grievances' && (
        <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{ marginBottom: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', alignSelf: 'flex-start', color: 'white', marginLeft: '20px' }}
          >
            &larr; Back
          </button>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <VoiceRecorder key={refreshKey} onGrievanceSubmitted={handleGrievanceSubmitted} />
          </div>
        </div>
      )}

      {currentPage === 'grievance-form' && (
        <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px', minHeight: '100vh' }}>
          <GrievanceForm 
            onCancel={() => setCurrentPage('home')} 
            onSuccess={() => {
              // We don't change page immediately to let user see the success screen
            }} 
          />
        </div>
      )}

      {currentPage === 'grievances-list' && <GrievanceList />}

      {currentPage === 'admin-portal' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#1a202c' }}>
           <div style={{ padding: '20px' }}>
            <button 
              onClick={() => setCurrentPage('home')}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
            >
              &larr; Exit Admin
            </button>
          </div>
          <AdminPortal 
            onSelectDepartment={(dept) => {
              setAdminDepartment(dept);
              setCurrentPage('dashboard');
            }} 
          />
        </div>
      )}

      {currentPage === 'dashboard' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc' }}>
          <div style={{ padding: '20px', backgroundColor: '#1a202c', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Admin Dashboard {adminDepartment ? `- ${adminDepartment}` : ''}</h2>
            <button 
              onClick={() => setCurrentPage('admin-portal')}
              style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
            >
              Change Department
            </button>
          </div>
          <Dashboard filter={adminDepartment || 'All'} />
        </div>
      )}
    </div>
  );
}

export default App;
