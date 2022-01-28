import { PaymentElement } from '@stripe/react-stripe-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect } from 'react';

const CheckoutForm: React.FC = () => {
	const stripe = useStripe();
	const elements = useElements();

	const handlePayment = async () => {
		if (!stripe || !elements) return;

		const {} = await stripe.confirmPayment({
			elements,
			confirmParams: { return_url: 'http://localhost:3000/' }
		});
	};

	return (
		<form
			id="payment-form"
			onSubmit={(e) => {
				e.preventDefault();
				handlePayment();
			}}
		>
			<PaymentElement id="payment-element" />
			<button className="btn btn-primary" disabled={!stripe || !elements}>
				Pay
			</button>
		</form>
	);
};

export default CheckoutForm;
