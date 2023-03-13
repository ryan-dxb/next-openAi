import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import stripeInit from "stripe";

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);

  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ];

  const protocol =
    process.env.NODE_ENV === "production" ? "https://" : "http://";
  const host = req.headers.host;

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`,
    cancel_url: `${protocol}${host}/cancel`,
    payment_intent_data: {
      metadata: {
        auth0Id: user.sub,
      },
    },
    metadata: {
      auth0Id: user.sub,
    },
  });

  return res.status(200).json({ session: checkoutSession });
});
