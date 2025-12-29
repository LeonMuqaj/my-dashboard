import { getPosts, Post } from "@/lib/api";
import PostCard from "@/components/PostCard";

const MainPage = async () => {
  const posts: Post[] = await getPosts();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Lista e Postimeve</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 12).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
