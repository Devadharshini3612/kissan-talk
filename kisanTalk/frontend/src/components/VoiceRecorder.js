import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiMic, FiStopCircle, FiPhone, FiPhoneOff, FiUser, FiGlobe } from 'react-icons/fi';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import { categorizeGrievance } from '../utils/categorization';

const VoiceRecorder = ({ onGrievanceSubmitted }) => {
  const { t, setLanguage } = useLanguage();
  
  // Call States: 'DIALING' -> 'CONNECTED_LANGUAGE' -> 'CONNECTED_RECORDING' -> 'PROCESSING' -> 'COMPLETED'
  const [callState, setCallState] = useState('DIALING');
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [callTimer, setCallTimer] = useState(0);
  const [sttStatus, setSttStatus] = useState('');
  const [complaintId, setComplaintId] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const sttRestartTimerRef = useRef(null);
  const lastResultTimeRef = useRef(0);
  const voicesRef = useRef([]);

  const languageOptions = [
    { code: 'en', name: 'English', localName: 'English', key: '1' },
    { code: 'hi', name: 'Hindi', localName: 'हिन्दी', key: '2' },
    { code: 'pa', name: 'Punjabi', localName: 'ਪੰਜਾਬੀ', key: '3' },
    { code: 'ta', name: 'Tamil', localName: 'தமிழ்', key: '4' },
  ];

  // Start Call Timer
  useEffect(() => {
    if (callState !== 'DIALING' && callState !== 'COMPLETED') {
      timerRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  // Initial Dialing Effect
  useEffect(() => {
    if (callState === 'DIALING') {
      // Simulate connecting time
      const timer = setTimeout(() => {
        setCallState('CONNECTED_LANGUAGE');
        speak("Welcome to Kisan Helpline. Press 1 for English, 2 for Hindi, 3 for Punjabi, 4 for Tamil.");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [callState]);

  // Keypad Support for Language Selection
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (callState === 'CONNECTED_LANGUAGE') {
        const key = e.key;
        const langOption = languageOptions.find(l => l.key === key);
        if (langOption) {
          handleLanguageSelect(langOption.code);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [callState]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakInLanguage = (langCode, text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.95;
    msg.lang = langCode === 'ta' ? 'ta-IN' : langCode === 'hi' ? 'hi-IN' : langCode === 'pa' ? 'pa-IN' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang && (v.lang.toLowerCase() === msg.lang.toLowerCase() || v.lang.toLowerCase().startsWith(msg.lang.split('-')[0].toLowerCase())));
    if (voice) msg.voice = voice;
    window.speechSynthesis.speak(msg);
  };

  const playBeep = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800Hz beep
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3); // 300ms beep
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setLanguage(langCode);
    setCallState('CONNECTED_RECORDING');
    const promptText = langCode === 'ta' 
      ? 'பீப் வந்ததும் தமிழில் பேசுங்கள்.' 
      : langCode === 'hi' 
      ? 'बीप के बाद अपनी शिकायत बोलें।' 
      : langCode === 'pa' 
      ? 'ਬੀਪ ਤੋਂ ਬਾਦ ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਬੋਲੋ।' 
      : 'After the beep, please speak your complaint.';
    speakInLanguage(langCode, promptText);
    
    // Auto start recording after prompt (approx 3s)
    setTimeout(() => {
      playBeep(); // Play beep before recording
      setTimeout(() => startRecording(langCode), 500); // Small delay after beep start
    }, 4000);
  };

  const startRecording = async (currentLang) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        // We will process after transcript is done
      };

      mediaRecorder.start();
      setIsRecording(true);
      startSpeechRecognition(currentLang);
    } catch (error) {
      alert("Microphone Error");
    }
  };

  const startSpeechRecognition = (currentLang) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('Speech recognition not supported');
      setSttStatus('unsupported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // Use the passed language or fallback to state
    const langToUse = currentLang || selectedLanguage;
    
    recognition.lang = langToUse === 'hi' ? 'hi-IN' : 
                       langToUse === 'pa' ? 'pa-IN' : 
                       langToUse === 'ta' ? 'ta-IN' : 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      lastResultTimeRef.current = Date.now();
      setSttStatus('hearing');

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript += transcriptPart;
        }
      }
      
      const fullText = finalTranscript + interimTranscript;
      if (fullText.trim()) {
        setTranscript(fullText);
        setDescription(fullText.trim());
      }
      
      if (finalTranscript.trim()) {
        // Real-time categorization
        const autoCategory = categorizeGrievance(finalTranscript.trim());
        if (autoCategory && autoCategory !== 'Other') {
          setCategory(autoCategory);
        }
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        try {
          recognition.start();
          setSttStatus('restarting');
        } catch {}
      }
    };

    recognition.onerror = (e) => {
      if (isRecording) {
        try {
          recognition.stop();
          recognition.start();
          setSttStatus(`error:${e.error || 'unknown'}`);
        } catch {}
      }
    };

    recognition.start();
    setSttStatus('listening');

    lastResultTimeRef.current = Date.now();
    if (sttRestartTimerRef.current) clearInterval(sttRestartTimerRef.current);
    sttRestartTimerRef.current = setInterval(() => {
      if (!isRecording) return;
      const idleMs = Date.now() - lastResultTimeRef.current;
      if (idleMs > 5000 && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.start();
          lastResultTimeRef.current = Date.now();
        } catch {}
      }
    }, 5000);
  };

  const stopRecordingAndSubmit = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (sttRestartTimerRef.current) {
      clearInterval(sttRestartTimerRef.current);
      sttRestartTimerRef.current = null;
    }
    setIsRecording(false);
    setCallState('PROCESSING');
    
    // Auto-submit after a brief pause
    setTimeout(() => {
      submitGrievance();
    }, 1500);
  };

  const submitGrievance = async () => {
    const finalDescription = description || transcript || "";
    
    const formData = new FormData();
    formData.append('farmerName', 'Anonymous Farmer'); // Mock Data for "Immediate" feel
    formData.append('phone', '9999999999'); // Mock Data
    formData.append('village', 'Unknown');
    formData.append('district', 'Unknown');
    formData.append('title', 'Voice Helpline Complaint');
    formData.append('description', finalDescription);
    formData.append('language', selectedLanguage);
    
    // Auto-categorize fallback
    const finalCategory = category || categorizeGrievance(finalDescription) || 'Other';
    formData.append('category', finalCategory);

    if (audioBlob) {
      formData.append('voiceFile', audioBlob, 'helpline_record.wav');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/grievances', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newGrievanceId = response.data.id;
      setComplaintId(newGrievanceId);
      
      speak("Your complaint has been registered. Press any number to hear your Complaint ID.");
      setCallState('WAITING_FOR_ID');
      
    } catch (error) {
      speak("Sorry, there was an error registering your complaint.");
      setCallState('COMPLETED');
    }
  };
  
  // Handle "Press any key for ID"
  useEffect(() => {
    const handleAnyKey = (e) => {
      if (callState === 'WAITING_FOR_ID') {
        speak(`Your Complaint ID is ${complaintId.split('').join(' ')}`); // Read digits individually
        setCallState('COMPLETED');
        setTimeout(() => {
           onGrievanceSubmitted();
        }, 8000); // Give time to read ID
      }
    };

    if (callState === 'WAITING_FOR_ID') {
      window.addEventListener('keydown', handleAnyKey);
    }
    return () => window.removeEventListener('keydown', handleAnyKey);
  }, [callState, complaintId, onGrievanceSubmitted]);

  // --- Render Call UI ---

  return (
    <div className="card" style={{ 
      backgroundColor: '#1a202c', 
      color: 'white', 
      minHeight: '500px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '40px 20px',
      borderRadius: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      
      {/* Header / Caller Info */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          backgroundColor: '#4a5568', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px',
          border: '2px solid #718096'
        }}>
          <FiUser size={50} color="#cbd5e0" />
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>Kisan Helpline</h2>
        <p style={{ color: '#a0aec0', fontSize: '18px' }}>1800-KISAN-HELP</p>
        <div style={{ marginTop: '10px', fontSize: '16px', color: isRecording ? '#f56565' : '#48bb78' }}>
          {callState === 'DIALING' ? 'Dialing...' : formatTime(callTimer)}
        </div>
      </div>

      {/* Main Interaction Area */}
      <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        
        {callState === 'DIALING' && (
           <div className="loader" style={{ width: '40px', height: '40px', border: '4px solid #4a5568', borderTop: '4px solid #48bb78' }}></div>
        )}

        {callState === 'CONNECTED_LANGUAGE' && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <p style={{ marginBottom: '20px', color: '#e2e8f0' }}>Select Language (Press Number)</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  style={{
                    padding: '15px',
                    backgroundColor: '#2d3748',
                    border: '1px solid #4a5568',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    flexDirection: 'row', // Changed to row
                    alignItems: 'center',
                    justifyContent: 'flex-start', // Align left
                    gap: '15px'
                  }}
                >
                  <div style={{ 
                    backgroundColor: '#48bb78', 
                    color: 'white', 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {lang.key}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 'bold' }}>{lang.localName}</span>
                    <span style={{ fontSize: '12px', color: '#a0aec0' }}>{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {callState === 'CONNECTED_RECORDING' && (
          <div style={{ textAlign: 'center' }}>
            {isRecording ? (
              <>
                <div style={{ marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>
                   <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f56565', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                     <FiMic size={40} color="white" />
                   </div>
                </div>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>Listening...</p>
                <p style={{ fontSize: '14px', color: '#a0aec0' }}>{transcript || "Speak now..."}</p>
                {sttStatus && (
                  <p style={{ fontSize: '12px', color: '#718096', marginTop: '6px' }}>
                    {sttStatus === 'unsupported' ? 'Transcription not supported. Audio will be saved and auto-transcribed.' : sttStatus.startsWith('error') ? 'Speech engine error' : ''}
                  </p>
                )}
              </>
            ) : (
              <p>Preparing to record...</p>
            )}
          </div>
        )}

        {callState === 'PROCESSING' && (
           <div style={{ textAlign: 'center' }}>
             <div className="loader" style={{ margin: '0 auto 20px' }}></div>
             <p>Registering Complaint...</p>
           </div>
        )}

        {callState === 'WAITING_FOR_ID' && (
          <div style={{ textAlign: 'center', animation: 'pulse 2s infinite' }}>
            <h3 style={{ marginBottom: '10px', color: '#48bb78' }}>Complaint Registered!</h3>
            <p style={{ fontSize: '20px', color: 'white', fontWeight: 'bold' }}>
              Press ANY Number/Key to hear your Complaint ID
            </p>
          </div>
        )}

        {callState === 'COMPLETED' && complaintId && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '10px', color: '#48bb78' }}>ID: {complaintId}</h3>
            <p style={{ color: '#a0aec0' }}>Call Ended</p>
          </div>
        )}

        {callState === 'COMPLETED' && !complaintId && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '10px', color: '#f56565' }}>Call Ended</h3>
            <p style={{ color: '#a0aec0' }}>Thank you for calling</p>
          </div>
        )}

      </div>

      {/* Footer / Controls */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        {callState === 'CONNECTED_RECORDING' && isRecording && (
          <button 
            onClick={stopRecordingAndSubmit}
            style={{ 
              backgroundColor: '#f56565', 
              color: 'white', 
              border: 'none', 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
          >
            <FiStopCircle size={24} />
          </button>
        )}
        
        {(callState !== 'DIALING' && callState !== 'COMPLETED') && (
           <button 
             onClick={onGrievanceSubmitted} // Just hang up
             style={{ 
               backgroundColor: '#e53e3e', 
               color: 'white', 
               border: 'none', 
               padding: '15px 30px', 
               borderRadius: '30px', 
               fontSize: '18px',
               marginLeft: isRecording ? '20px' : '0',
               cursor: 'pointer'
             }}
           >
             <FiPhoneOff style={{ marginRight: '10px' }} /> End Call
           </button>
        )}

        {callState === 'COMPLETED' && (
           <button 
             onClick={onGrievanceSubmitted}
             style={{ 
               backgroundColor: '#48bb78', 
               color: 'white', 
               border: 'none', 
               padding: '15px 40px', 
               borderRadius: '30px', 
               fontSize: '18px',
               cursor: 'pointer'
             }}
           >
             Home
           </button>
        )}
      </div>

    </div>
  );
};

export default VoiceRecorder;
