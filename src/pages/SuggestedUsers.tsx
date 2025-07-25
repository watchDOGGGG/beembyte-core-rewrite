
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkupButton } from '@/components/feed/LinkupButton';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/env';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

const SuggestedUsers: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 20;

  const { data: suggestedUsersData, isLoading, error } = useQuery({
    queryKey: ['all-suggested-users', currentPage],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/users/suggested-users?limit=${limit}&skip=${currentPage * limit}`, {
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

  const handleBack = () => {
    navigate('/feed');
  };

  const filteredUsers = suggestedUsersData?.filter(user => 
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
          <h1 className="text-2xl font-bold">Suggested Users</h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500">Error loading suggested users: {error.message}</p>
            </CardContent>
          </Card>
        )}

        {/* Users Grid */}
        {!isLoading && !error && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar 
                      className="h-12 w-12 cursor-pointer" 
                      onClick={() => handleUserClick(user.user_id)}
                    >
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.first_name)}`}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback className="text-sm">
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
                          className="text-xs px-1.5 py-0.5 rounded-full inline-block mt-1"
                          style={{
                            backgroundColor: user.responder_id.rank_status.rank_color + '20',
                            color: user.responder_id.rank_status.rank_color
                          }}
                        >
                          {user.responder_id.rank_status.rank_name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <LinkupButton userId={user.user_id} className="text-xs w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No suggested users found.</p>
            </CardContent>
          </Card>
        )}

        {/* Load More Button */}
        {!isLoading && !error && suggestedUsersData && suggestedUsersData.length >= limit && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setCurrentPage(prev => prev + 1)}
              variant="outline"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
