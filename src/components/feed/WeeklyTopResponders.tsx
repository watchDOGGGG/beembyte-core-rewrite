"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Trophy } from "lucide-react"

interface TopResponder {
  id: string
  name: string
  avatar: string
  rating: number
  completedTasks: number
  rank: "novice" | "intermediate" | "expert" | "master"
  weeklyEarnings: number
}

// Mock data for now - replace with API call
const mockTopResponders: TopResponder[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sarah",
    rating: 4.9,
    completedTasks: 45,
    rank: "master",
    weeklyEarnings: 1250,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=mike",
    rating: 4.8,
    completedTasks: 38,
    rank: "expert",
    weeklyEarnings: 980,
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=lisa",
    rating: 4.7,
    completedTasks: 42,
    rank: "expert",
    weeklyEarnings: 875,
  },
]

const getRankColor = (rank: string) => {
  switch (rank) {
    case "novice":
      return "bg-gray-100 text-gray-700"
    case "intermediate":
      return "bg-blue-100 text-blue-700"
    case "expert":
      return "bg-purple-100 text-purple-700"
    case "master":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export const WeeklyTopResponders: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>Top Responders This Week</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockTopResponders.map((responder, index) => (
          <div
            key={responder.id}
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={responder.avatar || "/placeholder.svg"} alt={responder.name} />
                  <AvatarFallback className="text-xs">{responder.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {index < 3 && (
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${index === 0
                        ? "bg-yellow-500 text-white"
                        : index === 1
                          ? "bg-gray-400 text-white"
                          : "bg-orange-600 text-white"
                      }`}
                  >
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{responder.name}</p>
                  <Badge variant="outline" className={`text-xs px-1 py-0 ${getRankColor(responder.rank)}`}>
                    {responder.rank}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 mr-0.5" />
                    <span>{responder.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{responder.completedTasks} tasks</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">₦{responder.weeklyEarnings}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">this week</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
