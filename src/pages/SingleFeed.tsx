
import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Star, ChevronLeft, ChevronRight, Share2, MessageCircle, Check, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScoreModal } from "@/components/feed/ScoreModal"
import { CommentModal } from "@/components/feed/CommentModal"
import { ShareModal } from "@/components/feed/ShareModal"
import { useFeed } from "@/hooks/useFeed"
import { useAuth } from "@/hooks/useAuth"

export const SingleFeed: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [user, setUser] = useState<any>(null)

  const { getPost, getSuggestedPostsByUser, deletePost } = useFeed()
  const { loggedInUser } = useAuth()

  // Fetch user data
  React.useEffect(() => {
    let isMounted = true
    let hasFetched = false

    const getUser = async () => {
      if (!hasFetched) {
        hasFetched = true
        try {
          const userData = await loggedInUser()
          if (userData && isMounted) {
            setUser(userData)
          }
        } catch (error) {
          console.error("Error fetching user:", error)
          setUser(null)
        }
      }
    }
    getUser()
    return () => {
      isMounted = false
    }
  }, [])

  // Fetch single post data
  const { data: postResponse, isLoading: isLoadingPost, error: postError } = getPost(postId || '')
  const post = postResponse?.data

  // Fetch suggested posts if we have post data - pass the actual user_id
  const { data: suggestedPosts = [], isLoading: isLoadingSuggested } = getSuggestedPostsByUser(
    postId || '',
    post?.user_id || ''
  )

  console.log('Post data:', post)
  console.log('Suggested posts:', suggestedPosts)

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading post...</div>
      </div>
    )
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Post not found</p>
          <Button onClick={() => navigate('/feed')}>Back to Feed</Button>
        </div>
      </div>
    )
  }

  const formatScore = (score: number) => {
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`
    }
    return score.toString()
  }

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId || '')
        navigate('/feed')
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  // Check if current user is the post owner
  const isOwner = user && post && user.user_id === post.user_id

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/feed')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
          {/* Menu Dropdown - Only show for post owner */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
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
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={post.images[currentImageIndex]}
                    alt={`${post.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                </div>

                {/* Image Navigation */}
                {post.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex(prev =>
                        prev === 0 ? post.images.length - 1 : prev - 1
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={() => setCurrentImageIndex(prev =>
                        prev === post.images.length - 1 ? 0 : prev + 1
                      )}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {post.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Post Content */}
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-foreground" style={{ fontSize: '18px' }}>{post.title}</h1>

              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: '14px' }}>
                {post.description}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" style={{ fontSize: '12px' }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <div className="flex flex-wrap w-full gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowScoreModal(true)}
                    className="flex items-center gap-1 text-xs min-w-0"
                  >
                    <Star className={`h-4 w-4 ${post.has_scored ? "fill-red-500 text-red-500" : ""}`} />
                    <span className="truncate">
                      {post.people_score_count || 0} people • score {formatScore(post.total_score)}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowCommentModal(true)}
                    className="flex items-center gap-1 text-xs min-w-0"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="truncate">{post.comments_count} comments</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-1 text-xs min-w-0"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="truncate">Share</span>
                  </Button>
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.user.first_name)}`}
                      alt={`${post.user.first_name} ${post.user.last_name}`}
                    />
                    <AvatarFallback>
                      {post.user.first_name[0]}
                      {post.user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold" style={{ fontSize: '18px' }}>
                      {post.user.first_name} {post.user.last_name}
                    </h3>
                    {post.user.is_vetted && post.user.responder_info && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium" style={{ fontSize: '12px' }}>
                            Vetted Verified
                          </span>
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                          {post.user.responder_info.job_title}
                        </p>
                        {post.user.responder_info.rank_status && (
                          <Badge
                            variant="outline"
                            className="capitalize"
                            style={{
                              fontSize: '12px',
                              backgroundColor: post.user.responder_info.rank_status.rank_color + '20',
                              borderColor: post.user.responder_info.rank_status.rank_color,
                              color: post.user.responder_info.rank_status.rank_color
                            }}
                          >
                            {post.user.responder_info.rank_status.rank_name}
                          </Badge>
                        )}
                      </div>
                    )}
                    {!post.user.is_vetted && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                          Community Member
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                          Joined {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  {post.user.is_vetted && post.user.responder_info && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground" style={{ fontSize: '12px' }}>Experience:</span>
                        <span style={{ fontSize: '12px' }}>{post.user.responder_info.years_of_experience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground" style={{ fontSize: '12px' }}>Status:</span>
                        <Badge variant="outline" className="text-green-600" style={{ fontSize: '12px' }}>
                          {post.user.responder_info.availability_status}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Posts */}
            {suggestedPosts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4" style={{ fontSize: '14px' }}>
                    More from {post.user.first_name}
                  </h3>
                  <div className="space-y-4">
                    {suggestedPosts.map((suggestedPost) => (
                      <div
                        key={suggestedPost._id}
                        className="cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                        onClick={() => navigate(`/feed/${suggestedPost._id}`)}
                      >
                        <div className="flex space-x-3">
                          {suggestedPost.images?.[0] && (
                            <img
                              src={suggestedPost.images[0]}
                              alt={suggestedPost.title}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg"
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium line-clamp-2" style={{ fontSize: '12px' }}>
                              {suggestedPost.title}
                            </h4>
                            <p className="text-muted-foreground mt-1" style={{ fontSize: '12px' }}>
                              {formatScore(suggestedPost.total_score)} score • {suggestedPost.comments_count} comments
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Score Modal */}
      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        postId={post._id}
        currentUserScore={post.has_scored ? 8 : 0}
        hasScored={post.has_scored}
      />

      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        postId={post._id}
        currentUser={user}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={{
          id: post._id,
          title: post.title,
          description: post.description
        }}
      />
    </div>
  )
}
