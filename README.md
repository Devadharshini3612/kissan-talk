# 🌾 KisanTalk - Voice-Based Farmers' Grievance System

[![GitHub](https://img.shields.io/badge/GitHub-Devadharshini3612-blue?logo=github)](https://github.com/Devadharshini3612/kissan-talk)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)

> **Empowering farmers to voice their concerns through an intuitive IVR-style voice-based grievance management system with multilingual support.**

---

## 🎯 Live Demo

- **Frontend**: [Coming Soon - Deploy to see live]
- **GitHub Repository**: [https://github.com/Devadharshini3612/kissan-talk](https://github.com/Devadharshini3612/kissan-talk)

---

## 📖 About The Project

KisanTalk is a modern, full-stack web application designed to bridge the digital divide for farmers. It provides an accessible, voice-first interface that mimics an IVR (Interactive Voice Response) system, allowing farmers to register grievances in their native language without requiring technical knowledge.

### 🌟 Key Features

✅ **IVR-Style Voice Interface** - Simulates a phone call experience in the browser  
✅ **Multilingual Support** - English, Hindi, Punjabi, Tamil  
✅ **Voice Recording** - Browser-based audio recording with real-time transcription  
✅ **Smart Categorization** - AI-powered automatic grievance categorization  
✅ **Admin Routing** - Intelligent assignment to relevant departments  
✅ **Real-time Dashboard** - Comprehensive admin panel with statistics  
✅ **Priority Detection** - Automatic urgency assessment  
✅ **Responsive Design** - Works seamlessly on all devices  

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **Web Speech API** - Browser-based voice recognition
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Multer** - File upload handling
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

### Features
- **Speech-to-Text** - Real-time voice transcription
- **Text-to-Speech** - Voice prompts in multiple languages
- **Smart Routing** - Department-based grievance assignment
- **Dialect Correction** - Regional language support

---

## 📁 Project Structure

```
kisanTalk/
├── backend/                    # Express.js API Server
│   ├── server.js              # Main server with API routes
│   ├── package.json           # Backend dependencies
│   ├── uploads/               # Voice file storage
│   └── .env.example           # Environment variables template
│
├── frontend/                  # React Application
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceRecorder.js    # IVR-style voice interface
│   │   │   ├── Dashboard.js        # Admin panel
│   │   │   ├── GrievanceList.js    # Grievance list view
│   │   │   ├── GrievanceForm.js    # Form-based submission
│   │   │   └── AdminPortal.js      # Admin login
│   │   ├── utils/
│   │   │   └── categorization.js   # Smart categorization logic
│   │   ├── App.js             # Main app component
│   │   ├── App.css            # App styles
│   │   ├── index.js           # React entry point
│   │   ├── index.css          # Global styles
│   │   └── languages.js       # Multilingual content
│   └── package.json           # Frontend dependencies
│
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
├── README.md                  # This file
└── .gitignore                 # Git ignore rules
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Devadharshini3612/kissan-talk.git
   cd kissan-talk
   ```

2. **Setup Backend**
   ```bash
   cd kisanTalk/backend
   npm install
   node server.js
   ```
   Backend will run on `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd kisanTalk/frontend
   npm install
   npm start
   ```
   Frontend will open on `http://localhost:3000`

---

## 🎤 How to Use

### For Farmers (Voice Interface)

1. **Start the Call** - Click "Register Your Grievance"
2. **Select Language** - Choose from English, Hindi, Punjabi, or Tamil
3. **Record Complaint** - Speak your grievance after the beep
4. **Confirm** - Listen to your recording
5. **Get ID** - Receive your unique complaint ID

### For Admins (Dashboard)

1. **View Statistics** - See total, pending, in-progress, and resolved grievances
2. **Filter Grievances** - By status, priority, or department
3. **Update Status** - Change grievance status and add resolution notes
4. **Manage Priority** - Flag high-priority issues

---

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy Options

**Frontend:**
- Vercel (Recommended)
- GitHub Pages
- Netlify

**Backend:**
- Render (Recommended - Free tier)
- Railway
- Heroku

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grievances` | Get all grievances (with filters) |
| GET | `/api/grievances/:id` | Get single grievance |
| POST | `/api/grievances` | Submit new grievance |
| PUT | `/api/grievances/:id` | Update grievance |
| GET | `/api/stats` | Get dashboard statistics |
| GET | `/api/grievances/status` | Track grievance by phone/ID |

---

## 🎨 Features in Detail

### 1. IVR-Style Voice Interface
- Simulates a phone call experience
- Voice prompts in multiple languages
- Keypad navigation support
- Real-time call timer
- Professional call UI

### 2. Multilingual Support
- **English** - Full support
- **Hindi (हिन्दी)** - Native language support
- **Punjabi (ਪੰਜਾਬੀ)** - Regional language
- **Tamil (தமிழ்)** - South Indian language

### 3. Smart Categorization
Automatic categorization based on keywords:
- Crop Disease
- Irrigation Issue
- Subsidy/Scheme
- Seeds/Fertilizers
- Equipment Issue
- Market Access

### 4. Admin Routing
Intelligent assignment to departments:
- Admin_CropHealth (Dr. Green)
- Admin_WaterSupply (Er. Rivers)
- Admin_Finance (Mr. Banker)
- Admin_SupplyChain (Mr. Store)
- Admin_Machinery (Mr. Tech)

### 5. Priority Detection
Automatic urgency assessment based on keywords like:
- "urgent", "emergency", "critical"
- "dying", "failed", "ruined"
- "flood", "fire", "drought"

---

## 🔒 Security Considerations

Current implementation includes:
- ✅ Input validation
- ✅ File upload handling
- ✅ CORS configuration

For production, add:
- JWT authentication
- HTTPS encryption
- Rate limiting
- Input sanitization
- Database encryption

---

## 📈 Future Enhancements

- [ ] Real database integration (MongoDB/PostgreSQL)
- [ ] Mobile app (React Native)
- [ ] SMS/WhatsApp integration
- [ ] Email notifications
- [ ] AI-powered voice transcription
- [ ] Offline mode support
- [ ] Map-based location tracking
- [ ] Analytics dashboard
- [ ] Multi-factor authentication
- [ ] Voice-based status tracking

---

## 🐛 Troubleshooting

**Microphone not working?**
- Check browser permissions
- Use HTTPS in production
- Try Chrome or Firefox

**CORS errors?**
- Ensure backend is running on port 5000
- Check frontend API URL configuration

**Port already in use?**
- Change port in `backend/server.js`
- Kill existing process

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Devadharshini**

- GitHub: [@Devadharshini3612](https://github.com/Devadharshini3612)
- Repository: [kissan-talk](https://github.com/Devadharshini3612/kissan-talk)

---

## 🙏 Acknowledgments

- Inspired by the need to bridge the digital divide for farmers
- Built with modern web technologies
- Designed for accessibility and ease of use

---

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Made with ❤️ for Farmers of India** 🌾

---

## 📸 Screenshots

*Coming soon - Add screenshots after deployment*

---

**⭐ Star this repository if you find it helpful!**
