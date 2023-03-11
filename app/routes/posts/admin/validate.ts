import invariant from "tiny-invariant";

type Result<T> =
  | { result: "OK"; data: T }
  | { result: "ERROR"; errors: { [K in keyof T]: string | null } };

export function validatePost(
  formData: FormData
): Result<{ title: string; slug: string; content: string }> {
  const { title, slug, content } = Object.fromEntries(formData);

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    content: content ? null : "Content is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return { result: "ERROR", errors };
  }

  invariant(typeof title === "string", "title should be string");
  invariant(typeof slug === "string", "slug should be string");
  invariant(typeof content === "string", "content should be string");
  return { result: "OK", data: { title, slug, content } };
}
