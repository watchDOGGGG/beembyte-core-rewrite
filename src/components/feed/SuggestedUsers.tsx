
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkupButton } from './LinkupButton';
import { useNavigate } from 'react-router-dom';
import { useSuggestedUsers } from '@/hooks/useSuggestedUsers';
import { MoreHorizontal } from 'lucide-react';

export const SuggestedUsers: React.FC = () => {
  const navigate = useNavigate();
  const { data: suggestedUsers, isLoading } = useSuggestedUsers(5, 0); // Show 5 users on feed

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleViewAll = () => {
    navigate('/suggested-users');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Suggested for you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Suggested for you</CardTitle>
        <button
          onClick={handleViewAll}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <MoreHorizontal className="h-4 w-4 mr-1" />
          View all
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user._id} className="flex items-center space-x-3">
              <Avatar 
                className="h-10 w-10 cursor-pointer" 
                onClick={() => handleUserClick(user.user_id)}
              >
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.first_name)}`}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <AvatarFallback className="text-xs">
                  {user.first_name[0]}{user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h4 
                  className="font-medium text-sm truncate cursor-pointer hover:underline"
                  onClick={() => handleUserClick(user.user_id)}
                >
                  {user.first_name} {user.last_name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {user.is_vetted && user.responder_id?.job_title 
                    ? user.responder_id.job_title 
                    : 'Community Member'}
                </p>
                {user.responder_id?.rank_status && (
                  <span 
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: user.responder_id.rank_status.rank_color + '20',
                      color: user.responder_id.rank_status.rank_color
                    }}
                  >
                    {user.responder_id.rank_status.rank_name}
                  </span>
                )}
              </div>
              
              <LinkupButton userId={user.user_id} className="text-xs" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
