import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Profile } from "./pages/Profile"
import { AppContextProvider } from "./context/AppContext"
import { Chat } from "./pages/Chat"
import { Task } from "./pages/Task"
import { Tasks } from "./pages/Tasks"
import { Feed } from "./pages/Feed"
import { ResetPassword } from "./pages/ResetPassword"
import { ForgotPassword } from "./pages/ForgotPassword"
import { VerifyEmail } from "./pages/VerifyEmail"
import { Upgrade } from "./pages/Upgrade"
import { Pricing } from "./pages/Pricing"
import { Settings } from "./pages/Settings"
import { PublicProfile } from "./pages/PublicProfile"
import { TaskDetails } from "./pages/TaskDetails"
import { CreateTask } from "./pages/CreateTask"
import { EditTask } from "./pages/EditTask"
import { GoogleLoginRedirect } from "./pages/GoogleLoginRedirect"
import SuggestedUsers from "./pages/SuggestedUsers"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout requireAuth={false}>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout requireAuth={false}>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout requireAuth={false}>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                <Layout>
                  <Chat />
                </Layout>
              }
            />
            <Route
              path="/task"
              element={
                <Layout>
                  <Task />
                </Layout>
              }
            />
            <Route
              path="/tasks"
              element={
                <Layout>
                  <Tasks />
                </Layout>
              }
            />
            <Route
              path="/feed"
              element={
                <Layout requireAuth={true}>
                  <Feed />
                </Layout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <Layout requireAuth={false}>
                  <ResetPassword />
                </Layout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Layout requireAuth={false}>
                  <ForgotPassword />
                </Layout>
              }
            />
            <Route
              path="/verify-email"
              element={
                <Layout requireAuth={false}>
                  <VerifyEmail />
                </Layout>
              }
            />
            <Route
              path="/upgrade"
              element={
                <Layout>
                  <Upgrade />
                </Layout>
              }
            />
            <Route
              path="/pricing"
              element={
                <Layout requireAuth={false}>
                  <Pricing />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <Layout>
                  <PublicProfile />
                </Layout>
              }
            />
            <Route
              path="/task/:taskId"
              element={
                <Layout>
                  <TaskDetails />
                </Layout>
              }
            />
            <Route
              path="/create-task"
              element={
                <Layout>
                  <CreateTask />
                </Layout>
              }
            />
            <Route
              path="/edit-task/:taskId"
              element={
                <Layout>
                  <EditTask />
                </Layout>
              }
            />
            <Route
              path="/google-login-redirect"
              element={<GoogleLoginRedirect />}
            />
            <Route
              path="/suggested-users"
              element={
                <Layout requireAuth={true}>
                  <SuggestedUsers />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
