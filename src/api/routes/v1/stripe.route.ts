import {Router} from 'express'
import {updatePurchaseStateService} from '../../service-configurations/purchase-history'
const app = Router({mergeParams: true})

app.post('/webhook', (request, response) => {
  let event = request.body;
  // Handle the event
  if (!event.data.object.last_payment_error) {
    response.end()
    return
  }
  const {code = '', payment_method, message = ''} = event.data.object?.last_payment_error || {}
  console.error('failuddre_code :>> ', event.type);
  console.error('failure_code :>> ', code);
  console.error('failure_code :>> ', message);
  console.error('payment_method_details :>> ', payment_method);
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('object :>> ', paymentMethod);
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment intent failed. ');
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    case 'charge.failed':
      console.log('charge.failed. ');
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default app