
"use client"

import React from "react"
import { Heart, MessageCircle, Share2, Star, ChevronLeft, ChevronRight, Trash2, Check, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ShareModal } from "./ShareModal"
import { ScoreModal } from "./ScoreModal"
import { useFeed } from "@/hooks/useFeed"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface FeedPost {
  _id: string
  user_id: string
  title: string
  description: string
  images: string[]
  category: string
  tags: string[]
  total_score: number
  comments_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  __v: number
  user: {
    first_name: string
    last_name: string
    email: string
    is_vetted: boolean
    responder_info?: {
      job_title: string
      years_of_experience: number
      skills: string[]
      rank_status: {
        _id: string
        rank_name: string
        rank_color: string
        min_tasks_completed: number
        min_rating: number
        __v: number
        createdAt: string
        updatedAt: string
      }
      availability_status: string
    }
  }
  has_scored: boolean
  people_score_count: number
}

interface FeedCardProps {
  post: FeedPost
  onLike?: () => void
  onUnlike?: () => void
  onComment?: (content: string) => void
  onDeleteComment?: (commentId: string) => void
  onDeletePost?: (postId: string) => void
  initialLiked?: boolean
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
  const navigate = useNavigate()
  const [showComments, setShowComments] = React.useState(false)
  const [showShareModal, setShowShareModal] = React.useState(false)
  const [showScoreModal, setShowScoreModal] = React.useState(false)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [commentText, setCommentText] = React.useState("")
  const [currentScore, setCurrentScore] = React.useState(post.total_score)
  const [currentPeopleCount, setCurrentPeopleCount] = React.useState(post.people_score_count)
  const [fetchedComments, setFetchedComments] = React.useState<any[]>([])
  const [commentsLoaded, setCommentsLoaded] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<any>(null)

  const { getPostComments } = useFeed()
  const { loggedInUser } = useAuth()

  const commentsQuery = getPostComments(post._id)

  // Fetch current user
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loggedInUser()
        setCurrentUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [])

  // Load comments when showComments is true
  React.useEffect(() => {
    if (showComments && !commentsLoaded) {
      setFetchedComments(commentsQuery.data || [])
      setCommentsLoaded(true)
    }
  }, [showComments, commentsQuery.data, commentsLoaded])

  const handleImageChange = (newIndex: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex(newIndex)
      setIsTransitioning(false)
    }, 150)
  }

  const handlePrevImage = () => {
    const newIndex = currentImageIndex === 0 ? post.images.length - 1 : currentImageIndex - 1
    handleImageChange(newIndex)
  }

  const handleNextImage = () => {
    const newIndex = currentImageIndex === post.images.length - 1 ? 0 : currentImageIndex + 1
    handleImageChange(newIndex)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim() && onComment) {
      onComment(commentText.trim())
      setCommentText("")
    }
  }

  const formatScore = (score: number) => {
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`
    }
    return score.toString()
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if not clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, a, input, [role="menu"], [role="menuitem"]')) {
      return
    }
    navigate(`/feed/${post._id}`)
  }

  const handleDeletePost = () => {
    if (onDeletePost && window.confirm("Are you sure you want to delete this post?")) {
      onDeletePost(post._id)
    }
  }

  // Check if current user is the post owner
  const isOwner = currentUser && currentUser.user_id === post.user_id

  return (
    <>
      {/* Full Width Card - Instagram Style */}
      <div
        className="bg-white dark:bg-gray-800 border-0 border-b border-gray-200 dark:border-gray-700 w-full mb-0 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* User Header - With padding and color coding */}
        <div className="px-3 sm:px-4 py-2.5">
          <div className="flex items-center space-x-2.5">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.user.first_name)}`}
                alt={`${post.user.first_name} ${post.user.last_name}`}
              />
              <AvatarFallback style={{ fontSize: '12px' }}>
                {post.user.first_name?.[0]}
                {post.user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate" style={{ fontSize: '12px' }}>
                  {post.user.first_name} {post.user.last_name}
                </h4>
                {post.user.is_vetted && (
                  <>
                    <Check className="h-3 w-3 text-green-600" />
                    <span className="text-gray-400" style={{ fontSize: '12px' }}>•</span>
                  </>
                )}
                {post.user.responder_info?.rank_status && (
                  <span
                    className="text-xs capitalize px-1.5 py-0.5 rounded-full"
                    style={{
                      fontSize: '12px',
                      backgroundColor: post.user.responder_info.rank_status.rank_color + '20',
                      color: post.user.responder_info.rank_status.rank_color
                    }}
                  >
                    {post.user.responder_info.rank_status.rank_name}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400" style={{ fontSize: '12px' }}>
                {post.user.is_vetted && post.user.responder_info && (
                  <>
                    <span>{post.user.responder_info.job_title}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 mr-0.5" />
                      <span>{post.user.responder_info.years_of_experience}y</span>
                    </div>
                    <span>•</span>
                  </>
                )}
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {/* Menu Dropdown - Only show for post owner */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 z-50">
                  <DropdownMenuItem
                    onClick={handleDeletePost}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Content - With padding */}
        <div className="px-3 sm:px-4 pb-2.5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5" style={{ fontSize: '14px' }}>{post.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2.5 line-clamp-3" style={{ fontSize: '12px' }}>
            {post.description}
          </p>
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="px-1.5 py-0.5" style={{ fontSize: '12px' }}>
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="px-1.5 py-0.5" style={{ fontSize: '12px' }}>
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Images Carousel - Full Width Natural Height */}
        {post.images.length > 0 && (
          <div className="relative w-full">
            <div className="w-full overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`${post.title} - Image ${index + 1}`}
                    className="w-full h-[586px] object-cover flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Image Navigation */}
            {post.images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                )}
                {currentImageIndex < post.images.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions - With padding */}
        <div className="px-3 sm:px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowScoreModal(true)
                }}
                className={`flex items-center space-x-1.5 transition-colors ${post.has_scored ? "text-red-500" : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                  }`}
              >
                <Star className={`h-4 w-4 ${post.has_scored ? "fill-red-500 text-red-500" : ""}`} />
                <span className="font-medium" style={{ fontSize: '12px' }}>
                  {currentPeopleCount} people • score {formatScore(currentScore)}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowComments(!showComments)
                }}
                className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium" style={{ fontSize: '12px' }}>{post.comments_count} comments</span>
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowShareModal(true)
              }}
              className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-medium" style={{ fontSize: '12px' }}>Share</span>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex items-start space-x-2.5">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=currentuser" alt="You" />
                  <AvatarFallback style={{ fontSize: '12px' }}>YU</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 flex space-x-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                    style={{ fontSize: '12px' }}
                  />
                  {commentText.trim() && (
                    <button type="submit" className="text-primary hover:text-primary/80 font-medium" style={{ fontSize: '12px' }}>
                      Post
                    </button>
                  )}
                </div>
              </form>

              {/* Comments List - Populated from API */}
              {fetchedComments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-2.5">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(comment.user_id.first_name)}`}
                      alt={`${comment.user_id.first_name} ${comment.user_id.last_name}`}
                    />
                    <AvatarFallback style={{ fontSize: '12px' }}>
                      {comment.user_id.first_name?.[0]}
                      {comment.user_id.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center space-x-1">
                          <p className="font-medium text-gray-900 dark:text-white" style={{ fontSize: '12px' }}>
                            {comment.user_id.first_name} {comment.user_id.last_name}
                          </p>
                          <span className="text-gray-400" style={{ fontSize: '12px' }}>•</span>
                          <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: '12px' }}>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => onDeleteComment?.(comment._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300" style={{ fontSize: '12px' }}>{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} post={{ ...post, id: post._id }} />
      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        postId={post._id}
        hasScored={post.has_scored}
        currentUserScore={post.has_scored ? 8 : 0}
      />
    </>
  )
}
