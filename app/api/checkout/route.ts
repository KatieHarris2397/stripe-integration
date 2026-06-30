import { NextResponse } from "next/server";
import { getProductByPriceId } from "@/lib/products";
import { getStripe, StripeConfigError } from "@/lib/stripe";

function getAppUrl(request: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const host = request.headers.get("host");
  if (host) {
    return `http://${host}`;
  }

  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const { priceId } = (await request.json()) as { priceId?: string };

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }

    const product = await getProductByPriceId(priceId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const appUrl = getAppUrl(request);
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: product.priceType === "recurring" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        productId: product.id,
        priceId: product.priceId,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof StripeConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
