import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUtensils, FaImage, FaDollarSign, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdOutlineDescription } from 'react-icons/md';
import useAxios from '../../../Hooks/useAxios';
import Swal from 'sweetalert2';

const AddMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxios();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      image: '',
      description: '',
      price: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/api/menus', {
        name: data.name,
        image: data.image,
        description: data.description,
        price: parseFloat(data.price)
      });

      if (response.data.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Menu item added successfully!',
          icon: 'success',
          confirmButtonText: 'Great!'
        });
        reset();
      }
    } catch (error) {
      console.error('Error adding menu:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add menu item. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-base-200 py-6 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <FaUtensils className="text-2xl text-primary-content" />
          </div>
          <h1 className="text-4xl font-bold text-base-content mb-2 font-aladin">
            Add New Menu Item
          </h1>
          <p className="text-base-content/70">
            Create a delicious new addition to your menu
          </p>
        </div>

        {/* Form Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* First Row - Food Name and Image URL */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Food Name Field */}
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
                      minLength: {
                        value: 2,
                        message: 'Food name must be at least 2 characters'
                      },
                      maxLength: {
                        value: 100,
                        message: 'Food name must be less than 100 characters'
                      }
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

                {/* Image URL Field */}
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

              {/* Second Row - Description and Price */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Description Field */}
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
                      minLength: {
                        value: 10,
                        message: 'Description must be at least 10 characters'
                      },
                      maxLength: {
                        value: 500,
                        message: 'Description must be less than 500 characters'
                      }
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
                        min: {
                          value: 0.01,
                          message: 'Price must be greater than 0'
                        },
                        max: {
                          value: 9999.99,
                          message: 'Price must be less than $10,000'
                        },
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: 'Please enter a valid price (e.g., 12.99)'
                        }
                      })}
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="9999.99"
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
                  onClick={handleReset}
                  disabled={isLoading}
                  className="btn btn-outline btn-error flex-1 gap-2"
                >
                  <FaTimes />
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary flex-1 gap-2"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Add to Menu
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

export default AddMenu;
