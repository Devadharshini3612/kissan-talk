# KisanTalk - Voice-Based Farmers' Grievance System

A modern, full-stack application empowering farmers to voice their concerns through an intuitive voice-based grievance management system.

## 🎯 Features

✅ **Voice Recording** - Record grievances directly through your browser  
✅ **Farmer Registration** - Easy grievance submission with farmer details  
✅ **Admin Dashboard** - Comprehensive management and tracking of all grievances  
✅ **Real-time Status Updates** - Track grievance resolution progress  
✅ **Priority Management** - Flag and manage high-priority issues  
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices  
✅ **Professional UI** - Modern, intuitive interface with smooth animations  

## 🏗️ Tech Stack

**Frontend:**
- React 18
- Axios (HTTP client)
- React Icons
- CSS3 with modern styling

**Backend:**
- Node.js & Express.js
- Multer (file uploads)
- UUID (unique IDs)
- CORS enabled

**Database:**
- In-memory mock data (can be replaced with real DB)

## 📋 Project Structure

```
kisanTalk/
├── backend/
│   ├── server.js          # Express server & API routes
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Voice file storage (created on run)
│
└── frontend/
    ├── public/
    │   └── index.html     # Main HTML file
    ├── src/
    │   ├── components/
    │   │   ├── VoiceRecorder.js    # Grievance submission form
    │   │   ├── Dashboard.js        # Admin panel
    │   │   └── GrievanceList.js    # View all grievances
    │   ├── App.js          # Main app component
    │   ├── App.css         # App styles
    │   ├── index.js        # React entry point
    │   └── index.css       # Global styles
    └── package.json        # Frontend dependencies
```

## 🚀 Quick Start (Windows)

### Step 1: Setup Backend

```bash
cd backend
npm install
node server.js
```

The backend will run on **http://localhost:5000**

### Step 2: Setup Frontend (in a new terminal)

```bash
cd frontend
npm install
npm start
```

The frontend will open on **http://localhost:3000**

## 📱 Using the Application

### 1. **Home Page**
   - Overview of the system
   - Click "Register Your Grievance" to start

### 2. **Register Grievance**
   - Fill in farmer details (name, phone, village, district)
   - Select grievance category
   - Provide title and description
   - **Click the mic button to record your voice**
   - Submit the grievance

### 3. **View Grievances**
   - See all submitted grievances
   - Click on any to view complete details
   - Check resolution status

### 4. **Admin Dashboard**
   - View statistics (total, pending, resolved, etc.)
   - Filter grievances by status
   - Edit status and priority
   - Add resolution notes
   - Mark as resolved

## 🎤 Voice Recording Feature

- **Browser-based**: Uses Web Speech API for recording
- **Real-time feedback**: Visual indicator while recording
- **No external service needed**: All recording stays in your browser
- **File management**: Audio files uploaded to backend

## 📊 Sample Data

The application comes with 3 pre-loaded sample grievances demonstrating:
- Different categories (Crop Disease, Irrigation, Subsidy)
- Various statuses (Pending, In Progress, Resolved)
- Multiple priority levels

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grievances` | Get all grievances (filterable) |
| GET | `/api/grievances/:id` | Get single grievance |
| POST | `/api/grievances` | Submit new grievance |
| PUT | `/api/grievances/:id` | Update grievance status |
| GET | `/api/stats` | Get dashboard statistics |

## 🎨 Customization

### Change Colors
Edit `frontend/src/index.css` to modify the color scheme:
```css
/* Current: Purple gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Categories
Edit `backend/server.js` - Update the category select options in VoiceRecorder.js

### Database Integration
Replace the `grievances` array in `server.js` with database connection (MongoDB, PostgreSQL, etc.)

## 📋 Demo Script (2-Day Presentation)

1. **Home Page Tour** (1 min)
   - Show the landing page
   - Highlight three key features

2. **Register Grievance Demo** (2 min)
   - Fill in farmer details
   - Select a category
   - Record a voice message (mock)
   - Submit and show success

3. **View Grievances** (1 min)
   - Show the grievance list
   - Click on a grievance to view details

4. **Admin Dashboard** (2 min)
   - Show statistics cards
   - Filter by status
   - Edit a grievance status
   - Show how priority affects workflow

5. **Q&A** (remaining time)

## 🔒 Security Considerations

- Add authentication (JWT tokens) for production
- Implement input validation and sanitization
- Use HTTPS for all communications
- Store voice files securely
- Implement rate limiting on API endpoints

## 📈 Future Enhancements

- Real database integration
- Mobile app (React Native)
- SMS/WhatsApp integration
- Automatic status notifications
- AI-powered grievance categorization
- Multi-language support
- Offline mode
- Map integration for location tracking

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Change backend port in server.js line 5
const PORT = 5001; // Change to different port
```

**Microphone not working?**
- Check browser permissions for microphone access
- Ensure https (not http) for production
- Try Firefox/Chrome - best compatibility

**CORS errors?**
- Make sure backend is running on port 5000
- Check frontend API URL matches backend URL

## 📝 Notes

- This is a demo application with mock data
- Voice files are stored in `backend/uploads/`
- For production, implement proper database and security
- Consider adding Firebase or Azure backend for scalability

## 👥 Support & Contact

For questions or support, please reach out to the development team.

---

**Ready to present your finished project! 🎉**
