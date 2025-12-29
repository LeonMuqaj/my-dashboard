"use client";

import { useState, useRef, useEffect } from "react";
import { Comment, updateComment, deleteComment } from "../lib/api";
import { Edit, Trash2 } from "lucide-react";
import Modal, { ModalContent, ModalFooter, ModalButton } from "./Modal";
import { sanitizeHtml } from "@/lib/utils";
import { useStore } from "@/lib/store";

interface Props {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  postId: number;
  showToast?: (message: string, type: "success" | "error" | "info") => void;
}

export default function CommentList({
  comments,
  setComments,
  postId,
  showToast,
}: Props) {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBody, setEditBody] = useState("");

  // Ref for auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openEditModal = (comment: Comment) => {
    setSelectedComment(comment);
    setEditName(comment.name);
    setEditEmail(comment.email);
    setEditBody(comment.body);
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

  const openDeleteModal = (comment: Comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedComment(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedComment) return;

    const updatedComment = {
      ...selectedComment,
      name: editName,
      email: editEmail,
      body: editBody,
    };

    // Update in Zustand store (persists automatically)
    useStore.getState().updateComment(postId, selectedComment.id, {
      name: editName,
      email: editEmail,
      body: editBody,
    });

    // Optimistic update in local state
    setComments(
      comments.map((c) => (c.id === selectedComment.id ? updatedComment : c))
    );

    try {
      await updateComment(selectedComment.id, {
        postId,
        name: editName,
        email: editEmail,
        body: editBody,
      });
      if (showToast) {
        showToast("Komenti u përditësua me sukses!", "success");
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
      if (showToast) {
        showToast("Dështoi përditësimi i komentit", "error");
      }
      // Revert if needed, but for now we keep it simple
    }
    closeModals();
  };

  const handleConfirmDelete = async () => {
    if (!selectedComment) return;

    // Delete from Zustand store (persists automatically)
    useStore.getState().deleteComment(postId, selectedComment.id);

    // Optimistic update in local state
    setComments(comments.filter((c) => c.id !== selectedComment.id));

    try {
      await deleteComment(selectedComment.id);
      if (showToast) {
        showToast("Komenti u fshi me sukses!", "success");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      if (showToast) {
        showToast("Dështoi fshirja e komentit", "error");
      }
    }
    closeModals();
  };

  return (
    <>
      <ul className="space-y-3">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="border p-3 rounded-lg bg-gray-50 dark:bg-white group relative"
          >
            <div className="pr-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold dark:text-black">
                    {comment.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-black">
                    {comment.email}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(comment)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit size={22} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(comment)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
              <div
                className="mt-2 dark:text-black prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.body) }}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModals}
        title="Edit Comment"
        size="md"
      >
        <ModalContent>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                ref={textareaRef}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                placeholder="Comment..."
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 resize-none overflow-hidden min-h-[100px]"
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={closeModals} variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton onClick={handleSaveEdit} variant="primary">
            Save Changes
          </ModalButton>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeModals}
        title="Delete Comment"
        size="sm"
      >
        <ModalContent>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={closeModals} variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton onClick={handleConfirmDelete} variant="danger">
            Delete
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
}
