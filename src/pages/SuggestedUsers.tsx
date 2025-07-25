
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkupButton } from '@/components/feed/LinkupButton';
import { useNavigate } from 'react-router-dom';
import { useSuggestedUsers } from '@/hooks/useSuggestedUsers';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SuggestedUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: suggestedUsers, isLoading } = useSuggestedUsers(100, 0); // Show many users

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const filteredUsers = suggestedUsers?.filter(user =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Suggested Users</h1>
          <p className="text-gray-600 mb-4">Connect with other members of the community</p>
          
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

        <Card>
          <CardHeader>
            <CardTitle>All Suggested Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <Avatar 
                      className="h-12 w-12 cursor-pointer" 
                      onClick={() => handleUserClick(user.user_id)}
                    >
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.first_name)}`}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback>
                        {user.first_name[0]}{user.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => handleUserClick(user.user_id)}
                      >
                        {user.first_name} {user.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {user.is_vetted && user.responder_id?.job_title 
                          ? user.responder_id.job_title 
                          : 'Community Member'}
                      </p>
                      {user.responder_id?.rank_status && (
                        <span 
                          className="inline-block text-xs px-2 py-1 rounded-full mt-1"
                          style={{
                            backgroundColor: user.responder_id.rank_status.rank_color + '20',
                            color: user.responder_id.rank_status.rank_color
                          }}
                        >
                          {user.responder_id.rank_status.rank_name}
                        </span>
                      )}
                    </div>
                    
                    <LinkupButton userId={user.user_id} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SuggestedUsersPage;
