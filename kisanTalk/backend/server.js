const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const OpenAI = require('openai');

// Initialize OpenAI client (optional - will use mock if no API key)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// --- Enhanced Services with LLM Integration ---

// Language mapping for better transcription
const languageMap = {
  'en': 'english',
  'hi': 'hindi',
  'pa': 'punjabi',
  'ta': 'tamil',
  'te': 'telugu',
  'bn': 'bengali',
  'mr': 'marathi',
  'gu': 'gujarati',
  'kn': 'kannada',
  'ml': 'malayalam'
};

// Enhanced Speech-to-Text with OpenAI Whisper API
const enhancedSTT = async (filePath, language = 'en') => {
  console.log(`[Enhanced STT] Processing audio file: ${filePath} in language: ${language}`);

  try {
    if (openai && fs.existsSync(filePath)) {
      // Use OpenAI Whisper for accurate transcription
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        language: language === 'en' ? 'en' : language, // Whisper supports many languages
        response_format: "text"
      });

      console.log(`[Whisper] Transcribed: ${transcription}`);
      return transcription;
    } else {
      // Fallback to mock transcription
      return await mockSTT(filePath, language);
    }
  } catch (error) {
    console.error('[STT Error]:', error.message);
    // Fallback to mock on error
    return await mockSTT(filePath, language);
  }
};

// Generate intelligent admin comments in the user's language using GPT
const generateAdminComment = async (grievanceText, category, language = 'en') => {
  const languageName = languageMap[language] || 'english';

  try {
    if (openai) {
      const prompt = `You are a helpful government agriculture officer. A farmer has submitted this grievance:

"${grievanceText}"

Category: ${category}

Generate a professional, empathetic response acknowledging their issue and explaining the next steps. 
Write the response in ${languageName} language.
Keep it concise (2-3 sentences).
Be specific about what action will be taken.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a compassionate agriculture department officer who helps farmers. Always respond in ${languageName}.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      const comment = completion.choices[0].message.content.trim();
      console.log(`[GPT Comment Generated in ${languageName}]:`, comment);
      return comment;
    } else {
      // Fallback to template-based comments
      return getTemplateComment(category, language);
    }
  } catch (error) {
    console.error('[GPT Error]:', error.message);
    return getTemplateComment(category, language);
  }
};

// Template-based comments as fallback
const getTemplateComment = (category, language) => {
  const templates = {
    'Crop Disease': {
      en: "Your crop disease complaint has been received. Our agriculture expert will visit your field within 2 days to assess and provide treatment recommendations.",
      hi: "आपकी फसल रोग की शिकायत प्राप्त हो गई है। हमारे कृषि विशेषज्ञ 2 दिनों के भीतर आपके खेत का निरीक्षण करेंगे और उपचार की सिफारिश करेंगे।",
      pa: "ਤੁਹਾਡੀ ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਦੀ ਸ਼ਿਕਾਇਤ ਮਿਲ ਗਈ ਹੈ। ਸਾਡੇ ਖੇਤੀਬਾੜੀ ਮਾਹਿਰ 2 ਦਿਨਾਂ ਵਿੱਚ ਤੁਹਾਡੇ ਖੇਤ ਦਾ ਮੁਆਇਨਾ ਕਰਨਗੇ ਅਤੇ ਇਲਾਜ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਨਗੇ।",
      ta: "உங்கள் பயிர் நோய் புகார் பெறப்பட்டது. எங்கள் விவசாய நிபுணர் 2 நாட்களுக்குள் உங்கள் வயலை ஆய்வு செய்து சிகிச்சை பரிந்துரைகளை வழங்குவார்.",
      te: "మీ పంట వ్యాధి ఫిర్యాదు స్వీకరించబడింది. మా వ్యవసాయ నిపుణుడు 2 రోజుల్లో మీ పొలాన్ని పరిశీలించి చికిత్స సిఫార్సులను అందిస్తారు.",
      bn: "আপনার ফসলের রোগের অভিযোগ গৃহীত হয়েছে। আমাদের কৃষি বিশেষজ্ঞ 2 দিনের মধ্যে আপনার ক্ষেত পরিদর্শন করবেন এবং চিকিৎসার সুপারিশ করবেন।"
    },
    'Irrigation Issue': {
      en: "Your irrigation complaint is registered. Water supply department will inspect the canal system within 24 hours and restore water flow.",
      hi: "आपकी सिंचाई शिकायत दर्ज हो गई है। जल आपूर्ति विभाग 24 घंटे के भीतर नहर प्रणाली का निरीक्षण करेगा और पानी की आपूर्ति बहाल करेगा।",
      pa: "ਤੁਹਾਡੀ ਸਿੰਚਾਈ ਸ਼ਿਕਾਇਤ ਦਰਜ ਹੋ ਗਈ ਹੈ। ਪਾਣੀ ਸਪਲਾਈ ਵਿਭਾਗ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਨਹਿਰ ਪ੍ਰਣਾਲੀ ਦੀ ਜਾਂਚ ਕਰੇਗਾ ਅਤੇ ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਬਹਾਲ ਕਰੇਗਾ।",
      ta: "உங்கள் நீர்ப்பாசன புகார் பதிவு செய்யப்பட்டது। நீர் வழங்கல் துறை 24 மணி நேரத்திற்குள் கால்வாய் அமைப்பை ஆய்வு செய்து நீர் ஓட்டத்தை மீட்டெடுக்கும்.",
      te: "మీ నీటిపారుదల ఫిర్యాదు నమోదు చేయబడింది. నీటి సరఫరా విభాగం 24 గంటల్లో కాలువ వ్యవస్థను తనిఖీ చేసి నీటి ప్రవాహాన్ని పునరుద్ధరిస్తుంది.",
      bn: "আপনার সেচের অভিযোগ নিবন্ধিত হয়েছে। জল সরবরাহ বিভাগ 24 ঘন্টার মধ্যে খাল ব্যবস্থা পরিদর্শন করবে এবং জল প্রবাহ পুনরুদ্ধার করবে।"
    },
    'Subsidy/Scheme': {
      en: "Your subsidy inquiry is noted. Finance department will verify your account details and process the payment within 7 working days.",
      hi: "आपकी सब्सिडी पूछताछ नोट कर ली गई है। वित्त विभाग आपके खाते का विवरण सत्यापित करेगा और 7 कार्य दिवसों में भुगतान संसाधित करेगा।",
      pa: "ਤੁਹਾਡੀ ਸਬਸਿਡੀ ਪੁੱਛਗਿੱਛ ਨੋਟ ਕੀਤੀ ਗਈ ਹੈ। ਵਿੱਤ ਵਿਭਾਗ ਤੁਹਾਡੇ ਖਾਤੇ ਦੇ ਵੇਰਵੇ ਦੀ ਪੁਸ਼ਟੀ ਕਰੇਗਾ ਅਤੇ 7 ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਵਿੱਚ ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਕਰੇਗਾ।",
      ta: "உங்கள் மானிய விசாரணை குறிப்பிடப்பட்டது। நிதித் துறை உங்கள் கணக்கு விவரங்களை சரிபார்த்து 7 வேலை நாட்களுக்குள் கட்டணத்தை செயல்படுத்தும்.",
      te: "మీ సబ్సిడీ విచారణ గుర్తించబడింది। ఆర్థిక విభాగం మీ ఖాతా వివరాలను ధృవీకరించి 7 పని దినాల్లో చెల్లింపును ప్రాసెస్ చేస్తుంది.",
      bn: "আপনার ভর্তুকি অনুসন্ধান নোট করা হয়েছে। অর্থ বিভাগ আপনার অ্যাকাউন্টের বিবরণ যাচাই করবে এবং 7 কার্যদিবসের মধ্যে পেমেন্ট প্রক্রিয়া করবে।"
    }
  };

  const categoryTemplates = templates[category] || templates['Crop Disease'];
  return categoryTemplates[language] || categoryTemplates['en'];
};

// Mock STT fallback (when OpenAI is not available)
const mockSTT = async (filePath, language = 'en') => {
  console.log(`[Mock STT] Processing audio file: ${filePath} in language: ${language}`);
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockTranscripts = {
    en: "The canal water has not reached my field for the last 3 days. My crops are drying up.",
    hi: "मेरी गेहूँ की फसल में कीड़ा लग गया है। मुझे दवा चाहिए।",
    pa: "ਮੇਰੇ ਖੇਤ ਵਿੱਚ ਨਹਿਰੀ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ ਹੈ। ਮੇਰੀ ਫਸਲ ਸੁੱਕ ਰਹੀ ਹੈ।",
    ta: "என் வங்கிக் கணக்கில் மானியப் பணம் வரவில்லை.",
    te: "నా పంటకు నీరు రావడం లేదు। పంట ఎండిపోతోంది.",
    bn: "আমার ক্ষেতে জল পৌঁছাচ্ছে না। ফসল শুকিয়ে যাচ্ছে।"
  };

  return mockTranscripts[language] || mockTranscripts['en'];
};

// Mock SMS Notification
const sendSMS = async (phone, message) => {
  console.log(`[Mock SMS] Sending to ${phone}: "${message}"`);
  return true;
};

// ----------------------------------

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Sector keywords and admin routing
const sectorKeywords = {
  'Crop Disease': [
    'pest', 'worm', 'fungus', 'disease', 'blight', 'rot', 'leaf', 'insect', 'virus',
    'कीड़ा', 'किट', 'रोग', 'बिमारी', 'फफूंदी', 'कीट', 'संक्रमण', 'वायरस', 'पत्ता',
    'ਕੀੜਾ', 'ਬਿਮਾਰੀ', 'ਫਫੂੰਦੀ', 'ਕਿਰਮ', 'ਕੀਟ', 'ਵਾਇਰਸ',
    'பூச்சி', 'நோய்', 'பூஞ்சை', 'விஷாணு', 'இலை', 'கிருமி'
  ],
  'Irrigation Issue': [
    'water', 'canal', 'dry', 'irrigation', 'pump', 'borewell', 'river', 'drought',
    'पानी', 'नहर', 'सूखा', 'सिंचाई', 'पम्प', 'कुआँ', 'नदी',
    'ਪਾਣੀ', 'ਨਹਿਰ', 'ਸੁੱਕਾ', 'ਸਿੰਚਾਈ', 'ਪੰਪ', 'ਬੋਰਵੈੱਲ', 'ਦਰੀਆ',
    'தண்ணீர்', 'கால்வாய்', 'வறட்டு', 'நீர்ப்பாசனம்', 'பம்ப்', 'கிணறு', 'நதி', 'வறட்சி'
  ],
  'Subsidy/Scheme': [
    'money', 'loan', 'bank', 'scheme', 'subsidy', 'installment', 'payment', 'fund', 'credit', 'account',
    'पैसा', 'ऋण', 'बैंक', 'योजना', 'सब्सिडी', 'किस्त', 'भुगतान', 'फंड', 'क्रेडिट', 'खाता',
    'ਪੈਸਾ', 'ਕਰਜ਼ਾ', 'ਬੈਂਕ', 'ਯੋਜਨਾ', 'ਸਬਸਿਡੀ', 'ਕਿਸ਼ਤ', 'ਭੁਗਤਾਨ', 'ਫੰਡ',
    'பணம்', 'கடன்', 'வங்கி', 'திட்டம்', 'உதவித்தொகை', 'கட்டணம்', 'நிதி', 'கடன்'
  ],
  'Seeds/Fertilizers': [
    'seed', 'fertilizer', 'urea', 'dap', 'sowing', 'manure', 'nutrient', 'npk',
    'बीज', 'खाद', 'बुवाई', 'उर्वरक', 'एनपीके',
    'ਬੀਜ', 'ਖਾਦ', 'ਬੁਵਾਈ',
    'விதை', 'உரம்', 'விதைப்பு', 'யூரியா', 'என்என்பிகே'
  ],
  'Equipment Issue': [
    'tractor', 'machine', 'equipment', 'tool', 'repair', 'plough', 'tiller',
    'ट्रैक्टर', 'मशीन', 'उपकरण', 'मरम्मत', 'खराब', 'हल', 'टिल्लर',
    'ਟ੍ਰੈਕਟਰ', 'ਮਸ਼ੀਨ', 'ਉਪਕਰਣ', 'ਮੁਰੰਮਤ', 'ਖਰਾਬ',
    'டிராக்டர்', 'இயந்திரம்', 'கருவி', 'பழுது'
  ],
  'Market Access': [
    'market', 'price', 'sell', 'mandi', 'buyer', 'rate', 'transport', 'storage', 'godown', 'msp', 'procurement',
    'मंडी', 'भाव', 'कीमत', 'बेचना', 'दर', 'खरीदार', 'व्यापारी', 'परिवहन', 'भंडारण', 'एमएसपी', 'खरीद',
    'ਮੰਡੀ', 'ਭਾਅ', 'ਕੀਮਤ', 'ਵੇਚਣਾ', 'ਰੇਟ', 'ਖਰੀਦਦਾਰ', 'ਵਪਾਰੀ', 'ਟ੍ਰਾਂਸਪੋਰਟ', 'ਸਟੋਰੇਜ',
    'சந்தை', 'விலை', 'விற்பனை', 'விகிதம்', 'கொள்முதல்', 'வர்த்தகர்', 'போக்குவரத்து', 'கிடங்கு', 'எம்எஸ்பி'
  ]
};

const adminRouting = {
  'Crop Disease': 'Admin_CropHealth (Dr. Green)',
  'Irrigation Issue': 'Admin_WaterSupply (Er. Rivers)',
  'Subsidy/Scheme': 'Admin_Finance (Mr. Banker)',
  'Seeds/Fertilizers': 'Admin_SupplyChain (Mr. Store)',
  'Equipment Issue': 'Admin_Machinery (Mr. Tech)',
  'Market Access': 'Admin_SupplyChain (Ms. Trade)',
  'Other': 'Admin_General (Helpdesk)'
};

const urgencyKeywords = ['immediately', 'urgent', 'dying', 'fire', 'flood', 'critical', 'emergency', 'ruined', 'failed'];

function detectUrgency(text) {
  if (!text) return 'Medium';
  const lowerText = text.toLowerCase();
  for (const keyword of urgencyKeywords) {
    if (lowerText.includes(keyword)) {
      return 'High';
    }
  }
  return 'Medium';
}

function categorizeAndRoute(text) {
  if (!text) return { category: 'Other', admin: adminRouting['Other'] };

  const lowerText = text.toLowerCase();
  let bestCategory = 'Other';
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(sectorKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  return { category: bestCategory, admin: adminRouting[bestCategory] };
}

// Mock database for grievances
let grievances = [
  {
    id: 'GRV001',
    farmerName: 'Rajesh Kumar',
    phone: '9876543210',
    village: 'Rajpura',
    district: 'Ludhiana',
    category: 'Crop Disease',
    assignedAdmin: 'Admin_CropHealth (Dr. Green)',
    title: 'Wheat crop affected by pest',
    description: 'My wheat crop is affected by armyworm. Need immediate help.',
    voiceFile: '/29941fed-63a2-4891-bd66-3a566beb20f9.wav',
    status: 'Resolved',
    resolution: 'Recommended pesticide application',
    date: '2026-01-28',
    priority: 'High',
    language: 'en'
  },
  {
    id: 'GRV002',
    farmerName: 'Priya Singh',
    phone: '9123456789',
    village: 'Mansa',
    district: 'Sangrur',
    category: 'Irrigation Issue',
    assignedAdmin: 'Admin_WaterSupply (Er. Rivers)',
    title: 'Water supply not reaching field',
    description: 'Canal water is not reaching my field properly.',
    voiceFile: '/29941fed-63a2-4891-bd66-3a566beb20f9.wav',
    status: 'In Progress',
    resolution: 'Engineer assigned to inspect canal',
    date: '2026-01-30',
    priority: 'Medium',
    language: 'en'
  },
  {
    id: 'GRV003',
    farmerName: 'Harjeet Singh',
    phone: '8765432109',
    village: 'Sangrur',
    district: 'Sangrur',
    category: 'Subsidy/Scheme',
    assignedAdmin: 'Admin_Finance (Mr. Banker)',
    title: 'Not received PM-KISAN installment',
    description: 'Third installment of PM-KISAN scheme still pending.',
    voiceFile: '/29941fed-63a2-4891-bd66-3a566beb20f9.wav',
    status: 'Pending',
    resolution: null,
    date: '2026-01-31',
    priority: 'High',
    language: 'en'
  }
];

// Get all grievances (with Department Filtering)
app.get('/api/grievances', (req, res) => {
  const { status, priority, department } = req.query;
  let filtered = grievances;

  if (status) {
    filtered = filtered.filter(g => g.status === status);
  }
  if (priority) {
    filtered = filtered.filter(g => g.priority === priority);
  }
  if (department && department !== 'All') {
    filtered = filtered.filter(g => g.assignedAdmin && g.assignedAdmin.includes(department));
  }

  res.json(filtered);
});

// Get single grievance
app.get('/api/grievances/:id', (req, res) => {
  const grievance = grievances.find(g => g.id === req.params.id);
  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }
  res.json(grievance);
});

// Submit new grievance with enhanced STT
app.post('/api/grievances', upload.single('voiceFile'), async (req, res) => {
  const { farmerName, phone, village, district, title, language } = req.body;
  let { description, category } = req.body;

  if (!farmerName || !phone || !title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Enhanced Speech-to-Text if description is missing but audio exists
  if (!description && req.file) {
    try {
      description = await enhancedSTT(req.file.path, language || 'en');
    } catch (err) {
      console.error('STT Error:', err);
      description = "Audio transcription failed.";
    }
  }

  // Automatic categorization and routing
  const detected = categorizeAndRoute(description);

  if (detected.category) {
    category = detected.category;
  } else if (!category) {
    category = 'Other';
  }

  const assignedAdmin = adminRouting[category] || adminRouting['Other'];
  const priority = detectUrgency(description);

  // Generate intelligent admin comment in user's language
  const adminComment = await generateAdminComment(description, category, language || 'en');

  const newGrievance = {
    id: 'GRV' + String(grievances.length + 1).padStart(3, '0'),
    farmerName,
    phone,
    village: village || 'Not specified',
    district: district || 'Not specified',
    category,
    assignedAdmin,
    title,
    description,
    voiceFile: req.file ? '/' + req.file.filename : '/default.wav',
    status: 'Pending',
    resolution: adminComment, // Auto-generated comment
    date: new Date().toISOString().split('T')[0],
    priority,
    language: language || 'en'
  };

  grievances.push(newGrievance);

  // Send SMS Acknowledgement
  sendSMS(phone, `Namaste ${farmerName}. Your grievance ${newGrievance.id} regarding ${category} has been registered. We will update you shortly. - KisanTalk`);

  res.status(201).json(newGrievance);
});

// Update grievance status and resolution
app.put('/api/grievances/:id', async (req, res) => {
  const { status, resolution, priority } = req.body;
  const grievance = grievances.find(g => g.id === req.params.id);

  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }

  if (status) grievance.status = status;
  if (priority) grievance.priority = priority;

  // If resolution is being updated, use GPT to enhance it in the farmer's language
  if (resolution) {
    const enhancedResolution = await generateAdminComment(
      grievance.description,
      grievance.category,
      grievance.language || 'en'
    );
    grievance.resolution = resolution || enhancedResolution;
  }

  res.json(grievance);
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    totalGrievances: grievances.length,
    pending: grievances.filter(g => g.status === 'Pending').length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
    highPriority: grievances.filter(g => g.priority === 'High').length,
    categories: [...new Set(grievances.map(g => g.category))],
    byCategory: grievances.reduce((acc, g) => {
      acc[g.category] = (acc[g.category] || 0) + 1;
      return acc;
    }, {})
  };
  res.json(stats);
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(500).send('Download failed');
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI Integration: ${openai ? 'ENABLED ✅' : 'DISABLED (using mock) ⚠️'}`);
  console.log(`To enable OpenAI: Set OPENAI_API_KEY environment variable`);
});
