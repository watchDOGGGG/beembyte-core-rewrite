
import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppProvider } from "./context/AppContext"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Feed from "./pages/Feed"
import Chat from "./pages/Chat"
import CreateTask from "./pages/CreateTask"
import TaskDetail from "./pages/TaskDetail"
import Wallet from "./pages/Wallet"
import Notifications from "./pages/Notifications"
import TaskHistory from "./pages/TaskHistory"
import SuggestedUsersPage from "./pages/SuggestedUsers"
import SingleFeed from "./pages/SingleFeed"
import UserProfile from "./pages/UserProfile"
import AboutUs from "./pages/AboutUs"
import Terms from "./pages/Terms"
import HelpCenter from "./pages/HelpCenter"
import Careers from "./pages/Careers"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import VerifyCode from "./pages/VerifyCode"
import VerifyOtp from "./pages/VerifyOtp"
import WaitingScreen from "./pages/WaitingScreen"
import PriceEstimate from "./pages/PriceEstimate"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/create-task" element={<CreateTask />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/task-history" element={<TaskHistory />} />
              <Route path="/suggested-users" element={<SuggestedUsersPage />} />
              <Route path="/feed/:id" element={<SingleFeed />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-code" element={<VerifyCode />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/waiting" element={<WaitingScreen />} />
              <Route path="/price-estimate" element={<PriceEstimate />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
