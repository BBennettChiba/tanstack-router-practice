import { Link, ReactNode, useRouterState } from "@tanstack/react-router";
import { signOut, useSession } from "../lib/auth-client.ts";

const noNavbar = ["/login"];

export default function NavBar({ children }: { children: ReactNode }) {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const session = useSession();

  if (noNavbar.includes(currentPath)) return children;

  return (
    <div>
      <div className="flex gap-2 p-4">
        <Link to={"/"}>home</Link>
        <Link to="/about">about</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/login">login</Link>
        <button
          className="ml-auto bg-slate-400 p-3 rounded"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
      {children}
    </div>
  );
}
