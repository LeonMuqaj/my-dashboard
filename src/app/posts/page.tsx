"use client";

import { useEffect, useState } from "react";
import { getPosts, Post } from "@/lib/api";
import PostCard from "@/components/PostCard";
import Toast, { ToastType } from "@/components/Toast";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalButton,
} from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        const storedPosts = useStore.getState().posts;

        const storedPostsMap = new Map(storedPosts.map((p) => [p.id, p]));

        const apiPostIds = new Set(data.slice(0, 12).map((p) => p.id));
        const mergedPosts = [
          ...data.slice(0, 12).map((p) => storedPostsMap.get(p.id) || p),
          ...storedPosts.filter((p) => !apiPostIds.has(p.id)),
        ].sort((a, b) => b.id - a.id);

        setPosts(mergedPosts);
        useStore.getState().setPosts(mergedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      useStore.getState().setPosts(posts);
    }
  }, [posts]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleAddPost = () => {
    if (!newTitle.trim() || !newBody.trim()) {
      showToast("Ju lutem plotësoni të gjitha fushat", "error");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      userId: 1,
      title: newTitle,
      body: newBody,
    };

    useStore.getState().addPost(newPost);

    setPosts([newPost, ...posts]);

    setNewTitle("");
    setNewBody("");
    setShowAddModal(false);
    showToast("Postimi u shtua me sukses!", "success");
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="text-center">Duke ngarkuar...</div>
      </main>
    );
  }

  return (
    <main className="p-6 relative min-h-[calc(100vh-80px)] flex flex-col">
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed top-20 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Shto Postim"
      >
        <Plus size={28} />
      </button>

      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        Lista e Postimeve
      </h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {posts
          .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
          .map((post) => (
            <PostCard
              key={post.id}
              post={post}
              posts={posts}
              setPosts={setPosts}
              showToast={showToast}
            />
          ))}
      </div>

      <div className="mt-auto">
        {posts.length > postsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(posts.length / postsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Shto Postim të Ri"
        size="md"
      >
        <ModalContent>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titulli
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Shkruani titullin..."
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Përmbajtja
              </label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Shkruani përmbajtjen..."
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 resize-vertical"
                rows={4}
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton
            onClick={() => setShowAddModal(false)}
            variant="secondary"
          >
            Anulo
          </ModalButton>
          <ModalButton onClick={handleAddPost} variant="primary">
            Shto Postimin
          </ModalButton>
        </ModalFooter>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
