// app/(posts)/[id]/page.tsx
import { getPost, getComments, Comment } from "@/lib/api";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

interface Props {
  params: { id: string };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);
  const post = await getPost(postId);
  const comments: Comment[] = await getComments(postId);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="mb-6 text-gray-700">{post.body}</p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Komentet</h2>
        <CommentList comments={comments} />
        <CommentForm postId={postId} />
      </section>
    </main>
  );
}
