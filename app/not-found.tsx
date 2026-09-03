import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <LogoMark className="h-10 w-10" />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Nothing here
      </h1>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        This menu does not exist, or it has not been published yet.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:opacity-90"
      >
        Go to MezMenu
      </Link>
    </main>
  );
}
