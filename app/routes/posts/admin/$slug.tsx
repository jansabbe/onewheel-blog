import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { deletePost, getPost, updatePost } from "~/models/post.server";
import invariant from "tiny-invariant";
import { requireAdmin } from "~/session.server";
import { validatePost } from "~/routes/posts/admin/validate";

export async function loader({ request, params }: LoaderArgs) {
  await requireAdmin(request);
  invariant(params.slug, "should have slug");
  const post = await getPost(params.slug);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  return json({ post });
}

export async function action({ request, params }: ActionArgs) {
  await requireAdmin(request);
  invariant(params.slug, "update requires slug param");
  const formData = await request.formData();
  if (formData.get("action") === "delete") {
    await deletePost(params.slug);
    return redirect("/posts/admin");
  }
  const result = validatePost(formData);
  if (result.result === "ERROR") {
    return json(result.errors, { status: 400 });
  }
  await updatePost(params.slug, result.data);
  return redirect("/posts/admin");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
export default function EditPostRoute() {
  const { post } = useLoaderData<typeof loader>();

  const transition = useTransition();
  const isDeleting = transition.submission?.formData.get("action") === "delete";
  const isUpdating = transition.submission?.formData.get("action") === "update";
  const errors = useActionData<typeof action>();
  return (
    <Form method="post" key={post.slug}>
      <p>
        <label>
          Post Title:{" "}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={post.title}
          />
        </label>
      </p>
      {errors?.title && <p className="text-red-600">{errors.title}</p>}
      <p>
        <label>
          Post Slug:{" "}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={post.slug}
          />
        </label>
      </p>
      {errors?.slug && <p className="text-red-600">{errors.slug}</p>}
      <p>
        <label htmlFor="markdown">Markdown: </label>
        <textarea
          id="markdown"
          rows={20}
          name="content"
          defaultValue={post.content}
          className={`${inputClassName} font-mono`}
        />
      </p>
      {errors?.content && <p className="text-red-600">{errors.content}</p>}
      <div className="flex flex-row-reverse gap-4">
        <button
          type="submit"
          name="action"
          value="update"
          disabled={isUpdating}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isUpdating ? "Saving..." : "Save"}
        </button>
        <button
          type="submit"
          name="action"
          value="delete"
          disabled={isDeleting}
          className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Form>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <div>Uh oh! Post "{params.slug}" not found</div>;
  }
  throw new Error(`Unexpected error ${caught.status}`);
}
