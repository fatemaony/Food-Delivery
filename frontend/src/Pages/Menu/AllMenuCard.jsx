import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";
import MenuCard from './MenuCard';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const AllMenuCard = () => {
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

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/menus');
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
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
    <div className="min-h-screen bg-base-200 py-6 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2 font-aladin">
            Our Delicious Menu
          </h1>
          <p className="text-base-content/70 mb-6">
            Discover amazing dishes crafted with love and passion
          </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearch className="h-5 w-5 text-base-content/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="input input-bordered w-full pl-10 pr-12 py-4"
                />
                
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <FaTimes className="h-4 w-4 text-base-content/50 hover:text-error" />
                  </button>
                )}
              </div>
          </div>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                  <div className="join">
                      <button onClick={goToPreviousPage} disabled={currentPage === 1} className="join-item btn">«</button>
                      <button className="join-item btn">Page {currentPage}</button>
                      <button onClick={goToNextPage} disabled={currentPage === totalPages} className="join-item btn">»</button>
                  </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold">No Menu Items Found</h3>
            <p className="text-base-content/70 mt-2">
              {searchTerm ? `No results for "${searchTerm}".` : "Please check back later!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMenuCard;
