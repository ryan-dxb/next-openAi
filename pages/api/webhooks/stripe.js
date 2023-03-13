import Cors from "micro-cors";
import stripInit from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = stripInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (error) {
      console.log(error);
    }
    console.log(event);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const client = await clientPromise;

        const db = client.db("nextBlog_openai");

        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.auth0Id;

        const userProfile = await db.collection("users").updateOne(
          {
            auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id,
            },
          },
          {
            upsert: true,
          }
        );
        break;
      }

      default: // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).json({ received: true });
  }
};

export default cors(handler);
