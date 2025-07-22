
import { GoogleOAuthProvider } from '@google-oauth/google-login';
import { GOOGLE_CLIENT_ID } from '@/config/env';

interface GoogleOAuthWrapperProps {
  children: React.ReactNode;
}

export const GoogleOAuthWrapper: React.FC<GoogleOAuthWrapperProps> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};
