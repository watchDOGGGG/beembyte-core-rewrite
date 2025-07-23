import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LinkupButton } from '@/components/feed/LinkupButton';
import { LinkupCount } from '@/components/feed/LinkupCount';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/config/env';
import { useFeed } from '@/hooks/useFeed';

interface UserProfile {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_vetted: boolean;
  responder_info?: {
    job_title: string;
    years_of_experience: number;
    skills: string[];
    rank_status: {
      rank_name: string;
      rank_color: string;
      min_tasks_completed: number;
      min_rating: number;
    };
    availability_status: string;
  };
  created_at: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { loggedInUser } = useAuth();
  const { getSuggestedPostsByUser } = useFeed();

  // Fetch user posts
  const { data: userPosts = [], isLoading: isLoadingPosts } = getSuggestedPostsByUser(
    '',
    userId || '',
    { enabled: !!userId }
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/users/profile/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const userData = await loggedInUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchUserProfile();
    fetchCurrentUser();
  }, [userId, loggedInUser]);

  const handleMessage = () => {
    // Navigate to chat with this user
    navigate(`/chat/user/${userId}`);
  };

  const isOwnProfile = currentUser && user && currentUser.user_id === user.user_id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Button onClick={() => navigate('/feed')}>Back to Feed</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.first_name)}`}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <AvatarFallback className="text-2xl">
                  {user.first_name[0]}{user.last_name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
                      {user.first_name} {user.last_name}
                      {user.is_vetted && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                    </h1>
                    <p className="text-muted-foreground text-sm mb-2">
                      {user.is_vetted && user.responder_info?.job_title 
                        ? user.responder_info.job_title 
                        : 'Community Member'}
                    </p>
                    <LinkupCount userId={user.user_id} className="mb-2" />
                  </div>

                  <div className="flex items-center gap-2 h-9">
                    {!isOwnProfile && (
                      <>
                        <Button 
                          onClick={handleMessage}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-white hover:bg-white border-gray-300 h-9"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">Message</span>
                        </Button>
                        <LinkupButton userId={user.user_id} />
                      </>
                    )}
                    {isOwnProfile && (
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/profile')}
                        className="h-9"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {user.is_vetted && user.responder_info && (
                  <div className="space-y-3">
                    {user.responder_info.rank_status && (
                      <Badge
                        variant="outline"
                        className="capitalize text-xs"
                        style={{
                          backgroundColor: user.responder_info.rank_status.rank_color + '20',
                          borderColor: user.responder_info.rank_status.rank_color,
                          color: user.responder_info.rank_status.rank_color
                        }}
                      >
                        {user.responder_info.rank_status.rank_name}
                      </Badge>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Experience:</span>
                        <div className="font-medium">{user.responder_info.years_of_experience} years</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div>
                          <Badge variant="outline" className="text-green-600 text-xs">
                            {user.responder_info.availability_status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {user.responder_info.skills && user.responder_info.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {user.responder_info.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {user.responder_info.skills.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{user.responder_info.skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!user.is_vetted && (
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Posts */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Posts by {user.first_name}
            </h2>
            
            {isLoadingPosts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-4">Loading posts...</p>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="grid gap-4">
                {userPosts.map((post: any) => (
                  <div
                    key={post._id}
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/feed/${post._id}`)}
                  >
                    <div className="flex space-x-4">
                      {post.images?.[0] && (
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {post.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{post.total_score} score</span>
                          <span>{post.comments_count} comments</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {isOwnProfile ? "You haven't posted anything yet." : `${user.first_name} hasn't posted anything yet.`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
