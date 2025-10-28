import React, { useState, useEffect } from 'react';
import useAxios from '../../../Hooks/useAxios';
import useAuth from '../../../Hooks/useAuth';
import { FaSpinner, FaBoxOpen } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxios();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userResponse = await axiosInstance.get(`/api/users/email/${user.email}`);
          const dbUserId = userResponse.data.data.id;
          const response = await axiosInstance.get(`/api/orders/my-orders/${dbUserId}`);
          if (response.data.success) {
            setOrders(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user, axiosInstance]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl" /></div>;
  }

  return (
    <div className="container mx-auto lg:px-20 py-10 p-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
            <FaBoxOpen className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="p-4 bg-base-100 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold">Order #{order.id}</h2>
                <span className="badge badge-primary">{order.status}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <ul className="list-disc list-inside">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.quantity} x {item.menu_name} - ${parseFloat(item.price).toFixed(2)} each
                  </li>
                ))}
              </ul>
              <div className="text-right font-bold mt-2">
                Total: ${parseFloat(order.total_amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
