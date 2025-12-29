"use client";

import { Post, Comment } from "@/lib/api";
import { getRelativeTime } from "@/lib/utils";
import { FileText, MessageSquare, User, Activity } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: number;
  type: "post" | "comment";
  title: string;
  user: string;
  timestamp: number;
  postId?: number;
}

interface ActivityFeedProps {
  posts?: Post[];
  comments?: Comment[];
}

export default function ActivityFeed({
  posts = [],
  comments = [],
}: ActivityFeedProps) {
  // Combine and sort activities
  const activities: ActivityItem[] = [
    ...posts.map((post) => ({
      id: post.id,
      type: "post" as const,
      title: post.title,
      user: `User ${post.userId}`,
      timestamp: post.id,
      postId: post.id,
    })),
    ...comments.map((comment) => ({
      id: comment.id,
      type: "comment" as const,
      title: comment.name,
      user: comment.email.split("@")[0],
      timestamp: comment.id,
      postId: comment.postId,
    })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10); // Show last 10 activities

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white flex items-center gap-2">
          <Activity className="text-orange-500" size={24} />
          Recent Activity
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-black dark:text-white flex items-center gap-2">
        <Activity className="text-orange-500" size={24} />
        Recent Activity
      </h2>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {activities.map((activity) => (
          <Link
            key={`${activity.type}-${activity.id}`}
            href={`/posts/${activity.postId}`}
            className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`p-2 rounded-lg ${
                  activity.type === "post"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                }`}
              >
                {activity.type === "post" ? (
                  <FileText size={18} />
                ) : (
                  <MessageSquare size={18} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {activity.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <User size={12} />
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{getRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
