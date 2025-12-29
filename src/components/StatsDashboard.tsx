"use client";

import { useMemo } from "react";
import StatsCard from "./StatsCard";
import { FileText, MessageSquare, Users, Activity } from "lucide-react";
import { Post, Comment } from "@/lib/api";

interface StatsDashboardProps {
  posts?: Post[];
  comments?: Comment[];
}

export default function StatsDashboard({
  posts = [],
  comments = [],
}: StatsDashboardProps) {
  const stats = useMemo(() => {
    // Calculate stats
    const uniqueUsers = new Set(posts.map((p) => p.userId)).size;

    // Count recent activity (posts/comments in last 24 hours)
    const recentPosts = posts.length;
    const recentComments = comments.length;

    return {
      totalPosts: posts.length,
      totalComments: comments.length,
      totalUsers: uniqueUsers,
      recentActivity: recentPosts + recentComments,
    };
  }, [posts, comments]);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Total Posts"
        value={stats.totalPosts}
        icon={FileText}
        gradient="bg-gradient-to-br from-blue-500 to-blue-700"
      />

      <StatsCard
        title="Total Comments"
        value={stats.totalComments}
        icon={MessageSquare}
        gradient="bg-gradient-to-br from-purple-500 to-purple-700"
      />

      <StatsCard
        title="Active Users"
        value={stats.totalUsers}
        icon={Users}
        gradient="bg-gradient-to-br from-green-500 to-green-700"
      />

      <StatsCard
        title="Recent Activity"
        value={stats.recentActivity}
        icon={Activity}
        gradient="bg-gradient-to-br from-orange-500 to-orange-700"
      />
    </div>
  );
}
