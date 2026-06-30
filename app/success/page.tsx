"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type SessionDetails = {
  sessionId: string;
  customerEmail: string | null;
  formattedAmount: string | null;
  productName: string;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [details, setDetails] = useState<SessionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing checkout session.");
      return;
    }

    async function loadSession() {
      try {
        const response = await fetch(
          `/api/checkout-session?session_id=${encodeURIComponent(sessionId!)}`,
        );
        const data = (await response.json()) as SessionDetails & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load payment details");
        }

        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }

    void loadSession();
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {error ? (
        <>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Payment status unknown
          </h1>
          <p className="mt-3 text-sm text-red-500">{error}</p>
        </>
      ) : !details ? (
        <>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Confirming payment…
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Please wait while we verify your checkout session.
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-950">
            ✓
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Payment successful
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Thank you for purchasing{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {details.productName}
            </span>
            .
          </p>
          <dl className="mt-6 space-y-3 rounded-xl bg-zinc-50 p-4 text-left text-sm dark:bg-zinc-950">
            {details.formattedAmount ? (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Amount</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                  {details.formattedAmount}
                </dd>
              </div>
            ) : null}
            {details.customerEmail ? (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Email</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                  {details.customerEmail}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Session</dt>
              <dd className="truncate font-mono text-xs text-zinc-700 dark:text-zinc-300">
                {details.sessionId}
              </dd>
            </div>
          </dl>
        </>
      )}

      <Link
        href="/"
        className="mt-8 inline-flex rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
      >
        Back to plans
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <Suspense
        fallback={
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Loading…
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
