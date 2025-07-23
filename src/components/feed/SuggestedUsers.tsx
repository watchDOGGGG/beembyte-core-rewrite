import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkupButton } from './LinkupButton';
import { useNavigate } from 'react-router-dom';

interface SuggestedUser {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_vetted?: boolean;
  responder_info?: {
    job_title: string;
    rank_status?: {
      rank_name: string;
      rank_color: string;
    };
  };
}

// Mockup data for suggested users
const mockSuggestedUsers: SuggestedUser[] = [
  {
    _id: '1',
    user_id: 'user_1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@example.com',
    is_vetted: true,
    responder_info: {
      job_title: 'Frontend Developer',
      rank_status: {
        rank_name: 'Expert',
        rank_color: '#10B981'
      }
    }
  },
  {
    _id: '2',
    user_id: 'user_2',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'michael.chen@example.com',
    is_vetted: true,
    responder_info: {
      job_title: 'UI/UX Designer',
      rank_status: {
        rank_name: 'Professional',
        rank_color: '#3B82F6'
      }
    }
  },
  {
    _id: '3',
    user_id: 'user_3',
    first_name: 'Emma',
    last_name: 'Davis',
    email: 'emma.davis@example.com',
    is_vetted: false
  },
  {
    _id: '4',
    user_id: 'user_4',
    first_name: 'David',
    last_name: 'Wilson',
    email: 'david.wilson@example.com',
    is_vetted: true,
    responder_info: {
      job_title: 'Full Stack Developer',
      rank_status: {
        rank_name: 'Novice',
        rank_color: '#F59E0B'
      }
    }
  },
  {
    _id: '5',
    user_id: 'user_5',
    first_name: 'Lisa',
    last_name: 'Rodriguez',
    email: 'lisa.rodriguez@example.com',
    is_vetted: true,
    responder_info: {
      job_title: 'Product Manager'
    }
  }
];

export const SuggestedUsers: React.FC = () => {
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
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

  if (mockSuggestedUsers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Suggested for you</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockSuggestedUsers.slice(0, 5).map((user) => (
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
                  {user.is_vetted && user.responder_info?.job_title 
                    ? user.responder_info.job_title 
                    : 'Community Member'}
                </p>
                {user.responder_info?.rank_status && (
                  <span 
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: user.responder_info.rank_status.rank_color + '20',
                      color: user.responder_info.rank_status.rank_color
                    }}
                  >
                    {user.responder_info.rank_status.rank_name}
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