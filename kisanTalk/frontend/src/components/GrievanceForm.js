import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiMic, FiStopCircle, FiCheck, FiSend, FiX, FiCopy, FiPlay, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { useLanguage } from '../LanguageContext';
import { categorizeGrievance } from '../utils/categorization';

const GrievanceForm = ({ onCancel, onSuccess }) => {
  const { t, language } = useLanguage();

  const [view, setView] = useState('form'); // 'form', 'review', 'status', 'success'

  const [formData, setFormData] = useState({
    farmerName: '',
    phone: '',
    village: '',
    district: '',
    title: '',
    description: '',
    category: 'Other'
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null); // { id: 'GRV123', status: 'Pending' }

  // Status Check State
  const [statusCheckData, setStatusCheckData] = useState({ phone: '', id: '' });
  const [statusResult, setStatusResult] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const [mimeType, setMimeType] = useState('audio/wav');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Automatically categorize based on description
    if (name === 'description' || name === 'title') {
      const fullText = (updatedForm.title + ' ' + updatedForm.description).trim();
      if (fullText) {
        const autoCategory = categorizeGrievance(fullText);
        updatedForm.category = autoCategory;
      }
    }

    setFormData(updatedForm);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    const langMap = { en: 'en-US', hi: 'hi-IN', pa: 'pa-IN', ta: 'ta-IN' };
    recognition.lang = langMap[language] || 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscriptChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptChunk += transcriptPart + ' ';
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(prev => {
        const finalCombined = (prev + finalTranscriptChunk).trim();
        setInterimText(interimTranscript);
        const displayText = (finalCombined + ' ' + interimTranscript).trim();

        // Auto-categorize based on title and description
        const fullTextWithTitle = (formData.title + ' ' + displayText).trim();
        const autoCategory = categorizeGrievance(fullTextWithTitle);

        setFormData(prevData => ({
          ...prevData,
          description: displayText,
          category: autoCategory
        }));
        return finalCombined;
      });
    };

    recognition.start();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine supported mime type
      const supportedType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/wav';
      setMimeType(supportedType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: supportedType });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      startSpeechRecognition(); // Start STT

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    // Voice Confirmation Loop: Go to Review View
    setView('review');
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setTranscript('');
    setFormData(prev => ({ ...prev, description: '' }));
    setRecordingTime(0);
    setView('form'); // Go back to form
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Handle both form submit and manual click
    setIsSubmitting(true);

    const data = new FormData();
    data.append('farmerName', formData.farmerName);
    data.append('phone', formData.phone);
    data.append('village', formData.village);
    data.append('district', formData.district);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('language', language); // Add language for LLM processing

    if (audioBlob) {
      // Use correct extension based on mime type
      const extension = mimeType.includes('webm') ? 'webm' : 'wav';
      data.append('voiceFile', audioBlob, `grievance_voice_note.${extension}`);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/grievances', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Instead of alert, set submission result to show ID
      setSubmissionResult({
        id: response.data.id,
        status: response.data.status || 'Pending'
      });

    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit grievance. Please try again.");
      setIsSubmitting(false); // Only re-enable if failed
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Status Check Function
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setIsCheckingStatus(true);
    try {
      const response = await axios.get('http://localhost:5000/api/grievances/status', {
        params: statusCheckData
      });
      setStatusResult(response.data);

      // Voice Output of Status
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Your grievance status is ${response.data.status}. Resolution: ${response.data.resolution}`;
      window.speechSynthesis.speak(msg);

    } catch (error) {
      alert(error.response?.data?.message || 'Error fetching status');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // If submitted successfully, show the success view with ID
  if (submissionResult) {
    return (
      <div className="card" style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f0fff4',
        border: '2px solid #48bb78'
      }}>
        <div style={{
          width: '80px', height: '80px',
          backgroundColor: '#48bb78',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'white', fontSize: '40px'
        }}>
          <FiCheck />
        </div>
        <h2 style={{ color: '#2f855a', marginBottom: '10px' }}>Complaint Registered!</h2>
        <p style={{ fontSize: '18px', color: '#4a5568', marginBottom: '30px' }}>
          Your grievance has been successfully submitted.
        </p>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          border: '1px dashed #48bb78',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#718096', marginBottom: '5px', fontSize: '14px' }}>COMPLAINT ID</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '32px', color: '#2d3748', margin: 0 }}>{submissionResult.id}</h3>
            <button
              onClick={() => copyToClipboard(submissionResult.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4299e1' }}
              title="Copy ID"
            >
              <FiCopy size={20} />
            </button>
          </div>
          <p style={{ fontSize: '14px', color: '#718096', marginTop: '10px' }}>
            Please save this ID to track your complaint status.
          </p>
        </div>

        <button
          onClick={() => {
            if (onSuccess) onSuccess();
          }}
          style={{
            backgroundColor: '#48bb78',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            fontSize: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Review View
  if (view === 'review') {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '30px' }}>
        <h2 style={{ color: '#2c5282', marginBottom: '20px' }}>Review Your Recording</h2>

        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '10px' }}>
          {audioBlob && (
            <audio controls src={URL.createObjectURL(audioBlob)} style={{ width: '100%', marginBottom: '15px' }} />
          )}
          <div style={{ textAlign: 'left', maxHeight: '200px', overflowY: 'auto', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '5px' }}>
            <p style={{ color: '#718096', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>TRANSCRIPT:</p>
            <p>{transcript || "No speech detected. You can submit the audio anyway."}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            onClick={clearRecording}
            style={{
              backgroundColor: '#e53e3e', color: 'white', border: 'none',
              padding: '12px 25px', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            <FiRefreshCw /> Re-record
          </button>

          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            style={{
              backgroundColor: '#48bb78', color: 'white', border: 'none',
              padding: '12px 25px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'} <FiCheck />
          </button>
        </div>
      </div>
    );
  }

  // Status Check View
  if (view === 'status') {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', padding: '30px' }}>
        <button
          onClick={() => setView('form')}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#a0aec0' }}
        >
          <FiX />
        </button>

        <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '30px' }}>Check Complaint Status</h2>

        <form onSubmit={handleCheckStatus}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>Phone Number</label>
            <input
              type="tel"
              value={statusCheckData.phone}
              onChange={(e) => setStatusCheckData({ ...statusCheckData, phone: e.target.value })}
              placeholder="Enter registered phone number"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
            />
          </div>
          <div style={{ textAlign: 'center', margin: '10px 0', color: '#a0aec0' }}>- OR -</div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>Complaint ID</label>
            <input
              type="text"
              value={statusCheckData.id}
              onChange={(e) => setStatusCheckData({ ...statusCheckData, id: e.target.value })}
              placeholder="e.g. GRV001"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
            />
          </div>

          <button
            type="submit"
            disabled={isCheckingStatus}
            style={{
              width: '100%', backgroundColor: '#4299e1', color: 'white', border: 'none',
              padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            {isCheckingStatus ? 'Checking...' : 'Check Status'} <FiSearch />
          </button>
        </form>

        {statusResult && (
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ebf8ff', borderRadius: '10px', border: '1px solid #bee3f8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#2c5282' }}>{statusResult.id}</span>
              <span className={`badge badge-${statusResult.status.toLowerCase().replace(' ', '-')}`}>{statusResult.status}</span>
            </div>
            <p style={{ color: '#4a5568' }}><strong>Resolution:</strong> {statusResult.resolution}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      <button
        onClick={onCancel}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#a0aec0'
        }}
      >
        <FiX />
      </button>

      <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '30px', fontSize: '28px' }}>
        {t.registerGrievance}
      </h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setView('status')}
          style={{
            background: 'none', border: '1px solid #4299e1', color: '#4299e1',
            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px',
            display: 'inline-flex', alignItems: 'center', gap: '5px'
          }}
        >
          <FiSearch /> Check Status
        </button>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Section 1: Farmer Details */}
        <div style={{
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '20px'
        }}>
          <h3 style={{
            color: '#2c5282',
            fontSize: '18px',
            marginBottom: '15px',
            borderLeft: '4px solid #4299e1',
            paddingLeft: '10px'
          }}>
            {t.farmerDetails || 'Farmer Details'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label htmlFor="farmerName" style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>{t.farmerName || 'Name'}</label>
              <input
                type="text"
                name="farmerName"
                value={formData.farmerName}
                onChange={handleChange}
                required
                id="farmerName"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
                placeholder={t.farmerNamePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>{t.phone || 'Phone Number'}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                id="phone"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
                placeholder={t.phonePlaceholder}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label htmlFor="village" style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>{t.village || 'Village'}</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
                id="village"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
                placeholder={t.villagePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="district" style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>{t.district || 'District'}</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                id="district"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
                placeholder={t.districtPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Grievance Details */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            color: '#2c5282',
            fontSize: '18px',
            marginBottom: '15px',
            borderLeft: '4px solid #4299e1',
            paddingLeft: '10px'
          }}>
            {t.grievanceDetails || 'Grievance Details'}
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>{t.category || 'Category'}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              id="category"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
            >
              <option value="Other">{t.selectCategory}</option>
              <option value="Crop Disease">{t.cropDisease}</option>
              <option value="Irrigation Issue">{t.irrigationIssue}</option>
              <option value="Subsidy/Scheme">{t.subsidy}</option>
              <option value="Seeds/Fertilizers">{t.seeds}</option>
              <option value="Equipment Issue">{t.equipment}</option>
              <option value="Market Access">{t.marketAccess}</option>
              <option value="Other">{t.other}</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>{t.title || 'Title'}</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              id="title"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }}
              placeholder={t.titlePlaceholder}
            />
          </div>

          {/* Voice Recording Section */}
          <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '10px', border: '1px dashed #a0aec0' }}>
            <label style={{ display: 'block', marginBottom: '15px', color: '#2d3748', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiMic /> {t.voiceRecording} (Optional)
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {!isRecording && !audioBlob && (
                <button
                  type="button"
                  onClick={startRecording}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: '#e53e3e', color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: '30px', cursor: 'pointer',
                    fontWeight: 'bold', boxShadow: '0 4px 6px rgba(229, 62, 62, 0.3)'
                  }}
                >
                  <FiMic /> {t.startRecording}
                </button>
              )}

              {isRecording && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '12px', height: '12px', backgroundColor: '#e53e3e',
                    borderRadius: '50%', animation: 'pulse 1s infinite'
                  }}></div>
                  <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>{t['Recording...']} {formatTime(recordingTime)}</span>
                  <button
                    type="button"
                    onClick={stopRecording}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      backgroundColor: '#2d3748', color: 'white', border: 'none',
                      padding: '8px 16px', borderRadius: '20px', cursor: 'pointer'
                    }}
                  >
                    <FiStopCircle /> {t.stopRecording}
                  </button>
                </div>
              )}

              {audioBlob && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ color: '#48bb78', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FiCheck /> {t.audioRecorded}
                  </span>
                  <button
                    type="button"
                    onClick={() => setView('review')}
                    style={{
                      backgroundColor: '#4299e1', color: 'white', border: 'none',
                      padding: '5px 15px', borderRadius: '15px', cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    Review Recording
                  </button>
                  <button
                    type="button"
                    onClick={clearRecording}
                    style={{
                      color: '#e53e3e', background: 'none', border: '1px solid #e53e3e',
                      padding: '5px 10px', borderRadius: '15px', cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p style={{ marginTop: '10px', fontSize: '13px', color: '#718096' }}>
              {t.voiceTip}
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>{t.description || 'Description'}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              id="description"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', resize: 'vertical' }}
              placeholder={t.descriptionPlaceholder}
            />
            {isRecording && (
              <p style={{ fontSize: '12px', color: '#4299e1', marginTop: '5px' }}>
                {interimText ? `Live: ${interimText}` : 'Listening...'}
              </p>
            )}
          </div>

        </div> {/* End of Grievance Details Section */}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: '#cbd5e0', color: '#4a5568', border: 'none',
              padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: '#4299e1', color: 'white', border: 'none',
              padding: '12px 30px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Submitting...' : t.submit} <FiSend />
          </button>
        </div>
      </form>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GrievanceForm;
