import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import notificationService from '../utils/notificationService';
import { EXCHANGE_RATE, getCurrencySymbol } from '../utils/currencyUtils';

const StripePaymentForm = ({ orderId, amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currencyState = useSelector((state) => state.currencyState);
    const { currency } = currencyState;

    // Calculate display amount and payment amount
    const displayAmount = currency === 'CAD' ? amount * EXCHANGE_RATE : amount;
    const paymentAmount = Math.round(displayAmount * 100); // In cents

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            return;
        }

        try {
            // 1. Create PaymentIntent on the backend
            const { data: { clientSecret } } = await api.post('/api/payment/create-payment-intent', {
                amount: paymentAmount,
                currency: currency.toLowerCase(),
            });

            // 2. Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
                notificationService.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    const paymentResult = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                        update_time: new Date().toISOString(),
                        email_address: 'stripe_user@example.com', // Stripe doesn't return email by default in this flow
                    };
                    onSuccess(paymentResult);
                }
            }
        } catch (err) {
            console.error("Payment Error: ", err);
            setError(err.response?.data?.message || err.message || "Payment failed");
            notificationService.error("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Card Details</Form.Label>
                <div className="p-3 border rounded">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }} />
                </div>
            </Form.Group>
            {error && <div className="text-danger mb-3">{error}</div>}
            <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={!stripe || loading}
            >
                {loading ? 'Processing...' : `Pay ${getCurrencySymbol(currency)}${displayAmount.toFixed(2)} ${currency}`}
            </Button>
        </Form>
    );
};

export default StripePaymentForm;
