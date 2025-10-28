import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaSpinner,
  FaArrowLeft,
  FaUtensils,
  FaCreditCard
} from 'react-icons/fa';

import Swal from 'sweetalert2';
import useAxios from '../../../Hooks/useAxios';
import useAuth from '../../../Hooks/useAuth';

const AddCart = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const { user, loading: authLoading } = useAuth();
  
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchCartItems();
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const userResponse = await axiosInstance.get(`/api/users/email/${user.email}`);
      
      if (userResponse.data.success && userResponse.data.data) {
        const dbUserId = userResponse.data.data.id;
        const response = await axiosInstance.get(`/api/cart?userId=${dbUserId}`);
        
        if (response.data.success) {
          setCartItems(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartId));
    
    try {
      await axiosInstance.patch(`/api/cart/${cartId}`, { quantity: newQuantity });
      setCartItems(prev => 
        prev.map(item => 
          item.id === cartId 
            ? { ...item, quantity: newQuantity, total_price: item.menu_price * newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await axiosInstance.delete(`/api/cart/${cartId}`);
      setCartItems(prev => prev.filter(item => item.id !== cartId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
        const userResponse = await axiosInstance.get(`/api/users/email/${user.email}`);
        if (userResponse.data.success && userResponse.data.data) {
            const dbUserId = userResponse.data.data.id;
            await axiosInstance.delete(`/api/cart/user/${dbUserId}/clear`);
            setCartItems([]);
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/dashboard/user/payment', { 
        state: { 
            cartItems: cartItems, 
            totalAmount: calculateTotal() 
        } 
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  };

  const calculateItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <h3 className="text-2xl font-semibold">Sign In Required</h3>
        <p>Please sign in to view your cart.</p>
        <button onClick={() => navigate('/signin')} className="btn btn-primary mt-4">
          Sign In
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-8">
        <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold">Your Cart is Empty</h3>
        <button onClick={() => navigate('/menus')} className="btn btn-primary mt-4">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-6 px-5 lg:px-15">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button onClick={clearCart} className="btn btn-outline btn-error btn-sm">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card bg-base-100 shadow-md p-4">
                 <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      {item.menu_image ? (
                        <img src={item.menu_image} alt={item.menu_name} className="w-full h-full object-cover"/>
                      ) : <FaUtensils className="text-2xl m-auto" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.menu_name}</h3>
                      <p className="text-sm opacity-70">Each ${parseFloat(item.menu_price).toFixed(2)}</p>
                    </div>
                    <div className='flex flex-col justify-between items-center'>
                      
                    <div className="font-semibold flex items-center">
                        ${parseFloat(item.total_price).toFixed(2)}

                        <button onClick={() => removeFromCart(item.id)} className="btn btn-ghost btn-sm text-error">
                        <FaTrash />
                    </button>
                    </div>
                    <div className="flex p-5 items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || updatingItems.has(item.id)} className="btn btn-sm btn-circle btn-outline">
                        <FaMinus/>
                      </button>
                      <span>{updatingItems.has(item.id) ? <FaSpinner className="animate-spin" /> : item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={updatingItems.has(item.id)} className="btn btn-sm btn-circle btn-outline">
                        <FaPlus/>
                      </button>
                    
                    </div>

                    
                    </div>
                    
                 </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-6 p-4">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal ({calculateItemCount()} items)</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
                <button onClick={handleCheckout} className="btn btn-primary w-full mt-4">
                    <FaCreditCard/> Proceed to Checkout
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCart;
