export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  hi: { name: 'हिंदी', flag: '🇮🇳' },
  bn: { name: 'বাংলা', flag: '🇮🇳' },
  brx: { name: 'बोड़ो', flag: '🇮🇳' },
  doi: { name: 'डोगरी', flag: '🇮🇳' },
  gu: { name: 'ગુજરાતી', flag: '🇮🇳' },
  kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ks: { name: 'कश्मीरी', flag: '🇮🇳' },
  kok: { name: 'कोंकणी', flag: '🇮🇳' },
  mai: { name: 'मैथिली', flag: '🇮🇳' },
  ml: { name: 'മലയാളം', flag: '🇮🇳' },
  mni: { name: 'मणिपुरी', flag: '🇮🇳' },
  mr: { name: 'मराठी', flag: '🇮🇳' },
  ne: { name: 'नेपाली', flag: '🇮🇳' },
  or: { name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  pa: { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  sa: { name: 'संस्कृत', flag: '🇮🇳' },
  sat: { name: 'संताली', flag: '🇮🇳' },
  sd: { name: 'सिन्धी', flag: '🇮🇳' },
  as: { name: 'অসমীয়া', flag: '🇮🇳' },
  ta: { name: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'తెలుగు', flag: '🇮🇳' },
  ur: { name: 'اردو', flag: '🇮🇳' },
  es: { name: 'Español', flag: '🇪🇸' }
};

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    grievances: 'Grievances',
    dashboard: 'Dashboard',
    language: 'Language',
    
    // Home Page
    title: '🌾 KisanTalk',
    subtitle: 'Voice-Based Farmers\' Grievance Management System',
    description: 'Empowering farmers with a simple, accessible solution to voice their concerns',
    registerBtn: 'Register Your Grievance',
    
    // Features
    voiceRecording: 'Voice Recording',
    voiceDesc: 'Record your grievance in your own voice for better clarity and authenticity',
    tracking: 'Real-time Tracking',
    trackingDesc: 'Track the status of your grievance from submission to resolution',
    resolution: 'Quick Resolution',
    resolutionDesc: 'Get faster resolutions through our efficient admin dashboard system',
    
    // Form
    registerGrievance: 'Register Your Grievance',
    farmerName: 'Farmer Name',
    farmerNamePlaceholder: 'Enter your full name',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter 10-digit phone number',
    village: 'Village',
    villagePlaceholder: 'Enter your village name',
    district: 'District',
    districtPlaceholder: 'Enter your district',
    category: 'Grievance Category',
    selectCategory: 'Select a category',
    title: 'Grievance Title',
    titlePlaceholder: 'Brief title of your grievance',
    description: 'Description',
    descriptionPlaceholder: 'Provide more details about your issue (or use voice recording)',
    voiceTip: '💡 Tip: Record your voice to auto-fill this field!',
    voiceRecording: '🎤 Voice Recording',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    audioRecorded: '✓ Audio recorded',
    submit: 'Submit Grievance',
    
    // Speech recognition feedback
    'Recording...': 'Recording...',
    'Text:': 'Text:',
    'Interim:': 'Interim:',
    'Successfully transcribed!': 'Successfully transcribed!',
    'Listening... Speak now!': 'Listening... Speak now!',
    
    // Categories
    cropDisease: 'Crop Disease',
    irrigationIssue: 'Irrigation Issue',
    subsidy: 'Subsidy/Scheme',
    seeds: 'Seeds/Fertilizers',
    equipment: 'Equipment Issue',
    marketAccess: 'Market Access',
    other: 'Other',
    
    // Grievance List
    grievanceRecords: 'Grievance Records',
    selectGrievance: 'Select a grievance to view details',
    farmerDetails: 'FARMER DETAILS',
    statusPriority: 'STATUS & PRIORITY',
    resolution: 'RESOLUTION',
    
    // Dashboard
    adminDashboard: 'Admin Dashboard',
    totalGrievances: 'Total Grievances',
    pending: 'Pending',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    highPriority: 'High Priority',
    filterByStatus: 'Filter by Status',
    grievanceID: 'Grievance ID',
    name: 'Farmer Name',
    action: 'Action',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    
    // Status
    statusPending: 'Pending',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    
    // Messages
    successSubmit: 'Grievance submitted successfully!',
    errorSubmit: 'Error submitting grievance: ',
    successUpdate: 'Grievance updated successfully!',
    errorUpdate: 'Error updating grievance',
    required: 'This field is required',
    microphoneError: 'Microphone access denied. Please enable microphone permissions.',
  },
  
  hi: {
    // Navigation
    home: 'होम',
    grievances: 'शिकायतें',
    dashboard: 'डैशबोर्ड',
    language: 'भाषा',
    
    // Home Page
    title: '🌾 किसानटॉक',
    subtitle: 'आवाज-आधारित किसान शिकायत प्रबंधन प्रणाली',
    description: 'किसानों को अपनी चिंताओं को व्यक्त करने के लिए एक सरल, सुलभ समाधान',
    registerBtn: 'अपनी शिकायत दर्ज करें',
    
    // Features
    voiceRecording: 'आवाज रिकॉर्डिंग',
    voiceDesc: 'बेहतर स्पष्टता के लिए अपनी आवाज में शिकायत दर्ज करें',
    tracking: 'रीयल-टाइम ट्रैकिंग',
    trackingDesc: 'अपनी शिकायत की स्थिति ट्रैक करें',
    resolution: 'तेजी से समाधान',
    resolutionDesc: 'हमारे प्रभावी डैशबोर्ड सिस्टम के माध्यम से तेजी से समाधान प्राप्त करें',
    
    // Form
    registerGrievance: 'अपनी शिकायत दर्ज करें',
    farmerName: 'किसान का नाम',
    farmerNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
    phone: 'फोन नंबर',
    phonePlaceholder: '10 अंकों का फोन नंबर दर्ज करें',
    village: 'गाँव',
    villagePlaceholder: 'अपने गाँव का नाम दर्ज करें',
    district: 'जिला',
    districtPlaceholder: 'अपना जिला दर्ज करें',
    category: 'शिकायत की श्रेणी',
    selectCategory: 'एक श्रेणी चुनें',
    title: 'शिकायत का शीर्षक',
    titlePlaceholder: 'अपनी शिकायत का संक्षिप्त शीर्षक',
    description: 'विवरण',
    descriptionPlaceholder: 'अपनी समस्या के बारे में अधिक जानकारी दें',
    voiceTip: '💡 टिप: अपनी आवाज रिकॉर्ड करें ताकि यह स्वचालित रूप से भर जाए!',
    voiceRecording: '🎤 आवाज रिकॉर्डिंग',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    audioRecorded: '✓ ऑडियो रिकॉर्ड किया गया',
    submit: 'शिकायत दर्ज करें',
    
    // Speech recognition feedback
    'Recording...': 'रिकॉर्डिंग...',
    'Text:': 'पाठ:',
    'Interim:': 'अंतरिम:',
    'Successfully transcribed!': 'सफलतापूर्वक ट्रांसक्राइब किया गया!',
    'Listening... Speak now!': 'सुन रहे हैं... अब बोलें!',
    
    // Categories
    cropDisease: 'फसल रोग',
    irrigationIssue: 'सिंचाई समस्या',
    subsidy: 'सब्सिडी/योजना',
    seeds: 'बीज/खाद',
    equipment: 'उपकरण समस्या',
    marketAccess: 'बाजार पहुंच',
    other: 'अन्य',
    
    // Grievance List
    grievanceRecords: 'शिकायत रिकॉर्ड',
    selectGrievance: 'विवरण देखने के लिए शिकायत चुनें',
    farmerDetails: 'किसान की जानकारी',
    statusPriority: 'स्थिति और प्राथमिकता',
    resolution: 'समाधान',
    
    // Dashboard
    adminDashboard: 'प्रशासक डैशबोर्ड',
    totalGrievances: 'कुल शिकायतें',
    pending: 'लंबित',
    inProgress: 'प्रक्रिया में',
    resolved: 'समाधान',
    highPriority: 'उच्च प्राथमिकता',
    filterByStatus: 'स्थिति के आधार पर फ़िल्टर करें',
    grievanceID: 'शिकायत ID',
    name: 'किसान का नाम',
    action: 'कार्रवाई',
    edit: 'संपादित करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    
    // Status
    statusPending: 'लंबित',
    statusInProgress: 'प्रक्रिया में',
    statusResolved: 'समाधान',
    priorityHigh: 'उच्च',
    priorityMedium: 'मध्यम',
    priorityLow: 'कम',
    
    // Messages
    successSubmit: 'शिकायत सफलतापूर्वक दर्ज की गई!',
    errorSubmit: 'शिकायत दर्ज करने में त्रुटि: ',
    successUpdate: 'शिकायत सफलतापूर्वक अपडेट की गई!',
    errorUpdate: 'शिकायत अपडेट करने में त्रुटि',
    required: 'यह फील्ड आवश्यक है',
    microphoneError: 'माइक्रोफोन एक्सेस अनुमति नहीं। कृपया माइक्रोफोन अनुमति सक्षम करें।',
  },
  
  pa: {
    // Navigation
    home: 'ਹੋਮ',
    grievances: 'ਸ਼ਿਕਾਇਤਾਂ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    language: 'ਭਾਸ਼ਾ',
    
    // Home Page
    title: '🌾 ਕਿਸਾਨਟਾਕ',
    subtitle: 'ਆਵਾਜ-ਆਧਾਰਿਤ ਕਿਸਾਨ ਸ਼ਿਕਾਇਤ ਪ੍ਰਬੰਧਨ ਸਿਸਟਮ',
    description: 'ਕਿਸਾਨਾਂ ਨੂੰ ਆਪਣੀਆਂ ਚਿੰਤਾਵਾਂ ਪ੍ਰਗਟ ਕਰਨ ਲਈ ਇੱਕ ਸਧਾਰਨ, ਪਹੁੰਚਯੋਗ ਹੱਲ',
    registerBtn: 'ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    
    // Features
    voiceRecording: 'ਆਵਾਜ ਰਿਕਾਰਡਿੰਗ',
    voiceDesc: 'ਬਿਹਤਰ ਸਪਸ਼ਟਤਾ ਲਈ ਆਪਣੀ ਆਵਾਜ ਵਿੱਚ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    tracking: 'ਰੀਅਲ-ਟਾਈਮ ਟ੍ਰੈਕਿੰਗ',
    trackingDesc: 'ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਦੀ ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ',
    resolution: 'ਤੇਜ਼ ਹੱਲ',
    resolutionDesc: 'ਆਮ ਡੈਸ਼ਬੋਰਡ ਸਿਸਟਮ ਦੁਆਰਾ ਤੇਜ਼ ਹੱਲ ਪ੍ਰਾਪਤ ਕਰੋ',
    
    // Form
    registerGrievance: 'ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    farmerName: 'ਕਿਸਾਨ ਦਾ ਨਾਮ',
    farmerNamePlaceholder: 'ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ',
    phone: 'ਫੋਨ ਨੰਬਰ',
    phonePlaceholder: '10 ਅੰਕਾਂ ਦਾ ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ',
    village: 'ਪਿੰਡ',
    villagePlaceholder: 'ਆਪਣੇ ਪਿੰਡ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ',
    district: 'ਜ਼ਿਲ਼ਾ',
    districtPlaceholder: 'ਆਪਣਾ ਜ਼ਿਲ਼ਾ ਦਰਜ ਕਰੋ',
    category: 'ਸ਼ਿਕਾਇਤ ਦੀ ਸ਼੍ਰੇਣੀ',
    selectCategory: 'ਇੱਕ ਸ਼੍ਰੇਣੀ ਚੁਣੋ',
    title: 'ਸ਼ਿਕਾਇਤ ਦਾ ਸਿਰਲੇਖ',
    titlePlaceholder: 'ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਦਾ ਸਰਲ ਸਿਰਲੇਖ',
    description: 'ਵੇਰਵਾ',
    descriptionPlaceholder: 'ਆਪਣੀ ਸਮੱਸਿਆ ਬਾਰੇ ਹੋਰ ਜਾਣਕਾਰੀ ਦਿਓ',
    voiceTip: '💡 ਸੁਝਾਅ: ਆਪਣੀ ਆਵਾਜ ਰਿਕਾਰਡ ਕਰੋ ਤਾਂ ਜੋ ਇਹ ਸਵੈਚਲਿਤ ਤੌਰ ਤੇ ਭਰ ਜਾਵੇ!',
    voiceRecording: '🎤 ਆਵਾਜ ਰਿਕਾਰਡਿੰਗ',
    startRecording: 'ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
    stopRecording: 'ਰਿਕਾਰਡਿੰਗ ਬੰਦ ਕਰੋ',
    audioRecorded: '✓ ਆਡੀਓ ਰਿਕਾਰਡ ਕੀਤਾ ਗਿਆ',
    submit: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    
    // Speech recognition feedback
    'Recording...': 'ਰਿਕਾਰਡਿੰਗ...',
    'Text:': 'ਲਿਖਤ:',
    'Interim:': 'ਆਂਤਰਿਕ:',
    'Successfully transcribed!': 'ਸਫਲਤਾ ਨਾਲ ਲਿਪਿ ਬਦਲਿਆ ਗਿਆ!',
    'Listening... Speak now!': 'ਸੁਣ ਰਹੇ ਹਾਂ... ਹੁਣ ਬੋਲੋ!',
    
    // Categories
    cropDisease: 'ਫਸਲ ਦੀ ਬਿਮਾਰੀ',
    irrigationIssue: 'ਸਿੰਚਾਈ ਸਮੱਸਿਆ',
    subsidy: 'ਸਹਾਇਤਾ/ਯੋਜਨਾ',
    seeds: 'ਬੀਜ/ਖਾਦ',
    equipment: 'ਸਾਧਨ ਸਮੱਸਿਆ',
    marketAccess: 'ਮਾਰਕਿਟ ਪਹੁੰਚ',
    other: 'ਹੋਰ',
    
    // Grievance List
    grievanceRecords: 'ਸ਼ਿਕਾਇਤ ਰਿਕਾਰਡ',
    selectGrievance: 'ਵੇਰਵਾ ਦੇਖਣ ਲਈ ਸ਼ਿਕਾਇਤ ਚੁਣੋ',
    farmerDetails: 'ਕਿਸਾਨ ਦੀ ਜਾਣਕਾਰੀ',
    statusPriority: 'ਸਥਿਤੀ ਅਤੇ ਤਰਜੀਹ',
    resolution: 'ਹੱਲ',
    
    // Dashboard
    adminDashboard: 'ਅਡਮਿਨ ਡੈਸ਼ਬੋਰਡ',
    totalGrievances: 'ਕੁੱਲ ਸ਼ਿਕਾਇਤਾਂ',
    pending: 'ਲੰਬਤ',
    inProgress: 'ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ',
    resolved: 'ਹੱਲ',
    highPriority: 'ਉੱਚ ਤਰਜੀਹ',
    filterByStatus: 'ਸਥਿਤੀ ਦੁਆਰਾ ਫਿਲਟਰ ਕਰੋ',
    grievanceID: 'ਸ਼ਿਕਾਇਤ ID',
    name: 'ਕਿਸਾਨ ਦਾ ਨਾਮ',
    action: 'ਕਾਰਵਾਈ',
    edit: 'ਸੰਪਾਦਿਤ ਕਰੋ',
    save: 'ਸੁਰੱਖਿਅਤ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    
    // Status
    statusPending: 'ਲੰਬਤ',
    statusInProgress: 'ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ',
    statusResolved: 'ਹੱਲ',
    priorityHigh: 'ਉੱਚ',
    priorityMedium: 'ਮੱਧਮ',
    priorityLow: 'ਘੱਟ',
    
    // Messages
    successSubmit: 'ਸ਼ਿਕਾਇਤ ਸਫਲਤਾ ਨਾਲ ਦਰਜ ਕੀਤੀ ਗਈ!',
    errorSubmit: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਵਿੱਚ ਗਲਤੀ: ',
    successUpdate: 'ਸ਼ਿਕਾਇਤ ਸਫਲਤਾ ਨਾਲ ਅਪਡੇਟ ਕੀਤੀ ਗਈ!',
    errorUpdate: 'ਸ਼ਿਕਾਇਤ ਅਪਡੇਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ',
    required: 'ਇਹ ਖੇਤਰ ਲਾਜ਼ਮੀ ਹੈ',
    microphoneError: 'ਮਾਈਕ੍ਰੋਫੋਨ ਪਹੁੰਚ ਵਿੱਚ ਰਾਜ਼ੀ ਨਹੀਂ। ਕਿਰਪਾ ਮਾਈਕ੍ਰੋਫੋਨ ਅਨੁਮਤੀ ਸਮਰੱਥ ਕਰੋ।',
    emergencyCall: 'ਐਮਰਜੈਂਸੀ ਕਾਲ',
  },
};

// Fallback aliases: map newly added Indian languages to English translations
translations.bn = translations.en;
translations.ta = translations.en;
translations.te = translations.en;
translations.mr = translations.en;
translations.gu = translations.en;
translations.kn = translations.en;
translations.ml = translations.en;
translations.or = translations.en;
translations.as = translations.en;
translations.ur = translations.en;
