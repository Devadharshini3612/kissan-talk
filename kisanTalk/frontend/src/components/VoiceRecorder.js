import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiMic, FiStopCircle, FiPhoneOff, FiUser } from 'react-icons/fi';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import { categorizeGrievance } from '../utils/categorization';

const VoiceRecorder = ({ onGrievanceSubmitted }) => {
  const { setLanguage } = useLanguage();
  
  // Call States: 'DIALING' -> 'CONNECTED_LANGUAGE' -> 'CONNECTED_RECORDING' -> 'WAITING_CONFIRMATION' -> 'PLAYING_RECORDING' -> 'PROCESSING' -> 'WAITING_FOR_ID' -> 'WAITING_END' -> 'COMPLETED'
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
  const [audioPlayer, setAudioPlayer] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const sttRestartTimerRef = useRef(null);
  const lastResultTimeRef = useRef(0);
  const voicesRef = useRef([]);

  // Language options - wrapped in useMemo to prevent re-renders
  const languageOptions = useMemo(() => [
    { code: 'en', name: 'English', localName: 'English', key: '1' },
    { code: 'hi', name: 'Hindi', localName: 'हिन्दी', key: '2' },
    { code: 'pa', name: 'Punjabi', localName: 'ਪੰਜਾਬੀ', key: '3' },
    { code: 'ta', name: 'Tamil', localName: 'தமிழ்', key: '4' },
  ], []);

  // Start Call Timer
  useEffect(() => {
    if (callState !== 'DIALING' && callState !== 'COMPLETED') {
      timerRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
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

  // Cleanup audio player when component unmounts or audioPlayer changes
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = '';
      }
    };
  }, [audioPlayer]);

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
  
  const speakComplaintId = (langCode, id) => {
    const locale = langCode === 'ta' ? 'ta-IN' : langCode === 'hi' ? 'hi-IN' : langCode === 'pa' ? 'pa-IN' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang && (v.lang.toLowerCase() === locale.toLowerCase() || v.lang.toLowerCase().startsWith(locale.split('-')[0].toLowerCase())));
    const prefixMap = {
      en: 'Your Complaint ID is',
      hi: 'आपकी शिकायत आईडी है',
      pa: 'ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਆਈਡੀ ਹੈ',
      ta: 'உங்கள் புகார் ஐடி'
    };
    const digitWords = {
      en: ['zero','one','two','three','four','five','six','seven','eight','nine'],
      hi: ['शून्य','एक','दो','तीन','चार','पांच','छह','सात','आठ','नौ'],
      pa: ['ਸਿਫ਼ਰ','ਇੱਕ','ਦੋ','ਤਿੰਨ','ਚਾਰ','ਪੰਜ','ਛੇ','ਸੱਤ','ਅੱਠ','ਨੌਂ'],
      ta: ['பூஜ்யம்','ஒன்று','இரண்டு','மூன்று','நான்கு','ஐந்து','ஆறு','ஏழு','எட்டு','ஒன்பது']
    };
    const prefixUtter = new SpeechSynthesisUtterance(prefixMap[langCode] || prefixMap.en);
    prefixUtter.rate = 0.9;
    prefixUtter.lang = locale;
    if (voice) prefixUtter.voice = voice;
    window.speechSynthesis.speak(prefixUtter);
    const chars = String(id).split('');
    chars.forEach(ch => {
      const isDigit = /\d/.test(ch);
      const token = isDigit ? (digitWords[langCode] || digitWords.en)[Number(ch)] : ch.toUpperCase();
      const u = new SpeechSynthesisUtterance(token);
      u.rate = 0.9;
      u.lang = locale;
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
    });
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

  // Start recording function
  const startRecording = async (currentLang) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use supported audio format - webm with opus codec is widely supported
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // Create blob with the same format as recorded
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
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

  // Handle language selection - wrapped in useCallback to prevent re-renders
  const handleLanguageSelect = useCallback((langCode) => {
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
  }, [setLanguage]);

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
  }, [callState, handleLanguageSelect, languageOptions]);

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
    const langMap = { en: 'en-US', hi: 'hi-IN', pa: 'pa-IN', ta: 'ta-IN' };
    recognition.lang = langMap[langToUse] || 'en-US';

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
    setCallState('WAITING_CONFIRMATION');
    
    // Ask user to confirm recording
    const promptText = selectedLanguage === 'ta' 
      ? 'வைக்கும் பின் உங்கள் புகாரை கேட்க 1 ஐ அழுத்தவும்.' 
      : selectedLanguage === 'hi' 
      ? 'कृपया 1 दबाकर अपनी शिकायत सुनें।' 
      : selectedLanguage === 'pa' 
      ? 'ਕਿਰਪਾ ਕਰਕੇ 1 ਦਬਾਓ ਅਤੇ ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਸੁਣੋ।' 
      : 'Please press 1 to hear your recorded complaint.';
    speakInLanguage(selectedLanguage, promptText);
  };

  const submitGrievance = useCallback(async () => {
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
  }, [description, transcript, category, selectedLanguage, audioBlob]);
  
  // Function to play recorded audio
  const playRecording = useCallback(async () => {
    if (audioBlob) {
      // Stop any ongoing speech synthesis to avoid audio conflicts
      window.speechSynthesis.cancel();
      
      try {
        // Create a new AudioContext and resume it (needed for modern browsers)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.resume();
        
        const player = new Audio(URL.createObjectURL(audioBlob));
        setAudioPlayer(player);
        
        player.onended = () => {
          // After playback completes, move to processing
          setCallState('PROCESSING');
          // Auto-submit after a brief pause
          setTimeout(() => {
            submitGrievance();
          }, 1500);
          // Clean up the object URL to prevent memory leaks
          URL.revokeObjectURL(player.src);
        };
        
        player.onerror = (error) => {
          console.error('Audio playback error:', error);
          setCallState('PROCESSING');
          setTimeout(() => submitGrievance(), 1500);
          // Clean up the object URL
          URL.revokeObjectURL(player.src);
        };
        
        // Set audio volume to maximum for better hearing
        player.volume = 1.0;
        
        // Play the audio and wait for it to start
        await player.play();
        console.log('Audio playback started successfully');
        
      } catch (error) {
        console.error('Error playing audio:', error);
        // If playback fails, try a different approach
        try {
          // Create a new audio element with direct source
          const audioElement = document.createElement('audio');
          audioElement.src = URL.createObjectURL(audioBlob);
          audioElement.volume = 1.0;
          audioElement.onended = () => {
            setCallState('PROCESSING');
            setTimeout(() => submitGrievance(), 1500);
            URL.revokeObjectURL(audioElement.src);
          };
          
          // Directly call play() without await
          audioElement.play();
          setAudioPlayer(audioElement);
        } catch (fallbackError) {
          console.error('Fallback audio playback failed:', fallbackError);
          // If all playback methods fail, just proceed with submission
          setCallState('PROCESSING');
          setTimeout(() => submitGrievance(), 1500);
        }
      }
    } else {
      // If no audio, proceed to processing
      setCallState('PROCESSING');
      setTimeout(() => submitGrievance(), 1500);
    }
  }, [audioBlob, submitGrievance]);

  // Handle key presses for different call states
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Handle confirmation state (press 1 to hear recording, any other key to continue without playback)
      if (callState === 'WAITING_CONFIRMATION') {
        if (e.key === '1') {
          setCallState('PLAYING_RECORDING');
          playRecording();
        } else {
          // If any other key is pressed, skip playback and proceed to processing
          setCallState('PROCESSING');
          setTimeout(() => submitGrievance(), 1500);
        }
      }
      // Handle ID state (press any key to hear ID)
      else if (callState === 'WAITING_FOR_ID') {
        speakComplaintId(selectedLanguage, complaintId);
        setCallState('WAITING_END');
        const endPrompt = selectedLanguage === 'ta' 
          ? 'காலை கடைப்பிடிக்க ஏதேனும் ஒரு விசையையும் அழுத்தவும். மேலும் அழைப்பதற்கு 1 ஐ அழுத்தவும். Tamil.' 
          : selectedLanguage === 'hi' 
          ? 'कॉल समाप्त करने के लिए कोई भी कुंजी दबाएं। और बात करने के लिए 1 दबाएं। Hindi.' 
          : selectedLanguage === 'pa' 
          ? 'ਕਾਲ ਖਤਮ ਕਰਨ ਲਈ ਕੋਈ ਵੀ ਬਟਨ ਦਬਾਓ। ਹੋਰ ਗੱਲ ਕਰਨ ਲਈ 1 ਦਬਾਓ। Punjabi.' 
          : 'Press any key to end the call. Press 1 to continue the call. English.';
        const approxDelay = 2500 + String(complaintId).length * 700;
        setTimeout(() => speakInLanguage(selectedLanguage, endPrompt), approxDelay);
      }
      // Handle end state (press any key to end, press 1 to continue)
      else if (callState === 'WAITING_END') {
        if (e.key === '1') {
          // Restart the call
          setCallState('DIALING');
          setCallTimer(0);
          setTranscript('');
          setDescription('');
          setCategory('');
          setComplaintId('');
          setAudioBlob(null);
        } else {
          // End the call
          setCallState('COMPLETED');
          setTimeout(() => {
            onGrievanceSubmitted();
          }, 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [callState, complaintId, selectedLanguage, onGrievanceSubmitted, playRecording, submitGrievance]);

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

        {callState === 'WAITING_CONFIRMATION' && (
          <div style={{ textAlign: 'center', animation: 'pulse 2s infinite' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#4299e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <FiUser size={40} color="white" />
              </div>
            </div>
            <h3 style={{ marginBottom: '10px', color: '#4299e1' }}>Recording Complete!</h3>
            <p style={{ fontSize: '18px', marginBottom: '15px' }}>Press 1 to hear your recorded complaint</p>
            <p style={{ fontSize: '14px', color: '#a0aec0' }}>After hearing, your complaint will be registered automatically</p>
          </div>
        )}

        {callState === 'PLAYING_RECORDING' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px', animation: 'pulse 1s infinite' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#48bb78', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <FiMic size={40} color="white" />
              </div>
            </div>
            <h3 style={{ marginBottom: '10px', color: '#48bb78' }}>Playing Recording...</h3>
            <p style={{ fontSize: '16px', color: '#a0aec0' }}>Please listen to your recorded complaint</p>
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

        {callState === 'WAITING_END' && (
          <div style={{ textAlign: 'center', animation: 'pulse 2s infinite' }}>
            <h3 style={{ marginBottom: '10px', color: '#48bb78' }}>Call Options</h3>
            <p style={{ fontSize: '18px', marginBottom: '15px' }}>Press 1 to continue the call</p>
            <p style={{ fontSize: '16px', color: '#a0aec0' }}>Press any other key to end the call</p>
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
