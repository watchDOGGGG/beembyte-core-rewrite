"use client"

import type React from "react"
import { useState } from "react"
import { ImageIcon, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFeed } from "@/hooks/useFeed"
import { useFileUpload } from "@/hooks/useFileUpload"
import type { User } from "@/types"

interface CreatePostCardProps {
  user: User
  onPostCreate: (postData: any) => Promise<void>
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ user, onPostCreate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [] as string[],
    category: "",
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState("")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const { isCreating } = useFeed()
  const { uploadFiles, isUploading } = useFileUpload()

  const dicebearUrl = user.first_name
    ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.first_name)}`
    : "https://api.dicebear.com/7.x/bottts/svg?seed=youruser"

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newImagePreviews: string[] = []
      
      newFiles.forEach((file) => {
        newImagePreviews.push(URL.createObjectURL(file))
      })
      
      setImageFiles([...imageFiles, ...newFiles])
      setImagePreviews([...imagePreviews, ...newImagePreviews])
    }
  }

  const removeImage = (indexToRemove: number) => {
    const updatedFiles = [...imageFiles]
    updatedFiles.splice(indexToRemove, 1)
    const updatedImagePreviews = [...imagePreviews]
    updatedImagePreviews.splice(indexToRemove, 1)
    setImageFiles(updatedFiles)
    setImagePreviews(updatedImagePreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Upload images first if any
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadFiles(imageFiles)
        if (uploadedUrls) {
          imageUrls = uploadedUrls
        }
      }

      const postData = {
        title: formData.title,
        description: formData.description,
        images: imageUrls,
        category: formData.category,
        tags: formData.tags,
      }
      
      await onPostCreate(postData)
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        images: [],
        category: "",
        tags: [],
      })
      setTagInput("")
      setImagePreviews([])
      setImageFiles([])
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  return (
    <>
      {/* New Trigger Card Design */}
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors">
        <div
          className="p-4 sm:p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-white dark:border-gray-800">
                  <AvatarImage src={dicebearUrl || "/placeholder.svg"} alt={user.first_name || "User"} />
                  <AvatarFallback className="text-xs">
                    {user.first_name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Create New Post</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Share your work with the community</p>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs font-medium">
                Title*
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
                required
                className="h-8 text-xs"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs font-medium">
                Description*
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your post..."
                required
                className="min-h-[60px] text-xs resize-none"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <Label htmlFor="category" className="text-xs font-medium">
                Category*
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags Input */}
            <div className="space-y-1">
              <Label htmlFor="tags" className="text-xs font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags (press Enter to add)"
                className="h-8 text-xs"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-1">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-600">Click to upload images</span>
                  </div>
                </label>
              </div>
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="h-8 px-3 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUploading || !formData.title || !formData.description}
                className="h-8 px-3 text-xs"
              >
                {isUploading ? "Uploading..." : isCreating ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
