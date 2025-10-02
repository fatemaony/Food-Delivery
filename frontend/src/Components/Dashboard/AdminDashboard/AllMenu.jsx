import React, { useState, useEffect } from 'react';
import { FaUtensils, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';

const AllMenu = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const axiosInstance = useAxios();

  useEffect(() => {
    fetchMenus();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(menus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMenus = menus.slice(startIndex, endIndex);

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

  const handleDeleteMenu = async (menuId, menuName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${menuName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/api/menus/${menuId}`);
        if (response.data.success) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Menu item has been deleted successfully.',
            icon: 'success',
            confirmButtonText: 'Great!'
          });
          // Refresh the menu list
          fetchMenus();
        }
      } catch (error) {
        console.error('Error deleting menu:', error);
        await Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete menu item.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <FaSpinner className="text-4xl text-primary animate-spin" />
              <p className="text-base-content/70">Loading menus...</p>
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
    <div className="min-h-screen bg-base-200 py-6 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <FaUtensils className="text-2xl text-primary-content" />
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2 font-aladin">
            All Menu Items
          </h1>
          <p className="text-base-content/70">
            Manage your restaurant menu
          </p>
        </div>

        {/* Menu Grid */}
        {menus.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <FaUtensils className="text-6xl text-base-content/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Menu Items</h3>
              <p className="text-base-content/70 mb-4">
                You haven't added any menu items yet. Start by adding your first dish!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentMenus.map((menu) => (
              <div key={menu.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Menu Image */}
                    <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-base-300 flex items-center justify-center flex-shrink-0">
                      {menu.image ? (
                        <img 
                          src={menu.image} 
                          alt={menu.name}
                          className="w-full h-full object-cover"
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
                        <FaUtensils className="text-2xl" />
                      </div>
                    </div>
                    
                    {/* Menu Details */}
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-base-content mb-1">
                        {menu.name}
                      </h4>
                      <p className="text-base-content/70 text-sm mb-2 line-clamp-2">
                        {menu.description}
                      </p>
                      <div className="text-2xl font-bold text-primary mb-3">
                        ${parseFloat(menu.price).toFixed(2)}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <div>
                        <button
                          className="btn btn-sm btn-outline btn-primary flex-1"
                          onClick={() => {
                            // TODO: Implement edit functionality
                            Swal.fire({
                              title: 'Edit Feature',
                              text: 'Edit functionality will be implemented soon!',
                              icon: 'info',
                              confirmButtonText: 'OK'
                            });
                          }}
                        >
                          <FaEdit className="text-xs" />
                          Edit
                        </button>
                        </div>
                        <div>
                        <button
                          className="btn btn-sm btn-outline btn-error flex-1"
                          onClick={() => handleDeleteMenu(menu.id, menu.name)}
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                {/* Pagination Info */}
                <div className="text-sm text-base-content/70">
                  Showing {startIndex + 1} to {Math.min(endIndex, menus.length)} of {menus.length} menu items
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

export default AllMenu;
