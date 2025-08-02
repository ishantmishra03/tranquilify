# Tranquilify - Your AI-Powered Mental Wellness Companion

<div align="center">
  <img src="https://ik.imagekit.io/tranquilify/logo_main.png" alt="Tranquilify Logo" width="120"/>
  
  <h3>Seamlessly integrating emotional tracking, habit-building, stress insights, blogs, and AI-powered tools into one unified experience—designed to support your mental wellness journey with clarity and care.</h3>
  
  ![AI Powered](https://img.shields.io/badge/AI%20Powered-4A90E2?style=for-the-badge&logo=brain&logoColor=white)
  ![Mental Wellness](https://img.shields.io/badge/Mental%20Wellness-764ba2?style=for-the-badge&logo=heart&logoColor=white)
  ![Responsive](https://img.shields.io/badge/Responsive-667eea?style=for-the-badge&logo=mobile&logoColor=white)
  ![Real Time](https://img.shields.io/badge/Real%20Time-FF6B6B?style=for-the-badge&logo=clock&logoColor=white)
</div>

---
## 🌐 Live Demo

(https://tranquilify.vercel.app)

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Demo Video](#-demo-video)
- [How to Use](#-how-to-use)
- [Conclusion](#-conclusion)

---

## 🛠️ Tech Stack

```
# MERN STACK 
```
### 🎨 Frontend Technologies
![React](https://skillicons.dev/icons?i=react) ![TailwindCSS](https://skillicons.dev/icons?i=tailwind) ![JavaScript](https://skillicons.dev/icons?i=js) ![HTML5](https://skillicons.dev/icons?i=html) ![CSS3](https://skillicons.dev/icons?i=css)

- **React.js** - Modern component-based UI framework
- **Tailwind CSS** - Utility-first CSS framework for rapid development  
- **Context API** - Efficient state management across components
- **Responsive Design** - Seamless experience across all devices
- **Light/Dark Mode Support** - Adaptive theming for user comfort

### ⚙️ Backend Technologies
![Node.js](https://skillicons.dev/icons?i=nodejs) ![Express](https://skillicons.dev/icons?i=express) ![JavaScript](https://skillicons.dev/icons?i=js)

- **Node.js + Express.js** - Primary REST API server
- **JWT Authentication** - Secure token-based authentication
- **Cookie Management** - Persistent session handling

### 🗄️ Database & Storage
![MongoDB](https://skillicons.dev/icons?i=mongodb)
![ImageKit](https://imagekit.io/favicon-32x32.png?v=cc537e564e2f5b445c657c3fbeee1576)

- **MongoDB Atlas** - Cloud-based NoSQL database
- **ImageKit** - Optimized image upload and storage solution

---

## ✨ Features

### **Intelligent Mood Tracking**
- **AI Camera Detection**: Advanced mood analysis using FaceApp AI technology
- **Manual Entry Option**: Traditional mood logging with customizable parameters
- **Visual Analytics**: Interactive mood graphs to track emotional patterns over time
- **Pattern Recognition**: Identify emotional trends and triggers

### **Comprehensive Stress Management**
- **Stress Assessment Forms**: Detailed stress level evaluation tools
- **Stress Analytics**: Visual stress graphs showing patterns and triggers
- **Data Export**: Download your stress data for up to 7 days in PDF format
- **Insights Dashboard**: Understand how stress factors change over time

### **Habit & Self-Care Management**
- **Smart Habit Tracker**: Monitor and build positive daily habits
- **AI-Powered Self-Care Planner**: Receive personalized 1-day wellness plans
- **Progress Visualization**: Track your consistency and celebrate milestones
- **Goal Achievement**: Milestone celebrations and achievement tracking

### **Reflective Journaling**
- **Personal Journal**: Document your daily emotional experiences
- **AI Reflective Prompts**: Get thoughtful, personalized responses to your entries
- **Emotional Processing**: Transform thoughts into insights with AI guidance

### **AI Therapist + Live Call Agent**
- **24/7 Chat Support**: Always available AI-powered therapeutic conversations
- **Voice Interaction**: Natural voice-based therapy sessions
- **Personalized Responses**: Context-aware mental health support
- **You can have live call sessions with AI agent**: Provides best user support for mental wellness

### **Healing Soundscapes**
- **Personalized Music Recommendations**: Curated healing music based on your emotional data
- **Therapeutic Audio**: Mind-healing tracks for relaxation and focus
- **Relaxation Focus**: Stress relief soundtracks and ambient sounds

### **Mindfulness & Breathing**
- **2-Minute Breathing Exercises**: Quick, effective stress relief techniques
- **Ambient Room**: Get deep into focus mode with 3D interactive background and music

### **Mental Wellness Blog**
- **Expert Content**: Curated articles on mental health and wellness
- **Admin Panel**: Full CRUD operations for content management

### 💫 **Daily Motivation**
- **🤖 AI-Generated Quotes**: Personalized daily inspirational messages
- **📅 Daily Delivery**: Fresh motivation every day

### ⚙️ **User Management & Privacy**
- **🔐 Secure Authentication**: JWT and cookie-based security
- **🌓 Theme Support**: Light and dark mode options
- **⚙️ Settings Panel**: Comprehensive customization options
- **🔄 Account Reset**: Easy account reset functionality
- **🗑️ Account Deletion**: Complete data removal with secure deletion

---

## 🎥 Demo Video

<div align="center">
  <a href="https://ik.imagekit.io/tranquilify/main.mp4" target="_blank">
    <img src="https://ik.imagekit.io/tranquilify/Screenshot%202025-07-24%20184250.png" alt="Tranquilify Demo" width="600"/>
  </a>


  **Click above image to see Tranquilify in action! 🚀**

  **(Note) Video was pre-recorded so it has lack of some features recording but you can try them on [Live Site](https://tranquilify.vercel.app) as mentioned in features section .**
</div>
---

## 🚀 How to Use

### 📋 Prerequisites
- Code Editor
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB Atlas account
- ImageKit account

### ⚡ Installation Steps

**1. Clone Repository**
```bash
git clone https://github.com/ishantmishra03/tranquilify.git
cd tranquilify
```

**2. Frontend Setup**
```bash
cd frontend
npm install
```

**3. Backend Setup**
```bash
cd ../backend
npm install
```

**5. Environment Configuration**
### 1. **Frontend `.env` File**
```bash
# Backend URLs
VITE_BACKEND_URL="http://localhost:5000"

# CDN URL for media
VITE_CDN_URL="https://cdn.jsdelivr.net/gh/ishantdev379/audio"

# VAPI ( Real Time Calling AI Agent )
VITE_VAPI_API_KEY=""
VITE_VAPI_ASSISTANT_ID=""
```

### 3. **Backend(NodeJS) `.env` File**
```bash
# Backend Environment Variables
PORT=5000
NODE_ENV=development

ADMIN_EMAIL="your_admin_email"
ADMIN_PASSWORD="your_admin_password"

MONGODB_URI="your_mongodb_connection_string"

JWT_SECRET="your_jwt_secret"

IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"

GROQ_API_KEY="your_groq_api_key"

FACEPP_API_KEY="your_face_app_api_jey"
FACEAPP_API_SECRET="your_face_app_api_secret"

# Cors Prevntion
ALLOWED_ORIGINS="url2, url2" 
```

**6. Launch Application**
```bash
# Terminal 1 - Frontend (Port 5173)
cd frontend && npm run dev

# Terminal 2 - Node Backend (Port 5000)
cd backend && npm run dev
```

### 📱 User Journey

1. **🔐 Sign Up/Login** - Create account with secure authentication
2. **🎭 Track Mood** - Use AI camera detection or manual entry
3. **📊 Monitor Stress** - Complete stress assessment forms
4. **🎯 Build Habits** - Create and track wellness routines
5. **📝 Journal Daily** - Reflect and receive AI insights
6. **🤖 Chat with AI** - Get therapeutic support anytime
7. **🤖 RealTime Call with AI** - Get therapeutic support anytime in live call
8. **🎵 Listen to Soundscapes** - Enjoy personalized healing music
9. **📈 View Analytics** - Analyze patterns and track progress
10. **Focus Mode** - Increase your focus and heal mind in Ambient Room
11. **Blogs** - Know more about mental wellness through blogs

**( Improve Mental Health )**
---

## 🎯 Conclusion

**Tranquilify** represents the future of mental wellness technology, where artificial intelligence meets human compassion. Our comprehensive platform doesn't just track your mental health—it actively supports your journey toward emotional well-being with personalized insights, therapeutic guidance, and evidence-based tools.

### 🌟 **Why Choose Tranquilify?**

- **🤖 AI-Powered Intelligence** - Advanced algorithms provide personalized insights
- **🎯 Evidence-Based Approach** - Features grounded in psychological research
- **❤️ User-Centered Design** - Intuitive interface designed for mental wellness
- **🔒 Privacy First** - Your data is secure and completely under your control
- **📱 Accessible Everywhere** - Responsive design works on all devices

### 🚀 **Ready to Transform Your Mental Wellness?**

Whether you're taking your first steps toward mental wellness or continuing an ongoing journey, Tranquilify provides the tools, insights, and support you need to thrive. Experience the power of AI-driven mental health care designed with empathy, built with expertise, and delivered with care.

**Mental health is not a destination, but a process. It's about how you drive, not where you're going.**

---

<div align="center">
  
### 👨‍💻 **Developed by**
# **Ishant Mishra**
*Passionate about combining AI technology with mental wellness* 🧠✨

---

**Built for mental wellness | Powered by cutting-edge AI technology**

**Tranquilify - Where Technology Meets Tranquility**

---

## 🤝 **Feel Free to Contribute!**
We encourage contributions. If you have any ideas or improvements for **Tranquilify**, please feel free to fork the repo and create a pull request. Your help is appreciated!

Together, let's continue building a better world for mental wellness with technology!


</div>
