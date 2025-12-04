# Chattr

A real-time chat application built with React and Node.js, featuring user authentication and live messaging capabilities.

## Project Overview

Chattr is a full-stack chat application that enables users to communicate in real-time. The application features user authentication, real-time messaging using WebSockets, and a modern, responsive UI built with React and Tailwind CSS.

## Tech Stack

### Frontend
- **React** - UI library for building the user interface
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

## Project Structure

```
Chattr/
├── chattr-backend/          # Backend server
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
│
├── src/                     # Frontend source code
│   ├── components/          # React components
│   │   ├── Dashboard.jsx   # Main chat interface
│   │   ├── Login.jsx       # Login page
│   │   └── Signup.jsx      # Signup page
│   ├── context/            # React context providers
│   ├── services/           # API services
│   ├── App.jsx             # Main App component
│   └── main.jsx            # Application entry point
│
├── public/                  # Static assets
├── dist/                    # Production build output
└── package.json            # Frontend dependencies
```

## Features

- **User Authentication**
  - Signup with username, email, and password
  - Login with username/email and password
  - JWT-based authentication
  - Password encryption with bcrypt

- **Real-time Messaging**
  - Live chat using Socket.IO
  - Message persistence in MongoDB
  - Real-time message delivery

- **Modern UI**
  - Responsive design with Tailwind CSS
  - Clean and intuitive interface
  - Smooth user experience

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Chattr
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd chattr-backend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `chattr-backend` directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd chattr-backend
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-restart)

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user
- Real-time messaging via Socket.IO

## License

This project is part of a capstone project.
