
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useAuthGuard = (requireAuth = true) => {
  const { verifyAuthToken } = useAuth()
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check only cookie for auth (no localStorage dependency)
  const hasAuthCookie = document.cookie.includes('authToken=');

  // Verify token on every page load
  useEffect(() => {
    const verifyAuth = async () => {
      if (hasAuthCookie) {
        console.log("Verifying auth token for route:", location.pathname);
        try {
          const result = await verifyAuthToken();
          setIsAuthenticated(result?.success || false);
        } catch (error) {
          console.log("Token verification failed:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [hasAuthCookie, location.pathname]);

  // Handle redirect to login when not authenticated (only for protected routes)
  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated) {
      console.log(`Protected route access attempted: ${location.pathname}`);
      toast.error("Please login to access this page");
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, requireAuth]);

  return { isAuthenticated, isLoading };
};
