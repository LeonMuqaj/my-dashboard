"use client";

import { useState } from "react";
import { createComment, Comment } from "../lib/api";
import { useStore } from "@/lib/store";

interface Props {
  postId: number;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
  showToast?: (message: string, type: "success" | "error" | "info") => void;
}

export default function CommentForm({
  postId,
  setComments,
  onSuccess,
  onCancel,
  isModal = false,
  showToast,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const newComment = await createComment({ postId, name, email, body });

      // Save to Zustand store (persists automatically)
      useStore.getState().addComment(postId, newComment);

      // Update local state
      setComments((prev) => [newComment, ...prev].sort((a, b) => b.id - a.id));
      setName("");
      setEmail("");
      setBody("");

      if (onSuccess) {
        onSuccess();
      }

      if (showToast) {
        showToast("Komenti u shtua me sukses!", "success");
      }
    } catch (error) {
      if (showToast) {
        showToast("Dështoi shtimi i komentit", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emri
          </label>
          <input
            type="text"
            placeholder="Emri"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Komenti
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Komenti..."
            rows={4}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 resize-vertical"
          />
        </div>
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded font-medium"
            >
              Anulo
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded font-medium disabled:bg-gray-400"
          >
            {loading ? "Duke dërguar..." : "Dërgo Komentin"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 max-w-md">
      <input
        type="text"
        placeholder="Emri"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded dark:text-white"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded dark:text-white"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Duke dërguar..." : "Dërgo Komentin"}
      </button>
    </form>
  );
}
