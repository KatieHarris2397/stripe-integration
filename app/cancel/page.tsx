import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-2xl dark:bg-zinc-800">
          ×
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Checkout canceled
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          No charge was made. You can return and try again whenever you&apos;re
          ready.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          Back to plans
        </Link>
      </div>
    </div>
  );
}
