import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaUser, FaCamera } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hooks/useAuth';
import useAxios from '../../Hooks/useAxios';
import Swal from 'sweetalert2';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const password = watch('password');

  const onSubmit = (data) => { 
    console.log(data);
    createUser(data.email, data.password)
      .then(result => {
        console.log(result.user);
        
        // Save user data to backend
        const userData = {
          name: data.fullName,
          email: data.email,
          image: data.photoUrl || 'https://via.placeholder.com/150', // Default image if no photo provided
          password: data.password, // Note: In production, you should hash this or handle it differently
          role: 'user' // Default role for new users
        };

        return axiosInstance.post('/api/users', userData);
      })
      .then(backendResponse => {
  console.log('User saved to backend:', backendResponse.data);
  
  // Check if user was actually created
  if (!backendResponse.data.success) {
    throw new Error('Failed to create user in database');
  }
  
  Swal.fire({
    title: 'Welcome! 🎉',
    text: 'Your account has been created successfully.',
    icon: 'success',
    confirmButtonText: 'Go to Home',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-primary'
    }
  }).then(() => {
    navigate('/');
  });
})
      .catch(error => {
        console.log(error);
        
        // Handle different types of errors
        let errorMessage = 'Signup failed. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      });
  };

  const handlePhotoChange = (e) => {
    const url = e.target.value;
    if (url) {
      // Basic URL validation
      try {
        new URL(url);
        setPhotoPreview(url);
        clearErrors('photoUrl');
      } catch {
        setError('photoUrl', {
          type: 'manual',
          message: 'Please enter a valid URL'
        });
      }
    } else {
      setPhotoPreview('');
      clearErrors('photoUrl');
    }
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md"
      >
        <div className="card-body">
          <h1 className="text-3xl font-bold text-secondary text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-500 mb-3">Join us today for delicious food!</p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUser className="text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`input input-bordered w-full  ${errors.fullName ? 'input-error' : ''}`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters'
                    }
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="text-error text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Photo URL Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Photo URL (Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaCamera className="text-gray-400" />
                </span>
                <input
                  type="url"
                  placeholder="Paste your photo URL"
                  className={`input input-bordered w-full  ${errors.photoUrl ? 'input-error' : ''}`}
                  {...register('photoUrl', {
                    onChange: handlePhotoChange,
                    validate: (value) => {
                      if (!value) return true; // Optional field
                      try {
                        new URL(value);
                        return true;
                      } catch {
                        return 'Please enter a valid URL';
                      }
                    }
                  })}
                />
              </div>
              {errors.photoUrl && (
                <p className="text-error text-sm mt-1">{errors.photoUrl.message}</p>
              )}
              {photoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Photo Preview:</p>
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="mt-1 h-16 w-16 object-cover rounded-full border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setError('photoUrl', {
                        type: 'manual',
                        message: 'Unable to load image from this URL'
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400" />
                  ) : (
                    <FaEye className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-primary w-full"
              >
                Create Account
              </motion.button>
            </div>
          </form>

          <p className="text-center">
            Already have an account?{' '}
             <Link to="/signin" className="text-primary hover:underline font-medium">
               Sign In
             </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;