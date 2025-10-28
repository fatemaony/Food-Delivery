import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { FaUtensils, FaImage, FaDollarSign, FaSave, FaTimes, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdOutlineDescription } from 'react-icons/md';
import useAxios from '../../../Hooks/useAxios'; 
import Swal from 'sweetalert2';

const EditMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); 
  const [isFetching, setIsFetching] = useState(true); 
  const axiosInstance = useAxios();
  
  const {
    register,
    handleSubmit,
    reset, 
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsFetching(true);
        const response = await axiosInstance.get(`/api/menus/${id}`);
        if (response.data.success) {
         
          reset(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
        await Swal.fire({
          title: 'Error!',
          text: error.message || 'Could not fetch menu item details.',
          icon: 'error',
          confirmButtonText: 'Go Back'
        });
        navigate('/dashboard/admin/allMenu');
      } finally {
        setIsFetching(false);
      }
    };

    fetchMenuData();
  }, [id, axiosInstance, reset, navigate]);

  // Handle the form submission to update the item
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/api/menus/${id}`, {
        name: data.name,
        image: data.image,
        description: data.description,
        price: parseFloat(data.price)
      });

      if (response.data.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Menu item updated successfully!',
          icon: 'success',
          confirmButtonText: 'Great!',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        });
        navigate(`/menuDetails/${id}`); 
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update menu item. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/admin/allMenu');
  };


  if (isFetching) {
    return (
      <div className="min-h-screen bg-base-200 py-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-primary animate-spin mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-base-content">
            Loading Menu Item...
          </h1>
          <p className="text-base-content/70">Fetching details, please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-6 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <FaUtensils className="text-2xl text-primary-content" />
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2 font-aladin">
            Edit Menu Item
          </h1>
          <p className="text-base-content/70">
            Update the details for this menu item
          </p>
        </div>


        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                      <IoFastFoodOutline className="text-primary" />
                      Food Name
                    </span>
                  </label>
                  <input
                    {...register('name', {
                      required: 'Food name is required',
                    })}
                    type="text"
                    placeholder="Enter food name (e.g., Margherita Pizza)"
                    className={`input input-bordered focus:input-primary w-full ${
                      errors.name ? 'input-error' : ''
                    }`}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.name.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                      <FaImage className="text-primary" />
                      Image URL
                    </span>
                  </label>
                  <input
                    {...register('image', {
                      required: 'Image URL is required',
                      pattern: {
                        value: /^https?:\/\/.+\..+/,
                        message: 'Please enter a valid URL'
                      }
                    })}
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className={`input input-bordered focus:input-primary w-full ${
                      errors.image ? 'input-error' : ''
                    }`}
                  />
                  {errors.image && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.image.message}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                      <MdOutlineDescription className="text-primary" />
                      Description
                    </span>
                  </label>
                  <textarea
                    {...register('description', {
                      required: 'Description is required',
                    })}
                    placeholder="Describe your delicious dish..."
                    className={`textarea textarea-bordered focus:textarea-primary w-full h-20 resize-none ${
                      errors.description ? 'textarea-error' : ''
                    }`}
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.description.message}</span>
                    </label>
                  )}
                </div>

                {/* Price Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                      <FaDollarSign className="text-primary" />
                      Price
                    </span>
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <input
                      {...register('price', {
                        required: 'Price is required',
                      })}
                      type="number"
                      placeholder="0.00"
                      className={`input input-bordered focus:input-primary w-full pl-10 ${
                        errors.price ? 'input-error' : ''
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.price.message}</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="btn btn-outline btn-error flex-1 gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary flex-1 gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Menu Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenu;