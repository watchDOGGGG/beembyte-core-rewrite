
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ChangePassword } from '@/components/profile/ChangePassword';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { userApiService } from '@/services/userApi';
import { User } from '@/types';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;
    
    const fetchUserProfile = async () => {
      if (!hasFetched) {
        hasFetched = true;
        try {
          setIsLoading(true);
          const response = await userApiService.getUserProfile();

          if (response.success && isMounted) {
            setUser(response.data);
          } else if (isMounted) {
            toast.error("Failed to load profile data");
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          if (isMounted) {
            toast.error("Failed to load profile data");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-1.5 sm:px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-1.5 sm:px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
      <ProfileHeader 
        user={user} 
        onEditClick={handleEdit}
      />

      <ProfileInfo
        user={user}
        isEditing={isEditing}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      <ChangePassword />

      <Card className="p-3 sm:p-6 bg-white shadow-sm">
        <h2 className="text-base sm:text-xl font-semibold mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/wallet')}
            className="justify-start hover:bg-primary hover:text-white transition-colors text-xs sm:text-sm p-2 sm:p-3"
          >
            💰 Manage Wallet
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/task-history')}
            className="justify-start hover:bg-primary hover:text-white transition-colors text-xs sm:text-sm p-2 sm:p-3"
          >
            📋 View Task History
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/feed')}
            className="justify-start hover:bg-primary hover:text-white transition-colors text-xs sm:text-sm p-2 sm:p-3"
          >
            🌟 Explore Feed
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
