import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";

import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';
import MenuCard from '../Menu/MenuCard';

const PopularMenu = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
    loadFavorites();
  }, []);

  // Filter menus based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMenus(menus);
    } else {
      const filtered = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenus(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, menus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMenus = filteredMenus.slice(startIndex, endIndex);





  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/menus/popular');
      if (response.data.success) {
        setMenus(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      setError('Failed to fetch menus. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = () => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('menuFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('menuFavorites', JSON.stringify([...newFavorites]));
  };

  const handleToggleFavorite = async (menuId, isFavorite) => {
    try {
      const newFavorites = new Set(favorites);
      if (isFavorite) {
        newFavorites.add(menuId);
      } else {
        newFavorites.delete(menuId);
      }
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
      
      // You could also make an API call here to save favorites to a backend
    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }
  };

  const handleAddToCart = async (menu) => {
    if (!user) {
      await Swal.fire({
        title: 'Please Sign In',
        text: "You need to be signed in to add items to your cart.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sign In',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signin', { state: { from: location } });
        }
      });
      // Throw an error to be caught by the calling function in MenuCard
      throw new Error("User not authenticated.");
    }
  
    try {
      const userResponse = await axiosInstance.get(`/api/users/email/${user.email}`);
      if (!userResponse.data.success || !userResponse.data.data) {
        throw new Error("Could not find user information.");
      }
      
      const dbUserId = userResponse.data.data.id;
  
      const cartData = {
        user_id: dbUserId,
        menu_id: menu.id,
        quantity: 1
      };
  
      const response = await axiosInstance.post('/api/cart', cartData);
  
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add item to cart.");
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Re-throw the error so MenuCard can catch it and display a message
      throw error;
    }
  };

  const handleViewDetails = (menu) => {
    console.log('Viewing details for:', menu);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 py-6 px-6">
        <div className="flex items-center justify-center h-64">
            <FaSpinner className="text-4xl text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 py-6 px-6">
        <div className="flex items-center justify-center h-64 text-center">
            <div>
              <FaExclamationTriangle className="text-4xl text-error mx-auto mb-2" />
              <p className="text-base-content/70">{error}</p>
              <button onClick={fetchMenus} className="btn btn-primary mt-4">
                Try Again
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-6 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div>
          <h1 className='lg:text-6xl text-2xl text-primary font-bold text-center lg:py-10'>Popular Menus</h1>
        </div>
       

        {/* Menu Grid */}
        {currentMenus.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentMenus.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  isFavorite={favorites.has(menu.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold">No Menu Items Found</h3>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularMenu;
