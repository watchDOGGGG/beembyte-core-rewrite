
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LinkupButton } from './LinkupButton';
import { useNavigate } from 'react-router-dom';

interface SuggestedUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string;
  is_verified?: boolean;
  responder_info?: {
    job_title?: string;
    rank_status?: {
      rank_name: string;
      rank_color: string;
    };
  };
}

export const SuggestedUsers: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data for now - in real app, this would come from an API
  const suggestedUsers: SuggestedUser[] = [
    {
      user_id: 'user123',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah@example.com',
      is_verified: true,
      responder_info: {
        job_title: 'UI/UX Designer',
        rank_status: {
          rank_name: 'Expert',
          rank_color: '#10B981'
        }
      }
    },
    {
      user_id: 'user456',
      first_name: 'Mike',
      last_name: 'Chen',
      email: 'mike@example.com',
      is_verified: true,
      responder_info: {
        job_title: 'Full Stack Developer',
        rank_status: {
          rank_name: 'Professional',
          rank_color: '#3B82F6'
        }
      }
    },
    {
      user_id: 'user789',
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'emily@example.com',
      responder_info: {
        job_title: 'Product Manager'
      }
    }
  ];

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Suggested for you</h3>
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user.user_id} className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer flex-1"
              onClick={() => handleUserClick(user.user_id)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={user.profile_picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.first_name)}`}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <AvatarFallback className="text-xs">
                  {getInitials(user.first_name, user.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  {user.is_verified && (
                    <span className="text-blue-500 text-xs">✓</span>
                  )}
                </div>
                {user.responder_info?.job_title && (
                  <p className="text-xs text-gray-500 truncate">
                    {user.responder_info.job_title}
                  </p>
                )}
              </div>
            </div>
            <LinkupButton userId={user.user_id} className="ml-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};
