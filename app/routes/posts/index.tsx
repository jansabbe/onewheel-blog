import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPosts } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";

export async function loader() {
  const posts = await getPosts();
  return json({ posts: posts });
}

export default function PostsRoute() {
  const adminUser = useOptionalAdminUser();
  const { posts } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Posts</h1>
      {adminUser && (
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      )}
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
