import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppContextProvider } from "./context/AppContext"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Feed from "./pages/Feed"
import Chat from "./pages/Chat"
import ChatRoom from "./pages/ChatRoom"
import { Tasks } from "./pages/Tasks"
import { TaskDetails } from "./pages/TaskDetails"
import { CreateTask } from "./pages/CreateTask"
import { EditTask } from "./pages/EditTask"
import { TaskManagement } from "./pages/TaskManagement"
import { TaskAssignment } from "./pages/TaskAssignment"
import { TaskCompletion } from "./pages/TaskCompletion"
import { TaskReporting } from "./pages/TaskReporting"
import { TaskCollaboration } from "./pages/TaskCollaboration"
import { TaskAnalytics } from "./pages/TaskAnalytics"
import { TaskNotifications } from "./pages/TaskNotifications"
import { TaskSearch } from "./pages/TaskSearch"
import { TaskFilters } from "./pages/TaskFilters"
import { TaskComments } from "./pages/TaskComments"
import { TaskAttachments } from "./pages/TaskAttachments"
import { TaskReminders } from "./pages/TaskReminders"
import { TaskDependencies } from "./pages/TaskDependencies"
import { TaskSubtasks } from "./pages/TaskSubtasks"
import { TaskGanttChart } from "./pages/TaskGanttChart"
import { TaskKanbanBoard } from "./pages/TaskKanbanBoard"
import { TaskCalendar } from "./pages/TaskCalendar"
import { TaskTimeTracking } from "./pages/TaskTimeTracking"
import { TaskBilling } from "./pages/TaskBilling"
import { TaskIntegrations } from "./pages/TaskIntegrations"
import { TaskMobileApp } from "./pages/TaskMobileApp"
import { TaskAccessibility } from "./pages/TaskAccessibility"
import { TaskSecurity } from "./pages/TaskSecurity"
import { TaskSupport } from "./pages/TaskSupport"
import { TaskPricing } from "./pages/TaskPricing"
import { TaskFaq } from "./pages/TaskFaq"
import { TaskBlog } from "./pages/TaskBlog"
import { TaskCaseStudies } from "./pages/TaskCaseStudies"
import { TaskTestimonials } from "./pages/TaskTestimonials"
import { TaskContact } from "./pages/TaskContact"
import { TaskAbout } from "./pages/TaskAbout"
import { TaskHome } from "./pages/TaskHome"
import { TaskFeatures } from "./pages/TaskFeatures"
import { TaskSolutions } from "./pages/TaskSolutions"
import { TaskIndustries } from "./pages/TaskIndustries"
import { TaskCustomers } from "./pages/TaskCustomers"
import { TaskResources } from "./pages/TaskResources"
import { TaskCompany } from "./pages/TaskCompany"
import { TaskCareers } from "./pages/TaskCareers"
import { TaskPress } from "./pages/TaskPress"
import { TaskLegal } from "./pages/TaskLegal"
import { TaskPrivacy } from "./pages/TaskPrivacy"
import { TaskTerms } from "./pages/TaskTerms"
import { TaskSitemap } from "./pages/TaskSitemap"
import { TaskNotFound } from "./pages/TaskNotFound"
import { TaskServerError } from "./pages/TaskServerError"
import { TaskForbidden } from "./pages/TaskForbidden"
import { TaskUnauthorized } from "./pages/TaskUnauthorized"
import { TaskBadRequest } from "./pages/TaskBadRequest"
import { TaskPaymentRequired } from "./pages/TaskPaymentRequired"
import { TaskTooManyRequests } from "./pages/TaskTooManyRequests"
import { TaskUpgradeRequired } from "./pages/TaskUpgradeRequired"
import { TaskNotImplemented } from "./pages/TaskNotImplemented"
import { TaskServiceUnavailable } from "./pages/TaskServiceUnavailable"
import { TaskGatewayTimeout } from "./pages/TaskGatewayTimeout"
import { TaskInsufficientStorage } from "./pages/TaskInsufficientStorage"
import { TaskLoopDetected } from "./pages/TaskLoopDetected"
import { TaskNetworkAuthenticationRequired } from "./pages/TaskNetworkAuthenticationRequired"
import SuggestedUsersPage from "./pages/SuggestedUsers"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:roomId" element={<ChatRoom />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/tasks/edit/:id" element={<EditTask />} />
              <Route path="/task-management" element={<TaskManagement />} />
              <Route path="/task-assignment" element={<TaskAssignment />} />
              <Route path="/task-completion" element={<TaskCompletion />} />
              <Route path="/task-reporting" element={<TaskReporting />} />
              <Route path="/task-collaboration" element={<TaskCollaboration />} />
              <Route path="/task-analytics" element={<TaskAnalytics />} />
              <Route path="/task-notifications" element={<TaskNotifications />} />
              <Route path="/task-search" element={<TaskSearch />} />
              <Route path="/task-filters" element={<TaskFilters />} />
              <Route path="/task-comments" element={<TaskComments />} />
              <Route path="/task-attachments" element={<TaskAttachments />} />
              <Route path="/task-reminders" element={<TaskReminders />} />
              <Route path="/task-dependencies" element={<TaskDependencies />} />
              <Route path="/task-subtasks" element={<TaskSubtasks />} />
              <Route path="/task-gantt-chart" element={<TaskGanttChart />} />
              <Route path="/task-kanban-board" element={<TaskKanbanBoard />} />
              <Route path="/task-calendar" element={<TaskCalendar />} />
              <Route path="/task-time-tracking" element={<TaskTimeTracking />} />
              <Route path="/task-billing" element={<TaskBilling />} />
              <Route path="/task-integrations" element={<TaskIntegrations />} />
              <Route path="/task-mobile-app" element={<TaskMobileApp />} />
              <Route path="/task-accessibility" element={<TaskAccessibility />} />
              <Route path="/task-security" element={<TaskSecurity />} />
              <Route path="/task-support" element={<TaskSupport />} />
              <Route path="/task-pricing" element={<TaskPricing />} />
              <Route path="/task-faq" element={<TaskFaq />} />
              <Route path="/task-blog" element={<TaskBlog />} />
              <Route path="/task-case-studies" element={<TaskCaseStudies />} />
              <Route path="/task-testimonials" element={<TaskTestimonials />} />
              <Route path="/task-contact" element={<TaskContact />} />
              <Route path="/task-about" element={<TaskAbout />} />
              <Route path="/task-home" element={<TaskHome />} />
              <Route path="/task-features" element={<TaskFeatures />} />
              <Route path="/task-solutions" element={<TaskSolutions />} />
              <Route path="/task-industries" element={<TaskIndustries />} />
              <Route path="/task-customers" element={<TaskCustomers />} />
              <Route path="/task-resources" element={<TaskResources />} />
              <Route path="/task-company" element={<TaskCompany />} />
              <Route path="/task-careers" element={<TaskCareers />} />
              <Route path="/task-press" element={<TaskPress />} />
              <Route path="/task-legal" element={<TaskLegal />} />
              <Route path="/task-privacy" element={<TaskPrivacy />} />
              <Route path="/task-terms" element={<TaskTerms />} />
              <Route path="/task-sitemap" element={<TaskSitemap />} />
              <Route path="/task-not-found" element={<TaskNotFound />} />
              <Route path="/task-server-error" element={<TaskServerError />} />
              <Route path="/task-forbidden" element={<TaskForbidden />} />
              <Route path="/task-unauthorized" element={<TaskUnauthorized />} />
              <Route path="/task-bad-request" element={<TaskBadRequest />} />
              <Route path="/task-payment-required" element={<TaskPaymentRequired />} />
              <Route path="/task-too-many-requests" element={<TaskTooManyRequests />} />
              <Route path="/task-upgrade-required" element={<TaskUpgradeRequired />} />
              <Route path="/task-not-implemented" element={<TaskNotImplemented />} />
              <Route path="/task-service-unavailable" element={<TaskServiceUnavailable />} />
              <Route path="/task-gateway-timeout" element={<TaskGatewayTimeout />} />
              <Route path="/task-insufficient-storage" element={<TaskInsufficientStorage />} />
              <Route path="/task-loop-detected" element={<TaskLoopDetected />} />
              <Route path="/task-network-authentication-required" element={<TaskNetworkAuthenticationRequired />} />
              <Route path="/suggested-users" element={<SuggestedUsersPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
