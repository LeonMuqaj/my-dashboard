"use client";

import { useEffect, useState, use } from "react";
import { getPost, getComments, Comment } from "@/lib/api";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import Toast, { ToastType } from "@/components/Toast";
import Modal, { ModalContent } from "@/components/Modal";
import { notFound } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { sanitizeHtml } from "@/lib/utils";
import { useStore } from "@/lib/store";

interface Props {
  params: Promise<{ id: string }>;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function PostDetailPage({ params }: Props) {
  const { id } = use(params);
  const postId = Number(id);

  const [post, setPost] = useState<{ title: string; body: string } | null>(
    null
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let postData;
        let commentsData: Comment[] = [];

        const storedComments = useStore.getState().getComments(postId);

        const storedPosts = useStore.getState().posts;
        const localPost = storedPosts.find(
          (p) => p.id === postId && p.id > 100
        );

        if (localPost) {
          postData = localPost;
          commentsData = storedComments;
        } else {
          [postData, commentsData] = await Promise.all([
            getPost(postId),
            getComments(postId),
          ]);

          const storedCommentsMap = new Map(
            storedComments.map((c) => [c.id, c])
          );
          const apiCommentIds = new Set(commentsData.map((c) => c.id));
          const mergedComments = [
            ...commentsData.map((c) => storedCommentsMap.get(c.id) || c),
            ...storedComments.filter((c) => !apiCommentIds.has(c.id)),
          ].sort((a, b) => b.id - a.id);

          commentsData = mergedComments;

          useStore.getState().setComments(postId, mergedComments);
        }

        setPost(postData);
        setComments(commentsData);
      } catch {
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postId]);

  useEffect(() => {
    if (comments.length > 0) {
      useStore.getState().setComments(postId, comments);
    }
  }, [comments, postId]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleCommentSuccess = () => {
    setShowAddCommentModal(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return notFound();

  return (
    <main className="p-6 relative">
      <button
        onClick={() => setShowAddCommentModal(true)}
        className="fixed top-20 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Add Comment"
      >
        <MessageSquarePlus size={28} />
      </button>

      <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">
        {post.title}
      </h1>
      <div
        className="mb-6 text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body) }}
      />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          Komentet
        </h2>
        <CommentList
          comments={comments}
          setComments={setComments}
          postId={postId}
          showToast={showToast}
        />
      </section>

      <Modal
        isOpen={showAddCommentModal}
        onClose={() => setShowAddCommentModal(false)}
        title="Shto Koment"
        size="md"
      >
        <ModalContent>
          <CommentForm
            postId={postId}
            setComments={setComments}
            onSuccess={handleCommentSuccess}
            onCancel={() => setShowAddCommentModal(false)}
            isModal={true}
            showToast={showToast}
          />
        </ModalContent>
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
