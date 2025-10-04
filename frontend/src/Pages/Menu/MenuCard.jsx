import React, { useState } from 'react';
import { FaHeart, FaShoppingCart, FaUtensils, FaSpinner, FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const MenuCard = ({ menu, onAddToCart, onToggleFavorite, onViewDetails, isFavorite = false }) => {
  const [isLoved, setIsLoved] = useState(isFavorite);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleLoveToggle = async () => {
    try {
      const newLoveState = !isLoved;
      setIsLoved(newLoveState);
      
      if (onToggleFavorite) {
        await onToggleFavorite(menu.id, newLoveState);
      }

      await Swal.fire({
        title: newLoveState ? 'Added to Favorites!' : 'Removed from Favorites!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsLoved(!isLoved); // Revert state on error
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to update favorites. Please try again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    try {
      if (onAddToCart) {
        await onAddToCart(menu);
        // On success, redirect to the cart page
        navigate('/dashboard/user/addToCart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // The parent component (AllMenuCard) handles showing a login prompt.
      // We only show an error toast here if an actual API error occurred.
      // "User not authenticated" is thrown when the user cancels the login prompt.
      if (error.message !== "User not authenticated.") {
          await Swal.fire({
            title: 'Error!',
            text: 'Failed to add item to cart. Please try again.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(menu);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="card-body p-4">
        {/* Image Section */}
        <div className="relative mb-4">
          <div className="w-full h-48 rounded-lg overflow-hidden bg-base-300">
            {menu.image ? (
              <img 
                src={menu.image} 
                alt={menu.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : <FaUtensils className="text-4xl text-base-content/50 m-auto" />}
          </div>
          
          {/* Love Button */}
          <button
            onClick={handleLoveToggle}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isLoved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:text-red-500'
            }`}
          >
            <FaHeart className="text-lg" />
          </button>
        </div>

        {/* Content Section */}
        <div>
          <h3 className="text-xl font-bold text-base-content mb-2 truncate group-hover:text-primary">
            {menu.name}
          </h3>
          <p className="text-base-content/70 text-sm mb-3 line-clamp-2">
            {menu.description}
          </p>
          <div className="text-2xl font-bold text-primary mb-4">
            ${parseFloat(menu.price).toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Link to={`/menuDetails/${menu.id}`} className="flex-1">
              <button className="btn btn-outline btn-secondary w-full gap-2">
                <FaEye />
                Details
              </button>
            </Link>
            <button
              onClick={handleBuyNow}
              disabled={isAddingToCart}
              className="btn btn-primary flex-1 gap-2"
            >
              {isAddingToCart ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaShoppingCart />
              )}
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
