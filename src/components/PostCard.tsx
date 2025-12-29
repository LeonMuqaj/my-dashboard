// app/components/PostCard.tsx
"use client";

import Link from "next/link";
import { Post } from "../lib/api";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
    >
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 line-clamp-3">{post.body}</p>
    </Link>
  );
}
