# 🎓 Shiksha - Educational Learning Platform

A modern, full-stack educational platform built with React and Node.js, featuring comprehensive authentication, course management, and a premium UI/UX design. Now includes **MindEase**, a dedicated mental wellness module for students.

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX**: Dark theme with vibrant purple gradients and glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Course Listings**: Beautiful course cards with ratings, pricing, and instructor information
- **Category Navigation**: Horizontal scrollable category filter
- **Search Functionality**: Integrated search across the platform
- **Smooth Animations**: Professional micro-interactions and hover effects

### 🧘 MindEase (Mental Health Module)
- **Breathing Exercises**: Interactive 4-7-8 breathing technique with visual guidance
- **Meditation Zone**: Audio-guided meditation sessions with progress tracking
- **Study Pressure Management**: Pomodoro timer and curated study tips
- **Motivational Resources**: Daily quotes and affirmations
- **Standalone Architecture**: Runs on a dedicated Express/EJS server for optimal performance

### 🔐 Authentication System
- **User Registration & Login**: Secure JWT-based authentication
- **Email Verification**: Automated email verification with beautiful HTML templates
- **Password Reset**: Secure password reset flow with time-limited tokens
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA with QR code setup and backup codes
- **Account Security**: Login attempt tracking, account locking, and rate limiting
- **OAuth Integration**: Ready for Google OAuth (configured but requires credentials)
- **Token Refresh**: Automatic token refresh for seamless user experience

### 🛡️ Security Features
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Secure access and refresh tokens
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation on all endpoints
- **CORS Configuration**: Properly configured cross-origin requests
- **Environment Variables**: Sensitive data stored securely

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Shiksha
```

#### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Main Backend:**
```bash
cd server
npm install
```

**Mental Health Module:**
```bash
cd mental-health
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Environment
NODE_ENV=development
PORT=5000
MENTAL_HEALTH_PORT=3001

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shiksha
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/shiksha

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@shiksha.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 4. Start the Application

You need to run 3 separate terminals:

**Terminal 1 (Main Backend):**
```bash
cd server
npm run dev
```
(Runs on port 5000)

**Terminal 2 (Mental Health Server):**
```bash
cd server/mental-health
npm run dev
```
(Runs on port 3001)

**Terminal 3 (Frontend):**
```bash
# From root directory
npm run dev
```
(Runs on port 5173)

Open `http://localhost:5173` to access the main application.  
The MindEase module is accessible via the navbar button or directly at `http://localhost:3001/wellbeing`.

## 📁 Project Structure

```
Shiksha/
├── server/                    # Backend Services
│   ├── mental-health/        # MindEase Module (Express + EJS)
│   │   ├── data/             # JSON data (quotes, tips, meditations)
│   │   ├── public/           # Static assets (css, js)
│   │   ├── views/            # EJS Templates
│   │   └── server.js         # Module entry point
│   │
│   ├── config/               # Database config
│   ├── middleware/           # Auth & rate limiters
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Helpers (email, jwt)
│   ├── .env                  # Environment config
│   └── index.js              # Main server entry point
│
├── src/                       # Frontend (React + Vite)
│   ├── components/           # React components
│   │   ├── MindEaseButton.jsx # Entry to wellness module
│   │   └── ...
│   ├── context/              # Global state
│   ├── utils/                # Frontend utilities
│   ├── App.jsx               # Main component
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Wellness API (Mental Health Module)
- `GET /api/quotes` - Get random motivational quote
- `GET /api/tips` - Get study tips (supports ?shuffle=true)
- `GET /api/meditations` - Get all meditation sessions

## 🎨 Design System

### Colors
- **Primary**: `#a435f0` (Purple) - Main brand color
- **MindEase Theme**: Soft gradients (Pastel Purple, Blue, Green) for calming effect
- **Dark Mode**: Deep background (`#0f172a`) with light text for eye comfort

### Tech Stack
- **Frontend**: React, Vite, Tailwind-like CSS variables
- **Backend**: Node.js, Express, MongoDB
- **Templating**: EJS (for Mental Health Module)
- **Auth**: JWT, Google OAuth

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for educational purposes.

## 🙏 Acknowledgments

- **MindEase Concept**: Integrated mental wellness for holistic student growth
- Icons from Heroicons & SVG Repos
- Images from Unsplash
- Avatars from DiceBear

---

**Note**: This is a learning project. For production use, additional security measures, testing, and optimizations are recommended.
