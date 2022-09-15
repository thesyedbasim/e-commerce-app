import { PaymentElement } from '@stripe/react-stripe-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm: React.FC = () => {
	const stripe = useStripe();
	const elements = useElements();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');

	const handlePayment = async () => {
		if (!stripe || !elements) return;

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: { return_url: `${window.location.host}/checkout/success` }
		});

		if (error.type === 'card_error' || error.type === 'validation_error') {
			setMessage(error.message!);
		} else {
			setMessage('An unexpected error occured.');
		}

		setIsLoading(false);
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
			<button
				className="btn btn-primary mt-3"
				disabled={!stripe || !elements || isLoading}
			>
				{isLoading ? 'loading...' : 'Pay now'}
			</button>
			{message && <p>{message}</p>}
		</form>
	);
};

export default CheckoutForm;
