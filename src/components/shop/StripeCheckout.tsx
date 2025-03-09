import React from 'react';
import Popup from '../common/Popup';
import { loadStripe } from "@stripe/stripe-js";

interface StripeCheckoutProps {
  isShow: boolean;
  onClose: () => void;
  amount: number;
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""); // Ensure to set the REACT_APP_STRIPE_PUBLISHABLE_KEY in your .env file

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ isShow, onClose, amount }) => {
  const handleCheckout = async () => {
    const response = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const session = await response.json();
    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <Popup isShow={isShow} titleText="Stripe Checkout" onClose={onClose}>
      <div className="flex flex-col items-center">
        <p className="mb-4">You are about to pay ${amount}.</p>
        <button onClick={handleCheckout} className="bg-blue-500 text-white p-2 rounded">
          Checkout
        </button>
      </div>
    </Popup>
  );
};

export default StripeCheckout;
