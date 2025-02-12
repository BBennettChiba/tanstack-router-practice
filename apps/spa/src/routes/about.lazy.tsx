import { createLazyFileRoute } from "@tanstack/react-router";
import { trpc } from "../lib/query.ts";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const client = trpc.createUser.useMutation();

  return (
    <div className="p-2">
      Hello from About!
      <button
        onClick={() =>
          client.mutate({
            name: "bryson",
            email: "awer@adfi.to",
            emailVerified: false,
          })
        }
      >
        create user
      </button>
    </div>
  );
}
