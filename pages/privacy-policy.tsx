import type { NextPage } from 'next';

const PrivacyPolicy: NextPage = () => {
	return (
		<main>
			<h1 className="text-3xl">Privacy policy</h1>
			<h2 className="text-lg">Returns Policy</h2>
			<p>
				You may return most new, unopened items within 30 days of delivery for a
				full refund. We&apos;ll also pay the return shipping costs if the return
				is a result of our error (you received an incorrect or defective item,
				etc.).
			</p>
			<p>
				You should expect to receive your refund within four weeks of giving
				your package to the return shipper, however, in many cases you will
				receive a refund more quickly. This time period includes the transit
				time for us to receive your return from the shipper (5 to 10 business
				days), the time it takes us to process your return once we receive it (3
				to 5 business days), and the time it takes your bank to process our
				refund request (5 to 10 business days).
			</p>
			<p>
				If you need to return an item, please Contact Us with your order number
				and details about the product you would like to return. We will respond
				quickly with instructions for how to return items from your order.
			</p>
		</main>
	);
};

export default PrivacyPolicy;
