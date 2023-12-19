const stripe = require("stripe")(
  "sk_test_51ONUGdBqWaF4qTu765qVnWXMO8UcdCoh8FRicKWKqUIwe4Fk44Lop0pAeZbGUSj4dWjlKalehGG3FIaf69BuBbYD00uXLJPYQs"
);

const endpointSecret =
  "whsec_46202af2b4a6204b2d5c2e8281100654e608b394f2a0f694823c549b088b32c0";

const app = require("express")();
// const bodyParser = require("body-parser");

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    // const sig = request.headers["stripe-signature"];

    // let event;

    // try {
    //   event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // } catch (err) {
    //   return response.status(400).send(`Webhook Error: ${err.message}`);
    // }

    // Handle events
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Checkout is Completed!");
        // Fulfill the purchase...
        handleCheckoutSession(session);
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.listen(8000, () => console.log("Running on port 8000"));
