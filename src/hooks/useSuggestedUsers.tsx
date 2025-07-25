
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/config/env';

interface SuggestedUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_vetted: boolean;
  user_id: string;
  responder_id?: {
    job_title: string;
    rank_status: {
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

export const useSuggestedUsers = (limit: number = 10, skip: number = 0) => {
  return useQuery({
    queryKey: ['suggested-users', limit, skip],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/users/suggested-users?limit=${limit}&skip=${skip}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggested users');
      }
      
      const result: SuggestedUsersResponse = await response.json();
      return result.data;
    },
  });
};
