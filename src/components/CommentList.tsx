// app/components/CommentList.tsx
import { Comment } from "../lib/api";

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <li key={comment.id} className="border p-3 rounded-lg bg-gray-50">
          <p className="font-semibold">{comment.name}</p>
          <p className="text-sm text-gray-600">{comment.email}</p>
          <p className="mt-1">{comment.body}</p>
        </li>
      ))}
    </ul>
  );
}
