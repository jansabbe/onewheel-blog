import { Form, useActionData, useTransition } from "@remix-run/react";
import { ActionArgs, json, redirect } from "@remix-run/node";
import { createPost } from "~/models/post.server";
import { requireAdmin } from "~/session.server";
import { validatePost } from "./validate";

export async function action({ request }: ActionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const result = validatePost(formData);
  if (result.result === "ERROR") {
    return json(result.errors, { status: 400 });
  }
  await createPost(result.data);
  return redirect("/posts/admin");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
export default function NewPostRoute() {
  const transition = useTransition();
  const isCreating = Boolean(transition.submission);
  const errors = useActionData<typeof action>();
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      {errors?.title && <p className="text-red-600">{errors.title}</p>}
      <p>
        <label>
          Post Slug:{" "}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      {errors?.slug && <p className="text-red-600">{errors.slug}</p>}
      <p>
        <label htmlFor="markdown">Markdown: </label>
        <textarea
          id="markdown"
          rows={20}
          name="content"
          className={`${inputClassName} font-mono`}
        />
      </p>
      {errors?.content && <p className="text-red-600">{errors.content}</p>}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isCreating}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isCreating ? "Creating..." : "Create post"}
        </button>
      </div>
    </Form>
  );
}
