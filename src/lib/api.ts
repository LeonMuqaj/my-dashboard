// app/lib/api.ts

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function getAllComments(): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/comments`);
  if (!res.ok) throw new Error("Failed to fetch all comments");
  return res.json();
}

export async function createComment(commentData: Omit<Comment, "id">): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
}

export async function updateComment(id: number, commentData: Omit<Comment, "id">): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  });
  // JSONPlaceholder is a mock API - it will return 404 for locally created comments
  // Since we use optimistic updates, we can return the data even if the API call fails
  if (res.ok) {
    return res.json();
  }
  // Return the comment data as-is for local/mock updates
  return { id, ...commentData } as Comment;
}

export async function deleteComment(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
  });
  // JSONPlaceholder is a mock API - it will return 404 for locally created comments
  // Since we use optimistic updates, we don't need to throw an error
  // The deletion already happened in the UI
}

export async function createPost(postData: Omit<Post, "id">): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function updatePost(id: number, postData: Omit<Post, "id">): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  // JSONPlaceholder is a mock API - it will return 404 for locally created posts
  // Since we use optimistic updates, we can return the data even if the API call fails
  if (res.ok) {
    return res.json();
  }
  // Return the post data as-is for local/mock updates
  return { id, ...postData } as Post;
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });
  // JSONPlaceholder is a mock API - it will return 404 for locally created posts
  // Since we use optimistic updates, we don't need to throw an error
  // The deletion already happened in the UI
}
