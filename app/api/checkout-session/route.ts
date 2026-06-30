import { NextResponse } from "next/server";
import { formatPrice } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 },
      );
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 1,
    });

    const lineItem = lineItems.data[0];

    return NextResponse.json({
      sessionId: session.id,
      customerEmail: session.customer_details?.email ?? null,
      amountTotal: session.amount_total,
      formattedAmount:
        session.amount_total != null
          ? formatPrice(session.amount_total, session.currency ?? "usd")
          : null,
      productName: lineItem?.description ?? "Your purchase",
    });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve checkout session" },
      { status: 500 },
    );
  }
}
