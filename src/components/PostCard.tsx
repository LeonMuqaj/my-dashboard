"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Post, updatePost, deletePost } from "../lib/api";
import Modal, { ModalContent, ModalFooter, ModalButton } from "./Modal";
import { Edit, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { truncateHtml, sanitizeHtml } from "@/lib/utils";
import { useStore } from "@/lib/store";

interface Props {
  post: Post;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function PostCard({ post, posts, setPosts, showToast }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);

  // Ref for auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(post.title);
    setEditBody(post.body);
    setShowEditModal(true);
  };

  // Auto-resize textarea when editBody changes or modal opens
  useEffect(() => {
    if (textareaRef.current && showEditModal) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [editBody, showEditModal]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editBody.trim()) {
      showToast("Ju lutem plotësoni të gjitha fushat", "error");
      return;
    }

    const updatedPost = {
      ...post,
      title: editTitle,
      body: editBody,
    };

    // Update in Zustand store (persists automatically)
    useStore.getState().updatePost(post.id, {
      title: editTitle,
      body: editBody,
    });

    // Optimistic update in local state
    setPosts(posts.map((p) => (p.id === post.id ? updatedPost : p)));

    try {
      await updatePost(post.id, {
        userId: post.userId,
        title: editTitle,
        body: editBody,
      });
      showToast("Postimi u përditësua me sukses!", "success");
    } catch (error) {
      console.error("Failed to update post:", error);
      showToast("Dështoi përditësimi i postimit", "error");
    }
    setShowEditModal(false);
  };

  const handleConfirmDelete = async () => {
    // Delete from Zustand store (persists automatically)
    useStore.getState().deletePost(post.id);

    // Optimistic update in local state
    setPosts(posts.filter((p) => p.id !== post.id));

    try {
      await deletePost(post.id);
      showToast("Postimi u fshi me sukses!", "success");
    } catch (error) {
      console.error("Failed to delete post:", error);
      showToast("Dështoi fshirja e postimit", "error");
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <Link href={`/posts/${post.id}`} className="block h-full">
        <div className="relative group border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800 cursor-pointer h-full flex flex-col">
          {/* Edit and Delete Icons - Always visible on mobile, hover on desktop */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors z-10 bg-white dark:bg-gray-700 shadow-sm"
              title="Edit"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors z-10 bg-white dark:bg-gray-700 shadow-sm"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Post Content */}
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white pr-16">
            {post.title}
          </h2>
          <Separator className="my-2" />
          <div
            className="text-gray-600 dark:text-gray-300 line-clamp-3 prose dark:prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{
              __html: truncateHtml(sanitizeHtml(post.body), 150),
            }}
          />
        </div>
      </Link>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Ndrysho Postimin"
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
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Përmbajtja
              </label>
              <textarea
                ref={textareaRef}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                placeholder="Shkruani përmbajtjen..."
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 resize-none overflow-hidden min-h-[100px]"
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton
            onClick={() => setShowEditModal(false)}
            variant="secondary"
          >
            Anulo
          </ModalButton>
          <ModalButton onClick={handleSaveEdit} variant="primary">
            Ruaj Ndryshimet
          </ModalButton>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Fshi Postimin"
        size="sm"
      >
        <ModalContent>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500">
              A jeni të sigurt që dëshironi të fshini këtë postim? Ky veprim nuk
              mund të zhbëhet.
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton
            onClick={() => setShowDeleteModal(false)}
            variant="secondary"
          >
            Anulo
          </ModalButton>
          <ModalButton onClick={handleConfirmDelete} variant="danger">
            Fshi
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}
