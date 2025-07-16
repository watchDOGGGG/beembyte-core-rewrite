import { API_BASE_URL } from "../config/env";

interface FieldError {
  msg: string;
  field?: string;
}

// Type definitions for requests and responses
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyCodeRequest {
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  code: string;
  type: string;
}

export interface ResetPasswordRequest {
  code: string;
  new_password: string;
  confirm_password: string;
  user_id: string;
}

export interface AuthResponse {
  errors?: FieldError[];
  success: boolean;
  message: string | { message: string; verified: boolean };
  data?: any;
  token?: string;
}

export interface VerifyOtpResponse {
  message: string;
  data: {
    email: string;
    user_id: string;
  };
  success: boolean;
}

// No longer using cookie storage - using credentials include

// Set forgot password data in cookie
const setForgotPasswordCookie = (userId: string, code: string) => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 15); // 15 minutes expiry
  document.cookie = `forgotPasswordUserId=${userId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  document.cookie = `forgotPasswordCode=${code}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
};

// Get forgot password data from cookie
const getForgotPasswordData = () => {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  return {
    userId: getCookie("forgotPasswordUserId"),
    code: getCookie("forgotPasswordCode"),
  };
};

// Clear forgot password cookies
const clearForgotPasswordCookies = () => {
  document.cookie =
    "forgotPasswordUserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "forgotPasswordCode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Authentication API service
export const authApi = {
  // Register a new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Failed to register. Please try again later.",
      };
    }
  },

  // Login a user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Failed to login. Please try again later.",
      };
    }
  },

  // Verify signup code
  verifyCode: async (verifyData: VerifyCodeRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/signup-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Verification error:", error);
      return {
        success: false,
        message: "Failed to verify code. Please try again later.",
      };
    }
  },

  // Resend verification code
  resendVerification: async (
    resendData: ResendVerificationRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/resend-signup-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resendData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        message: "Failed to resend verification code. Please try again later.",
      };
    }
  },

  // Forgot password - send email
  forgotPassword: async (
    forgotData: ForgotPasswordRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: "Failed to send reset email. Please try again later.",
      };
    }
  },

  // Verify OTP for forgot password
  verifyOtp: async (otpData: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();

      // Store user_id and code for password reset
      if (data.success && data.data?.user_id) {
        setForgotPasswordCookie(data.data.user_id, otpData.code);
      }

      return data;
    } catch (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        message: "Failed to verify OTP. Please try again later.",
        data: { email: "", user_id: "" },
      };
    }
  },

  // Reset password
  resetPassword: async (
    resetData: ResetPasswordRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      // Clear forgot password cookies after successful reset
      if (data.success) {
        clearForgotPasswordCookies();
      }

      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: "Failed to reset password. Please try again later.",
      };
    }
  },

  // Get forgot password data
  getForgotPasswordData,

  // Clear forgot password data
  clearForgotPasswordCookies,

  // Logout user - cookies are cleared by server
  logout: () => {
    clearForgotPasswordCookies();
  },

  verifyAuthToken: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-auth-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Don't try to parse response if request failed
      if (!response.ok) {
        return {
          success: false,
          message: "Token verification failed",
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("verify auth token error:", error);
      return {
        success: false,
        message: "Failed to verify auth token. Please try again later.",
      };
    }
  },
};
