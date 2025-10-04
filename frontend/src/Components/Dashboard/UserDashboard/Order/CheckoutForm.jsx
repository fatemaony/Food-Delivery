import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaSpinner, FaLock } from 'react-icons/fa';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useAxios from '../../../../Hooks/useAxios';
import useAuth from '../../../../Hooks/useAuth';

const CheckoutForm = ({ cartItems, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setProcessing(false);
        return;
      }

      const userResponse = await axiosInstance.get(`/api/users/email/${user.email}`);
      const dbUserId = userResponse.data.data.id;

      const orderData = {
        user_id: dbUserId,
        total_amount: totalAmount,
        payment_method: 'card',
        items: cartItems.map(item => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          price: item.menu_price
        }))
      };

      const response = await axiosInstance.post('/api/orders', orderData);

      if (response.data.success) {
        await Swal.fire({
          title: 'Payment Successful!',
          text: 'Your order has been placed.',
          icon: 'success',
          confirmButtonText: 'View My Orders'
        }).then(() => {
          navigate('/dashboard/user/myOrders');
        });
      } else {
        throw new Error('Order creation failed');
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Card Details</h2>
      <div className="mb-4 p-3 border rounded-md">
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

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <span className='flex items-center justify-center gap-2'><FaLock/> Pay ${totalAmount.toFixed(2)}</span>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
