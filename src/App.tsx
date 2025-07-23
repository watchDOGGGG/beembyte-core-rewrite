import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TaskDetails from './pages/TaskDetails';
import PostTask from './pages/PostTask';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import TaskHistory from './pages/TaskHistory';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import { AppProvider } from './context/AppContext';
import UserProfile from "@/pages/UserProfile";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/task/:taskId" element={<TaskDetails />} />
          <Route path="/post-task" element={<PostTask />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/task-history" element={<TaskHistory />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

