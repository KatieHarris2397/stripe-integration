import Stripe from "stripe";

let stripe: Stripe | null = null;

export class StripeConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeConfigError";
  }
}

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new StripeConfigError(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }

  if (!stripe) {
    stripe = new Stripe(secretKey);
  }

  return stripe;
}
