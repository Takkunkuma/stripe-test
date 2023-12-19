<template>
  <div>
    <!-- Create a button that your customers click to complete their purchase. Customize the styling to suit your branding. -->
    <button
      id="checkout-button-price_1ONVcDBqWaF4qTu7lr79zZ59"
      role="link"
      type="button"
    >
      Checkout
    </button>
    <div id="error-message"></div>
  </div>
</template>

<style>
div {
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  background-color: #6772e5;
  color: #fff;
  padding: 8px 12px;
  border: 0;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
}
</style>

<script>
export default {
  mounted() {
    (function () {
      var stripe = Stripe(
        "pk_test_51ONUGdBqWaF4qTu75vNoUULwDF2EIVbpMzPw1BIl1U8wj215kshza0nvUEvC8ODdLHBmm2XiQJhvsv24QoEThAyw003zGUF8aQ"
      );

      var checkoutButton = document.getElementById(
        "checkout-button-price_1ONVcDBqWaF4qTu7lr79zZ59"
      );
      checkoutButton.addEventListener("click", function () {
        /*
         * When the customer clicks on the button, redirect
         * them to Checkout.
         */
        stripe
          .redirectToCheckout({
            lineItems: [
              { price: "price_1ONVcDBqWaF4qTu7lr79zZ59", quantity: 1 },
            ],
            mode: "payment",
            /*
             * Do not rely on the redirect to the successUrl for fulfilling
             * purchases, customers may not always reach the success_url after
             * a successful payment.
             * Instead use one of the strategies described in
             * https://stripe.com/docs/payments/checkout/fulfill-orders
             */
            successUrl: "https://www.linkedin.com/in/tatsuo-kumamoto/success",
            cancelUrl: "https://www.linkedin.com/in/tatsuo-kumamoto/canceled",
          })
          .then(function (result) {
            if (result.error) {
              /*
               * If `redirectToCheckout` fails due to a browser or network
               * error, display the localized error message to your customer.
               */
              var displayError = document.getElementById("error-message");
              displayError.textContent = result.error.message;
            }
          });
      });
    })();
  },
};
</script>
