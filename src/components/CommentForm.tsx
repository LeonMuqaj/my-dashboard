"use client";

import { useState } from "react";
import { createComment } from "../lib/api";

interface Props {
  postId: number;
}

export default function CommentForm({ postId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createComment({ postId, name, email, body });
    setName("");
    setEmail("");
    setBody("");
    setLoading(false);
    alert("Komenti u dërgua (simulim)!");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 max-w-md">
      <input
        type="text"
        placeholder="Emri"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <textarea
        placeholder="Komenti..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        className="border p-2 rounded"
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
