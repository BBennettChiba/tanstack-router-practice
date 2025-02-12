import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

import "./index.css";
import { queryClient, trpc, trpcClient, trpcQueryUtils } from "./lib/query.ts";
import { useSession } from "./lib/auth-client.ts";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    trpcQueryUtils,
    session: null,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;

const Root = () => {
  const session = useSession();

  return (
    <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} context={{ session }} />
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>
  );
};

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<Root />);
}
