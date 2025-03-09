import React from "react";
import GooglePayButton from "@google-pay/button-react";

interface PaymentData {
  paymentMethodData: {
    tokenizationData: {
      token: string;
    };
  };
}

const GooglePayComponent = () => {
  const handlePayment = async (paymentRequest: PaymentData) => {
    try {
      // Extract token from Google Pay response
      const paymentToken = paymentRequest.paymentMethodData.tokenizationData.token;
  
      const response = await fetch("http://localhost:5000/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodToken: paymentToken, // Send correct token
          amount: 5.00, // Securely validate this on backend
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        console.log("Payment successful:", result);
        alert("Payment completed successfully!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };    

  return (
    <GooglePayButton
      environment="TEST"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "stripe",
                "stripe:publishableKey": import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
                "stripe:version": "2022-11-15",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "BCR2DN4TWP5RDFF7", // Test Merchant ID
          merchantName: "SQ Software",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: "5.00",
          currencyCode: "USD",
          countryCode: "US",
        },
      }}
      onLoadPaymentData={handlePayment}
      onError={(error) => console.error("Payment Error:", error)}
    />
  );
};

export default GooglePayComponent;
