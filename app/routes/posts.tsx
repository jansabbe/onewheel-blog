import { Outlet } from "@remix-run/react";

export default function PostsRoute() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      Uh oh!
      <pre>{error.message}</pre>
    </div>
  );
}
