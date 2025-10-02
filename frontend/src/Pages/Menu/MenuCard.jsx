import React, { useState } from 'react';
import { FaHeart, FaShoppingCart, FaUtensils, FaSpinner, FaEye } from 'react-icons/fa';
import { Link } from 'react-router';
import Swal from 'sweetalert2';

const MenuCard = ({ menu, onAddToCart, onToggleFavorite, onViewDetails, isFavorite = false }) => {
  const [isLoved, setIsLoved] = useState(isFavorite);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleLoveToggle = async () => {
    try {
      const newLoveState = !isLoved;
      setIsLoved(newLoveState);
      
      // Call parent component's favorite handler if provided
      if (onToggleFavorite) {
        await onToggleFavorite(menu.id, newLoveState);
      }

      // Show feedback
      await Swal.fire({
        title: newLoveState ? 'Added to Favorites!' : 'Removed from Favorites!',
        text: newLoveState 
          ? `${menu.name} has been added to your favorites.` 
          : `${menu.name} has been removed from your favorites.`,
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
      // Call parent component's add to cart handler if provided
      if (onAddToCart) {
        await onAddToCart(menu);
      }

      // Show success feedback
      await Swal.fire({
        title: 'Added to Cart!',
        text: `${menu.name} has been added to your cart.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to add item to cart. Please try again.',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    // Call parent component's view details handler if provided
    if (onViewDetails) {
      onViewDetails(menu);
    } else {
      // Default behavior - show modal with details
      Swal.fire({
        title: menu.name,
        html: `
          <div class="text-left">
            <div class="mb-4">
              <img src="${menu.image || ''}" alt="${menu.name}" 
                   style="width: 100%; max-width: 300px; height: 200px; object-fit: cover; border-radius: 8px; margin: 0 auto; display: block;"
                   onerror="this.style.display='none'">
            </div>
            <p class="text-gray-600 mb-3"><strong>Description:</strong><br>${menu.description}</p>
            <p class="text-2xl font-bold text-primary">$${parseFloat(menu.price).toFixed(2)}</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add to Cart',
        cancelButtonText: 'Close',
        confirmButtonColor: '#d97706',
        cancelButtonColor: '#6b7280',
        width: '500px'
      }).then((result) => {
        if (result.isConfirmed) {
          handleBuyNow();
        }
      });
    }
  };

  return (
    <div className="card bg-base-100 p-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="card-body p-4">
        {/* Image Section */}
        <div className="relative mb-4">
          <div className="w-full h-48 rounded-lg overflow-hidden bg-base-300 flex items-center justify-center">
            {menu.image ? (
              <img 
                src={menu.image} 
                alt={menu.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-full flex items-center justify-center text-base-content/50"
              style={{ display: menu.image ? 'none' : 'flex' }}
            >
              <FaUtensils className="text-4xl" />
            </div>
          </div>
          
          {/* Love Button */}
          <button
            onClick={handleLoveToggle}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLoved 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <FaHeart className={`text-lg ${isLoved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          {/* Menu Name */}
          <h3 className="text-xl font-bold text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {menu.name}
          </h3>

          {/* Description */}
          <p className="text-base-content/70 text-sm mb-3 line-clamp-2">
            {menu.description}
          </p>

          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-4">
            ${parseFloat(menu.price).toFixed(2)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link to={`/menuDetails/${menu.id}`}>
            <button
              className="btn btn-outline btn-secondary flex-1 gap-2 hover:btn-secondary-focus transition-all duration-300"
            >
              <FaEye className="text-sm" />
              View Details
            </button>
            </Link>
            <button
              onClick={handleBuyNow}
              disabled={isAddingToCart}
              className="btn btn-primary flex-1 gap-2 hover:btn-primary-focus transition-all duration-300"
            >
              {isAddingToCart ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  Adding...
                </>
              ) : (
                <>
                  <FaShoppingCart className="text-sm" />
                  Buy Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
