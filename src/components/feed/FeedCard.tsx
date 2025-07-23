import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Share2, Trash2, MessageCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommentSection } from './CommentSection';
import { useNavigate } from 'react-router-dom';

interface FeedCardProps {
  post: {
    _id: string;
    user_id: string;
    title: string;
    description: string;
    images: string[];
    videos?: string[];
    category: string;
    tags: string[];
    total_score: number;
    comments_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
      is_vetted: boolean;
      responder_info: {
        job_title: string;
        years_of_experience: number;
        skills: string[];
        rank_status: {
          _id: string;
          rank_name: string;
          rank_color: string;
          min_tasks_completed: number;
          min_rating: number;
          __v: number;
          createdAt: string;
          updatedAt: string;
        };
        availability_status: string;
      };
    };
    has_scored: boolean;
    people_score_count: number;
  };
  onLike: () => void;
  onUnlike: () => void;
  onComment: (content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onDeletePost: (postId: string) => void;
  initialLiked?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  onLike,
  onUnlike,
  onComment,
  onDeleteComment,
  onDeletePost,
  initialLiked = false,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialLiked);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLikeClick = () => {
    if (liked) {
      onUnlike();
    } else {
      onLike();
    }
    setLiked(!liked);
  };

  const handleCommentSubmit = () => {
    if (comment.trim() !== '') {
      onComment(comment);
      setComment('');
      setShowComments(true);
    }
  };

  const handleShare = (postId: string) => {
    const shareUrl = `${window.location.origin}/feed/${postId}`;
    navigator.clipboard.writeText(shareUrl);
  };

  const canDeletePost = post.user_id === 'user1';

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    }
  };

  const handleUserClick = () => {
    navigate(`/profile/${post.user_id}`);
  };

  const handleMessageUser = () => {
    navigate(`/chat?userId=${post.user_id}`);
  };

  return (
    <Card className="mb-0 rounded-none border-l-0 border-r-0 border-t-0 last:border-b-0 shadow-none bg-white">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar 
              className="h-10 w-10 cursor-pointer" 
              onClick={handleUserClick}
            >
              <AvatarImage
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.user.first_name)}`}
                alt={`${post.user.first_name} ${post.user.last_name}`}
              />
              <AvatarFallback>
                {post.user.first_name.charAt(0)}{post.user.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 
                  className="font-semibold text-sm cursor-pointer hover:underline"
                  onClick={handleUserClick}
                >
                  {post.user.first_name} {post.user.last_name}
                </h3>
                {post.user.is_vetted && (
                  <span className="text-blue-500 text-xs">✓</span>
                )}
                {post.user.responder_info?.rank_status && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${post.user.responder_info.rank_status.rank_color}20`,
                      color: post.user.responder_info.rank_status.rank_color,
                    }}
                  >
                    {post.user.responder_info.rank_status.rank_name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{getTimeAgo(post.created_at)}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMessageUser}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Message User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare(post._id)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              {canDeletePost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <h2 className="text-base font-semibold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-700 mb-3">{post.description}</p>
        {post.images && post.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-3">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 ${liked ? 'text-blue-500' : ''}`}
              onClick={handleLikeClick}
            >
              {liked ? 'Unlike' : 'Like'}
              <span className="text-xs text-gray-500">{post.total_score}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setShowComments(!showComments)}
            >
              Comment
              <span className="text-xs text-gray-500">{post.comments_count}</span>
            </Button>
          </div>
        </div>

        {/* Comment Section */}
        {showComments && (
          <CommentSection
            postId={post._id}
            comments={[]}
            onCommentSubmit={handleCommentSubmit}
            onDeleteComment={onDeleteComment}
          />
        )}
      </div>
    </Card>
  );
};
