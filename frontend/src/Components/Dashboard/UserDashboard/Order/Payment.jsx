import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
    const location = useLocation();
    const { cartItems, totalAmount } = location.state || { cartItems: [], totalAmount: 0 };

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">Complete Your Payment</h1>
                <Elements stripe={stripePromise}>
                    <CheckoutForm cartItems={cartItems} totalAmount={totalAmount} />
                </Elements>
            </div>
        </div>
    );
};

export default Payment;
