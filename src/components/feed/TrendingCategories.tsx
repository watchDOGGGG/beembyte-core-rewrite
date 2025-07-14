
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Hash } from "lucide-react"

interface TrendingCategory {
  id: string
  name: string
  postsCount: number
  growth: number
  color: string
}

// Mock data for now - replace with API call
const mockTrendingCategories: TrendingCategory[] = [
  {
    id: "1",
    name: "Web Development",
    postsCount: 234,
    growth: 12,
    color: "bg-blue-500"
  },
  {
    id: "2",
    name: "Mobile Development",
    postsCount: 189,
    growth: 8,
    color: "bg-green-500"
  },
  {
    id: "3",
    name: "Design",
    postsCount: 156,
    growth: 15,
    color: "bg-purple-500"
  },
  {
    id: "4",
    name: "Marketing",
    postsCount: 142,
    growth: 6,
    color: "bg-orange-500"
  },
  {
    id: "5",
    name: "Business",
    postsCount: 128,
    growth: 10,
    color: "bg-red-500"
  },
  {
    id: "6",
    name: "Writing",
    postsCount: 98,
    growth: 4,
    color: "bg-teal-500"
  }
]

export const TrendingCategories: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span>Trending Categories</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockTrendingCategories.map((category, index) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${category.color}`} />
                <Hash className="h-3 w-3 text-gray-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {category.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {category.postsCount} posts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`text-xs px-1.5 py-0.5 ${category.growth > 0 ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'
                  }`}
              >
                +{category.growth}%
              </Badge>
              <span className="text-xs text-gray-400 font-mono">
                #{index + 1}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
