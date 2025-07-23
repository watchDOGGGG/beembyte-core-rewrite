
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LinkupButton } from '@/components/feed/LinkupButton';
import { LinkupCount } from '@/components/feed/LinkupCount';
import { MessageCircle, ArrowLeft, Calendar, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useResponders } from '@/hooks/useResponders';

export const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();
  const { getResponderById } = useResponders();
  const [user, setUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const [userData, currentUserData] = await Promise.all([
          getResponderById(userId),
          loggedInUser()
        ]);
        
        setUser(userData);
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleMessageClick = () => {
    // Navigate to chat with this user
    navigate(`/chat?userId=${userId}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.user_id === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={user.profile_picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.first_name || '')}`}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <AvatarFallback className="text-lg">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h2>
                {user.is_verified && (
                  <span className="text-blue-500 text-lg">✓</span>
                )}
              </div>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {user.responder_info && (
              <div className="space-y-2">
                {user.responder_info.job_title && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>{user.responder_info.job_title}</span>
                  </div>
                )}
                {user.responder_info.rank_status && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                       style={{ 
                         backgroundColor: `${user.responder_info.rank_status.rank_color}20`,
                         color: user.responder_info.rank_status.rank_color 
                       }}>
                    {user.responder_info.rank_status.rank_name}
                  </div>
                )}
              </div>
            )}

            <LinkupCount userId={userId!} />

            {!isOwnProfile && (
              <div className="flex gap-3 pt-2">
                <LinkupButton userId={userId!} />
                <Button 
                  onClick={handleMessageClick}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">About</h3>
        <div className="space-y-3">
          {user.responder_info?.years_of_experience && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{user.responder_info.years_of_experience} years of experience</span>
            </div>
          )}
          
          {user.responder_info?.skills && user.responder_info.skills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {user.responder_info.skills.map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
