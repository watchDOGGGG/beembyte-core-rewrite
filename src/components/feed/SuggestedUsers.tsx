
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkupButton } from './LinkupButton';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/env';
import { ChevronRight } from 'lucide-react';

interface SuggestedUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_vetted?: boolean;
  user_id: string;
  responder_id?: {
    job_title: string;
    rank_status?: {
      rank_name: string;
      rank_color: string;
    };
  };
}

interface SuggestedUsersResponse {
  message: string;
  data: SuggestedUser[];
  success: boolean;
}

interface SuggestedUsersProps {
  limit?: number;
  showViewMore?: boolean;
}

export const SuggestedUsers: React.FC<SuggestedUsersProps> = ({ 
  limit = 5, 
  showViewMore = true 
}) => {
  const navigate = useNavigate();

  const { data: suggestedUsersData, isLoading, error } = useQuery({
    queryKey: ['suggested-users', limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/users/suggested-users?limit=${limit}&skip=0`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch suggested users');
      const result: SuggestedUsersResponse = await response.json();
      return result.data;
    },
  });

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleViewMore = () => {
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

  if (error || !suggestedUsersData || suggestedUsersData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Suggested for you</CardTitle>
          {showViewMore && (
            <button
              onClick={handleViewMore}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestedUsersData.slice(0, limit).map((user) => (
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
