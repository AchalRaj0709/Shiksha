# 🎓 Shiksha - Educational Learning Platform

A modern, full-stack educational platform built with React and Node.js, featuring comprehensive authentication, course management, and a premium UI/UX design inspired by Udemy.

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX**: Dark theme with vibrant purple gradients and glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Course Listings**: Beautiful course cards with ratings, pricing, and instructor information
- **Category Navigation**: Horizontal scrollable category filter
- **Search Functionality**: Integrated search across the platform
- **Smooth Animations**: Professional micro-interactions and hover effects

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
cd Shiksha
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies
```bash
cd server
npm install
```

#### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Environment
NODE_ENV=development
PORT=5000

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

#### 5. Start MongoDB
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, just ensure your connection string is correct in .env
```

#### 6. Start the Backend Server
```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

#### 7. Start the Frontend
```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
Shiksha/
├── server/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   └── rateLimiter.js    # Rate limiting
│   ├── models/
│   │   └── User.js           # User model with auth features
│   ├── routes/
│   │   └── auth.js           # Authentication routes
│   ├── utils/
│   │   ├── email.js          # Email sending utilities
│   │   └── jwt.js            # JWT utilities
│   ├── .env                  # Environment variables
│   ├── .gitignore
│   ├── index.js              # Server entry point
│   └── package.json
│
├── src/                       # Frontend (React + Vite)
│   ├── components/
│   │   ├── AuthModal.jsx     # Login/Signup modal
│   │   ├── AuthModal.css
│   │   ├── CategoryNav.jsx   # Category navigation
│   │   ├── CategoryNav.css
│   │   ├── CourseCard.jsx    # Course card component
│   │   ├── CourseCard.css
│   │   ├── CourseGrid.jsx    # Course grid layout
│   │   ├── CourseGrid.css
│   │   ├── Navbar.jsx        # Navigation bar
│   │   └── Navbar.css
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── utils/
│   │   └── api.js            # API utilities with axios
│   ├── App.jsx               # Main app component
│   ├── App.css
│   ├── index.css             # Global styles & design system
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `POST /api/auth/refresh-token` - Refresh access token

### Email Verification
- `POST /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification email (protected)

### Password Reset
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Two-Factor Authentication
- `POST /api/auth/2fa/setup` - Setup 2FA (protected)
- `POST /api/auth/2fa/verify` - Verify and enable 2FA (protected)
- `POST /api/auth/2fa/disable` - Disable 2FA (protected)

## 🎯 Usage

### User Registration
1. Click "Sign Up" button in the navbar
2. Fill in name, email, and password
3. Submit the form
4. Check email for verification link
5. Click verification link to activate account

### User Login
1. Click "Sign In" button
2. Enter email and password
3. If 2FA is enabled, enter 6-digit code
4. Successfully logged in

### Enable 2FA
1. Login to your account
2. Go to Account Settings
3. Click "Enable 2FA"
4. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
5. Enter verification code
6. Save backup codes securely

### Password Reset
1. Click "Forgot Password" on login page
2. Enter your email address
3. Check email for reset link
4. Click link and enter new password
5. Login with new password

## 🎨 Design System

### Colors
- **Primary**: `#a435f0` (Purple)
- **Secondary**: `#5624d0` (Dark Purple)
- **Accent**: `#f3722c` (Orange)
- **Success**: `#0cce6b` (Green)
- **Warning**: `#f4c430` (Yellow)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Effects
- Glassmorphism with backdrop blur
- Smooth transitions (150ms - 350ms)
- Gradient backgrounds
- Box shadows with glow effects

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They contain sensitive information
2. **Use strong JWT secrets** - Generate random, complex strings
3. **Enable HTTPS in production** - Use SSL certificates
4. **Implement rate limiting** - Already configured for auth endpoints
5. **Validate all inputs** - Server-side validation is implemented
6. **Use httpOnly cookies** - Consider switching from localStorage for tokens
7. **Regular security audits** - Keep dependencies updated

## 📧 Email Configuration

### Using Gmail
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD`

### Using Other Providers
Update `EMAIL_HOST` and `EMAIL_PORT` in `.env`:
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:465`
- **SendGrid**: `smtp.sendgrid.net:587`

## 🗄️ MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod
```

### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist your IP address
5. Get connection string
6. Update `MONGODB_URI` in `.env`

## 🚧 Future Enhancements

- [ ] Course creation and management
- [ ] Video player integration
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Student progress tracking
- [ ] Instructor dashboard
- [ ] Course reviews and ratings
- [ ] Discussion forums
- [ ] Certificates generation
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for educational purposes

## 🙏 Acknowledgments

- Own Idea and its implementation
- Icons from Heroicons
- Images from Unsplash
- Avatars from DiceBear

---

**Note**: This is a learning project. For production use, additional security measures, testing, and optimizations are recommended.
