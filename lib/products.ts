import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export type Product = {
  id: string;
  priceId: string;
  name: string;
  description: string | null;
  priceInCents: number;
  currency: string;
  imageUrl: string | null;
  priceType: "one_time" | "recurring";
  interval: Stripe.Price.Recurring.Interval | null;
  intervalCount: number | null;
};

function isActiveProduct(
  product: Stripe.Product | Stripe.DeletedProduct | string | null | undefined,
): product is Stripe.Product {
  return (
    product != null &&
    typeof product !== "string" &&
    "active" in product &&
    product.active
  );
}

function isSupportedPrice(price: Stripe.Price): boolean {
  return (
    price.active &&
    (price.type === "one_time" || price.type === "recurring") &&
    price.unit_amount != null
  );
}

function mapStripePrice(price: Stripe.Price): Product | null {
  if (!isSupportedPrice(price) || !isActiveProduct(price.product)) {
    return null;
  }

  return {
    id: price.product.id,
    priceId: price.id,
    name: price.product.name,
    description: price.product.description,
    priceInCents: price.unit_amount!,
    currency: price.currency,
    imageUrl: price.product.images[0] ?? null,
    priceType: price.type as "one_time" | "recurring",
    interval: price.recurring?.interval ?? null,
    intervalCount: price.recurring?.interval_count ?? null,
  };
}

export async function getStripeProducts(): Promise<Product[]> {
  const stripe = getStripe();

  const { data: prices } = await stripe.prices.list({
    active: true,
    expand: ["data.product"],
    limit: 100,
  });

  const products: Product[] = [];

  for (const price of prices) {
    const product = mapStripePrice(price);
    if (product) products.push(product);
  }

  return products;
}

export async function getProductByPriceId(
  priceId: string,
): Promise<Product | null> {
  const stripe = getStripe();

  const price = await stripe.prices.retrieve(priceId, {
    expand: ["product"],
  });

  return mapStripePrice(price);
}

export function formatPrice(priceInCents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
}

export function formatPriceLabel(product: Product): string {
  const amount = formatPrice(product.priceInCents, product.currency);

  if (product.priceType !== "recurring" || !product.interval) {
    return amount;
  }

  const count = product.intervalCount ?? 1;
  const intervalLabel =
    count === 1
      ? product.interval
      : `${count} ${product.interval}${count > 1 ? "s" : ""}`;

  return `${amount}/${intervalLabel}`;
}
