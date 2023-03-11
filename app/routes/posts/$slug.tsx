import { json, LoaderArgs } from "@remix-run/node";
import { marked } from "marked";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;
  invariant(slug, "slug is required");
  const post = await getPost(slug);
  invariant(post, `post with ${slug} not found`);
  const html = marked(post.content);
  return json({ title: post.title, html });
}

export default function PostRoute() {
  const { title, html } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </main>
  );
}
