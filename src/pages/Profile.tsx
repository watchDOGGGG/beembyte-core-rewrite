import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ChangePassword } from '@/components/profile/ChangePassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from "@/components/ui/sonner";
import { useAuth } from '@/hooks/useAuth';
import { userApiService } from '@/services/userApi';
import { User } from '@/types';

const Profile = () => {
  const { loggedInUser } = useAuth();
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
  }, []); // Empty dependency array - only run once on mount

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="profile-page max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-bold mb-6">My Profile</h1>

      <div className="space-y-6">
        <ProfileCard user={user} />

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Profile Information</h2>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="h-8 px-3"
              >
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  value={user?.first_name || ''}
                  placeholder="Your first name"
                  readOnly
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  value={user?.last_name || ''}
                  placeholder="Your last name"
                  readOnly
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  placeholder="Your email address"
                  readOnly
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="text"
                  value={user?.phone_number || ''}
                  placeholder="Your phone number"
                  readOnly
                  className="h-8"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-8 px-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-taskApp-lightPurple h-8 px-3"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <h3 className="text-gray-500">Full Name</h3>
                <p className="font-medium">{user?.first_name} {user?.last_name}</p>
              </div>

              <div>
                <h3 className="text-gray-500">Email</h3>
                <p className="font-medium">{user?.email}</p>
              </div>

              <div>
                <h3 className="text-gray-500">Wallet Balance</h3>
                <p className="font-medium text-beembyte-blue">
                  ₦{user?.wallet_id?.balance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          )}
        </Card>

        <ChangePassword />

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Account Actions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/wallet')}
              className="h-8"
            >
              Manage Wallet
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/task-history')}
              className="h-8"
            >
              View Task History
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
