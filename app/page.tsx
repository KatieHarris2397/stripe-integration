import Image from "next/image";
import { CheckoutButton } from "@/app/components/checkout-button";
import { formatPrice, formatPriceLabel, getStripeProducts } from "@/lib/products";
import { StripeConfigError } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products = await getStripeProducts().catch((error) => {
    if (error instanceof StripeConfigError) {
      throw error;
    }
    console.error("Failed to load Stripe products:", error);
    return [];
  });

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-violet-600">Stripe Demo</p>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Payment Integration
            </h1>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Test mode
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Choose a plan
          </h2>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Products are loaded from your Stripe Dashboard. Add or edit them
            under Product catalog in Stripe.
          </p>
        </section>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              No products found
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Create active products in your Stripe Dashboard (same mode as your
              API keys) and they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.priceId}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {product.imageUrl ? (
                  <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.name}
                </h3>
                {product.description ? (
                  <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {product.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}
                <p className="mt-6 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatPriceLabel(product)}
                </p>
                {product.priceType === "recurring" ? (
                  <p className="mt-1 text-xs text-zinc-500">Subscription</p>
                ) : null}
                <div className="mt-6">
                  <CheckoutButton priceId={product.priceId} />
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            How it works
          </h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Products are fetched from Stripe on each page load.</li>
            <li>Click Buy now to create a Checkout Session with your Price ID.</li>
            <li>Complete payment on Stripe&apos;s hosted checkout page.</li>
            <li>Stripe sends a webhook to confirm the payment server-side.</li>
          </ol>
          <p className="mt-4 text-sm text-zinc-500">
            Use test card{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
              4242 4242 4242 4242
            </code>{" "}
            with any future expiry and CVC.
          </p>
        </section>
      </main>
    </div>
  );
}
