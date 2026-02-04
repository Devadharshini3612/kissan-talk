const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// --- Mock Services for IVR Flow ---

// Mock Speech-to-Text (Step 5) with Translation and Dialect Correction
const dialectMap = {
  'panni': 'water', // Example dialect word
  'khet': 'field',
  'beej': 'seed',
  'paani': 'water',
  'khad': 'fertilizer',
  'fasal': 'crop',
  'keeda': 'pest'
};

const correctDialect = (text) => {
  if (!text) return text;
  let corrected = text;
  Object.keys(dialectMap).forEach(dialectWord => {
    const regex = new RegExp(`\\b${dialectWord}\\b`, 'gi');
    corrected = corrected.replace(regex, dialectMap[dialectWord]);
  });
  return corrected;
};

const mockSTT = async (filePath, language = 'en') => {
  console.log(`[Mock STT] Processing audio file: ${filePath} in language: ${language}`);
  await new Promise(resolve => setTimeout(resolve, 1000));

  let transcript = "Simulated transcript: The canal water has not reached my field for the last 3 days. My crops are drying up.";

  // Simulated Multilingual Support (Mother Tongue -> English)
  if (language === 'hi') {
    transcript = "मेरी गेहूँ की फसल में कीड़ा लग गया है। मुझे दवा चाहिए।"; // Hindi
  } else if (language === 'pa') {
    transcript = "ਮੇਰੇ ਖੇਤ ਵਿੱਚ ਨਹਿਰੀ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ ਹੈ। ਮੇਰੀ ਫਸਲ ਸੁੱਕ ਰਹੀ ਹੈ।"; // Punjabi
  } else if (language === 'ta') {
    transcript = "என் வங்கிக் கணக்கில் மானியப் பணம் வரவில்லை."; // Tamil
  }
  
  // Apply dialect correction (conceptually, if transcript was mixed/dialect)
  // For demo purposes, we assume the output might have dialect words if it was a real STT
  return correctDialect(transcript);
};

// Mock SMS Notification (Step 8)
const sendSMS = async (phone, message) => {
  // In production, integrate Twilio, Exotel, or MSG91
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
  'Crop Disease': ['pest', 'worm', 'fungus', 'disease', 'blight', 'rot', 'leaf', 'insect', 'virus'],
  'Irrigation Issue': ['water', 'canal', 'dry', 'irrigation', 'pump', 'borewell', 'river', 'drought'],
  'Subsidy/Scheme': ['money', 'loan', 'bank', 'scheme', 'subsidy', 'installment', 'payment', 'fund', 'credit'],
  'Seeds/Fertilizers': ['seed', 'fertilizer', 'urea', 'dap', 'sowing', 'manure', 'nutrient'],
  'Equipment Issue': ['tractor', 'machine', 'equipment', 'tool', 'repair', 'plough'],
  'Market Access': ['market', 'price', 'sell', 'mandi', 'buyer', 'rate', 'transport']
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

  // Hybrid AI + Rule: Scoring based on keyword density
  for (const [category, keywords] of Object.entries(sectorKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += 1; // Simple count, could be weighted
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
    priority: 'High'
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
    priority: 'Medium'
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
    priority: 'High'
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
  // Smart Routing: Filter by Admin Department
  if (department && department !== 'All') {
    // Check if the assigned admin string contains the department code (e.g. "Admin_CropHealth")
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

// Submit new grievance
app.post('/api/grievances', upload.single('voiceFile'), async (req, res) => {
  const { farmerName, phone, village, district, title, language } = req.body;
  let { description, category } = req.body;

  if (!farmerName || !phone || !title) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // IVR Flow: Automatic Speech-to-Text if description is missing but audio exists
  if (!description && req.file) {
    try {
      // Pass the detected language to the Mock STT service
      description = await mockSTT(req.file.path, language || 'en');
    } catch (err) {
      console.error('STT Error:', err);
      description = "Audio transcription failed.";
    }
  }

  // Automatic categorization and routing based on description (voice transcript)
  const detected = categorizeAndRoute(description);
  
  // If a category is detected from words, use it. Otherwise fall back to user provided or 'Other'
  if (detected.category) {
    category = detected.category;
  } else if (!category) {
    category = 'Other';
  }

  // Determine admin based on the final category
  const assignedAdmin = adminRouting[category] || adminRouting['Other'];

  // Urgency Detection
  const priority = detectUrgency(description);

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
    resolution: null,
    date: new Date().toISOString().split('T')[0],
    priority: priority // Set based on urgency detection
  };

  grievances.push(newGrievance);

  // IVR Flow: Send SMS Acknowledgement
  sendSMS(phone, `Namaste ${farmerName}. Your grievance ${newGrievance.id} regarding ${category} has been registered. We will update you shortly. - KisanTalk`);

  res.status(201).json(newGrievance);
});

// IVR Flow: Callback for IVR status & feedback
app.post('/api/ivr/callback', (req, res) => {
  const { callSid, status, digits } = req.body;
  console.log(`[IVR Event] Call: ${callSid}, Status: ${status}, Input: ${digits}`);
  // Logic to update grievance status based on IVR interaction could go here
  res.json({ status: 'ok' });
});

// Voice Status Tracking Endpoint
app.get('/api/grievances/status', (req, res) => {
  const { phone, id } = req.query;
  
  if (!phone && !id) {
    return res.status(400).json({ message: 'Please provide phone number or grievance ID' });
  }

  let grievance;
  if (id) {
    grievance = grievances.find(g => g.id.toLowerCase() === id.toLowerCase());
  } else if (phone) {
    // Find the latest grievance for this phone
    const userGrievances = grievances.filter(g => g.phone === phone);
    userGrievances.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort desc
    grievance = userGrievances[0];
  }

  if (!grievance) {
    return res.status(404).json({ message: 'No grievance found.' });
  }

  res.json({
    id: grievance.id,
    status: grievance.status,
    resolution: grievance.resolution || 'Pending review'
  });
});

// Update grievance status and resolution
app.put('/api/grievances/:id', (req, res) => {
  const { status, resolution, priority } = req.body;
  const grievance = grievances.find(g => g.id === req.params.id);

  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }

  if (status) grievance.status = status;
  if (resolution) grievance.resolution = resolution;
  if (priority) grievance.priority = priority;

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
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  // Check if file exists
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
});
