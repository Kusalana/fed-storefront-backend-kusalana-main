import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

router.post("/", async (req, res) => {
  const { cartItems } = req.body;

  console.log("cartItems received:", cartItems); 
  try {
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name || "Unnamed product",
        },
        unit_amount: item.price * 100, 
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://fed-storefront-frontend-kusalana.netlify.app/success",
      cancel_url: "https://fed-storefront-frontend-kusalana.netlify.app",
      //success_url: "http://localhost:5173/success",
      //cancel_url: "http://localhost:5173/",
    });

    res.json({sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
