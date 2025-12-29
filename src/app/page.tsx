"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatsDashboard from "@/components/StatsDashboard";
import ActivityFeed from "@/components/ActivityFeed";
import { getPosts, getAllComments, Post, Comment } from "@/lib/api";
import { useStore } from "@/lib/store";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Subscribe to Zustand store for real-time updates
  const storedPosts = useStore((state) => state.posts);
  const storedComments = useStore((state) => state.comments);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch API Data (only first 12 posts to match posts page)
        const [apiPosts, apiComments] = await Promise.all([
          getPosts(),
          getAllComments(),
        ]);

        // 2. Merge Posts with stored posts from Zustand
        // Stored posts take priority (they may have edits)
        const storedPostsMap = new Map(storedPosts.map((p) => [p.id, p]));

        const apiPostIds = new Set(apiPosts.slice(0, 12).map((p) => p.id));
        const allPosts = [
          ...apiPosts.slice(0, 12).map((p) => storedPostsMap.get(p.id) || p),
          ...storedPosts.filter((p) => !apiPostIds.has(p.id)),
        ].sort((a, b) => b.id - a.id);

        setPosts(allPosts);

        // 3. Get all post IDs we're working with
        const relevantPostIds = new Set(allPosts.map((p) => p.id));

        // 4. Filter API comments to only include those for our posts
        const relevantApiComments = apiComments.filter((c) =>
          relevantPostIds.has(c.postId)
        );

        // 5. Get all stored comments from Zustand
        let allStoredComments: Comment[] = [];
        Object.entries(storedComments).forEach(([postId, comments]) => {
          const numPostId = Number(postId);
          if (relevantPostIds.has(numPostId)) {
            allStoredComments = [...allStoredComments, ...comments];
          }
        });

        // 6. Merge Comments - stored comments take priority
        const storedCommentsMap = new Map(
          allStoredComments.map((c) => [c.id, c])
        );

        const apiCommentIds = new Set(relevantApiComments.map((c) => c.id));
        const allComments = [
          ...relevantApiComments.map((c) => storedCommentsMap.get(c.id) || c),
          ...allStoredComments.filter((c) => !apiCommentIds.has(c.id)),
        ].sort((a, b) => b.id - a.id);

        setComments(allComments);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    }

    fetchData();
  }, [storedPosts, storedComments]); // Re-run when store updates

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        Welcome to Leoni Dev Dashboard
      </h1>
      <p className="text-lg mb-6 text-black dark:text-white">
        This is the home page of your dashboard. Here you can find an overview
        of your projects and activities.
      </p>

      {/* Stats Dashboard - Show total posts and comments (API + local) */}
      <StatsDashboard posts={posts} comments={comments} />

      {/* Activity Feed - Show all activity */}
      <div className="mb-6">
        <ActivityFeed posts={posts} comments={comments} />
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/projects">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
              Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your ongoing projects and track progress.
            </p>
          </div>
        </Link>

        <Link href="/posts">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
              Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage your blog posts and articles.
            </p>
          </div>
        </Link>

        <Link href="/calendar">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
              Calendar
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of important dates and events.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
