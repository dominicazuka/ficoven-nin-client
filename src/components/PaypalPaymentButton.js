import {
  PayPalScriptProvider,
  PayPalButtons
} from "@paypal/react-paypal-js";

const PaypalPaymentButton = ({ bookingDetails, getResponse }) => {
  const initialOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
  };
  return <PayPalScriptProvider options={initialOptions}> 
    <PayPalButtons
      style={{ layout: "horizontal", shape:   'pill', color:   'black', label:   'pay'}}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: bookingDetails.totalAmount,
              },
            },
          ],
        });
      }}
      onApprove={async(data, actions) => {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          getResponse(details);
        });
      }}
    />
    ;
  </PayPalScriptProvider>;
};

export default PaypalPaymentButton;
