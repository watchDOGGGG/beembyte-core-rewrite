"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  authApi,
  type RegisterRequest,
  type LoginRequest,
  type VerifyCodeRequest,
  type ResendVerificationRequest,
} from "../services/authApi"
import { handleApiErrors } from "@/utils/apiResponse"
import { useAppContext } from "@/context/AppContext"
import type { User } from "@/types"
import { socketService, socket } from "@/services/socket"
import { getCookie } from "@/utils/formatUtils"
import { userApiService } from "@/services/userApi"

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useAppContext()

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await authApi.register(userData)

      if (response.success) {
        toast.success(typeof response.message === 'string' ? response.message : "Registration successful! Please verify your email.")
        localStorage.setItem("authEmail", userData.email)
        navigate("/verify-code")
      } else {
        // For register, message is always a string
        const errorResponse = {
          ...response,
          message: typeof response.message === 'string' ? response.message : "Registration failed"
        }
        handleApiErrors(errorResponse)
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(credentials)

      if (response.success) {
        const successMessage = typeof response.message === 'string' ? response.message : "Login successful!"
        toast.success(successMessage)

        const { auth_token, user } = response.data
        // Token is now stored in cookie by the authApi.login function
        // User data is now stored in HTTP-only cookies

        // Ensure user is valid before setting it
        if (user) {
          setUser(user as User)

          // Connect to socket after successful login
          if (user.user_id && user.role) {
            try {
              // Use the socketService to connect
              socketService.connect(user.user_id, user.role)

              // Add error handling for socket connection
              socket.on("connect_error", (error) => {
                console.error("Socket connection error:", error)
                toast.error("Could not establish live connection. Some features may be limited.")
              })
            } catch (socketError) {
              console.error("Socket connection error:", socketError)
              // Show toast message but don't prevent login
              toast.error("Could not establish live connection. Some features may be limited.")
            }
          }
        }
        navigate("/")
      } else {
        // Check if the error is due to unverified email (only for login endpoint)
        if (typeof response.message === 'object' && response.message.verified === false) {
          localStorage.setItem("authEmail", credentials.email)
          toast.error("Please verify your email to continue")
          navigate("/verify-code")
        } else {
          // Convert response to handle string message for handleApiErrors
          const errorResponse = {
            ...response,
            message: typeof response.message === 'string' ? response.message : response.message?.message || "Login failed"
          }
          handleApiErrors(errorResponse)
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async (code: string) => {
    setIsLoading(true)
    try {
      const verifyData: VerifyCodeRequest = { code }
      const response = await authApi.verifyCode(verifyData)

      if (response.success) {
        localStorage.removeItem("authEmail")
        toast.success(typeof response.message === 'string' ? response.message : "Verification successful!")
        navigate("/login")
      } else {
        // For verifyCode, message is always a string
        const errorResponse = {
          ...response,
          message: typeof response.message === 'string' ? response.message : "Verification failed"
        }
        handleApiErrors(errorResponse)
      }
    } catch (error) {
      console.error("Verification error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    setIsLoading(true)
    try {
      const email = localStorage.getItem("authEmail")
      const resendData: ResendVerificationRequest = { email }
      const response = await authApi.resendVerification(resendData)

      if (response.success) {
        toast.success(typeof response.message === 'string' ? response.message : "Verification code resent successfully!")
        // Start countdown for 120 seconds (2 minutes)
        setResendCountdown(120)
        const countdownInterval = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        // For resendVerification, message is always a string
        const errorResponse = {
          ...response,
          message: typeof response.message === 'string' ? response.message : "Resend failed"
        }
        handleApiErrors(errorResponse)
      }
    } catch (error) {
      console.error("Resend verification error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Disconnect socket before logout
    try {
      socketService.disconnect()
    } catch (error) {
      console.error("Error disconnecting socket:", error)
      // Don't block logout due to socket issues
    }

    authApi.logout()
    setUser(null)
    navigate("/login")
    toast.success("Successfully logged out")
  }

  const verifyAuthToken = async () => {
    try {


      const response = await authApi.verifyAuthToken()
      if (!response.success) {
        // Clear invalid token and redirect
        authApi.logout()
        navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`)
      }
    } catch (error) {
      console.error("Auth token verification error:", error)
      // Clear potentially invalid token and redirect on error
      authApi.logout()
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`)
    }
  }

  const loggedInUser = async () => {
    try {
      const user = await userApiService.getUserProfile()
      return user.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  return {
    isLoading,
    register,
    login,
    verifyCode,
    resendVerification,
    resendCountdown,
    logout,
    verifyAuthToken,
    loggedInUser
  }
}
