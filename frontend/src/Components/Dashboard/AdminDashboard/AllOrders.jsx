import React, { useState, useEffect } from 'react';
import useAxios from '../../../Hooks/useAxios';
import { FaSpinner, FaUsers } from 'react-icons/fa';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/orders');
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch all orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOrders();
  }, [axiosInstance]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl" /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Customer Orders</h1>
      {orders.length === 0 ? (
         <div className="text-center py-12">
            <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>{order.user_name}</div>
                    <div className="text-sm opacity-50">{order.user_email}</div>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <ul className='list-disc list-inside'>
                       {order.items.map((item, index) => (
                         <li key={index}>{item.quantity} x {item.menu_name}</li>
                       ))}
                    </ul>
                  </td>
                  <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td><span className="badge badge-primary badge-sm">{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
