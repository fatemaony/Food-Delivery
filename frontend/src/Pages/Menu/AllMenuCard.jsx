import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";
import MenuCard from './MenuCard';
import useAxios from '../../Hooks/useAxios';

const AllMenuCard = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const axiosInstance = useAxios();

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
      
      // Here you could also make an API call to save favorites to backend
      // await axiosInstance.post('/api/favorites', { menuId, isFavorite });
    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }
  };

  const handleAddToCart = async (menu) => {
    try {
      const newCart = [...cart, { ...menu, quantity: 1, addedAt: new Date() }];
      setCart(newCart);
      localStorage.setItem('shoppingCart', JSON.stringify(newCart));
      
      // Here you could also make an API call to save cart to backend
      // await axiosInstance.post('/api/cart', { menuId: menu.id, quantity: 1 });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const handleViewDetails = (menu) => {
    // You can customize this function to navigate to a details page
    // or show a custom modal instead of the default SweetAlert modal
    console.log('Viewing details for:', menu);
    
    // Example: Navigate to a details page
    // navigate(`/menu/${menu.id}`);
    
    // Example: Open a custom modal
    // setSelectedMenu(menu);
    // setShowDetailsModal(true);
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <FaSpinner className="text-4xl text-primary animate-spin" />
              <p className="text-base-content/70">Loading menu items...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4 text-center">
              <FaExclamationTriangle className="text-4xl text-error" />
              <p className="text-base-content/70">{error}</p>
              <button 
                onClick={fetchMenus}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
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
          {cart.length > 0 && (
            <div className="badge badge-primary badge-lg mb-6">
              {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
            </div>
          )}

        
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
      className="input input-bordered w-full pl-10 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
    />
    
    {searchTerm && (
      <button
        onClick={clearSearch}
        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-error transition-colors duration-200"
        aria-label="Clear search"
      >
        <FaTimes className="h-4 w-4 text-base-content/50 hover:text-error" />
      </button>
    )}
  </div>
  
  {/* Search Results Info */}
  {searchTerm && (
    <div className="mt-3 text-sm text-base-content/70 px-1">
      {filteredMenus.length === 0 ? (
        <span className="text-error flex items-center gap-1">
          <FaExclamationTriangle className="h-3 w-3" />
          No items found matching "{searchTerm}"
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <IoSearch className="h-3 w-3" />
          {filteredMenus.length} of {menus.length} item{menus.length !== 1 ? 's' : ''} found
        </span>
      )}
    </div>
  )}
</div>
        </div>

        {/* Menu Grid */}
        {menus.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Menu Items Available</h3>
              <p className="text-base-content/70">
                We're working on adding delicious items to our menu. Check back soon!
              </p>
            </div>
          </div>
        ) : filteredMenus.length === 0 && searchTerm ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <FaSearch className="text-6xl text-base-content/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Results Found</h3>
              <p className="text-base-content/70 mb-4">
                No menu items match your search for "{searchTerm}"
              </p>
              <button 
                onClick={clearSearch}
                className="btn btn-primary"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
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
              <div className="flex flex-col items-center gap-4 mt-8">
                {/* Pagination Info */}
                <div className="text-sm text-base-content/70">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredMenus.length)} of {filteredMenus.length} menu items
                  {searchTerm && (
                    <span className="block mt-1">
                      Search results for "{searchTerm}"
                    </span>
                  )}
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`btn btn-sm ${
                      currentPage === 1 ? 'btn-disabled' : 'btn-outline'
                    }`}
                  >
                    <FaChevronLeft className="text-xs" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`btn btn-sm w-10 ${
                          currentPage === pageNumber
                            ? 'btn-primary'
                            : 'btn-outline'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`btn btn-sm ${
                      currentPage === totalPages ? 'btn-disabled' : 'btn-outline'
                    }`}
                  >
                    Next
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllMenuCard;