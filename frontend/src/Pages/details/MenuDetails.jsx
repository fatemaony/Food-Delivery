import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaUtensils, 
  FaSpinner, 
  FaStar, 
  FaStarHalfAlt,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaUser,
  FaCalendarAlt,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import useAxios from '../../Hooks/useAxios';
import useAuth from '../../Hooks/useAuth';
import Swal from 'sweetalert2';

const MenuDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [menu, setMenu] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  const currentUserReview = user ? reviews.find(r => r.user_email === user.email) : null;

  useEffect(() => {
    if (id) {
      fetchMenuDetails();
      fetchReviews();
    }
  }, [id]);

  // Debug: Log user authentication state
  useEffect(() => {
    console.log('MenuDetails - Auth state:', { 
      user: user ? { email: user.email, uid: user.uid, displayName: user.displayName, photoURL: user.photoURL } : null, 
      authLoading,
      isLoggedIn: !!user 
    });
  }, [user, authLoading]);

  const fetchMenuDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/menus/${id}`);
      if (response.data.success) {
        setMenu(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching menu details:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to load menu details. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      navigate('/menus');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/api/reviews/${id}`);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (authLoading) {
      return;
    }
    
    if (!user) {
      await Swal.fire({
        title: 'Sign In Required',
        text: 'Please sign in to add items to cart.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    setIsAddingToCart(true);
    try {
      // For Firebase users, we need to get the database user ID
      // First, check if user exists in your database, if not create them
      const userResponse = await axiosInstance.get(`/api/users/email/${user.email}`);
      
      let dbUserId;
      
      if (userResponse.data.success && userResponse.data.data) {
        // User exists in database, use that ID
        dbUserId = userResponse.data.data.id;
      } else {
        // User doesn't exist in database, you might need to create them
        // Or use a different approach based on your auth system
        console.error('User not found in database');
        await Swal.fire({
          title: 'Error!',
          text: 'User profile not found. Please try signing in again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
  
      const response = await axiosInstance.post(`/api/cart`, {
        user_id: dbUserId, // Use the database user ID, not Firebase UID
        menu_id: parseInt(id), // Ensure menu_id is integer
        quantity: quantity
      });
  
      if (response.data.success) {
        const result = await Swal.fire({
          title: 'Added to Cart!',
          text: `${menu.name} (${quantity}x) has been added to your cart.`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'View Cart',
          cancelButtonText: 'Continue Shopping',
          timer: 3000,
          timerProgressBar: true
        });
  
        setQuantity(1);
  
        if (result.isConfirmed) {
          navigate('/dashboard/user/addToCart');
        }
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add item to cart. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (authLoading) {
      return; // Don't show anything while auth is loading
    }
    
    if (!user) {
      await Swal.fire({
        title: 'Sign In Required',
        text: 'Please sign in to add favorites.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      
      await Swal.fire({
        title: newFavoriteState ? 'Added to Favorites!' : 'Removed from Favorites!',
        text: newFavoriteState 
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
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (authLoading) {
      return;
    }
    
    if (!user) {
      await Swal.fire({
        title: 'Sign In Required',
        text: 'Please sign in to leave a review.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      await Swal.fire({
        title: 'Comment Required',
        text: 'Please write a comment for your review.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (editingReviewId) {
        const response = await axiosInstance.put(`/api/reviews/${editingReviewId}`, {
          user_email: user.email,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        });
        if (response.data.success) {
          await Swal.fire({
            title: 'Review Updated!',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          setEditingReviewId(null);
          setReviewForm({ rating: 5, comment: '' });
          fetchReviews();
        }
      } else {
        // Get user details from our database to ensure consistency
        const userResponse = await axiosInstance.get(`/api/users/email/${user.email}`);

        if (!userResponse.data.success || !userResponse.data.data) {
          await Swal.fire({
            title: 'Error!',
            text: 'User profile not found. Please try signing in again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          setIsSubmittingReview(false);
          return; 
        }

        const dbUser = userResponse.data.data;

        const response = await axiosInstance.post('/api/reviews', {
          menu_id: id,
          user_email: user.email,
          user_name: dbUser.name, // Use name from our DB
          user_image: dbUser.image, // Use image from our DB
          rating: reviewForm.rating,
          comment: reviewForm.comment
        });

        if (response.data.success) {
          await Swal.fire({
            title: 'Review Submitted!',
            text: 'Thank you for your review.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          setReviewForm({ rating: 5, comment: '' });
          fetchReviews();
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const message = error.response?.data?.message;
      if (message && message.toLowerCase().includes('already reviewed')) {
        if (currentUserReview) {
          setEditingReviewId(currentUserReview.id);
          setReviewForm({ rating: currentUserReview.rating, comment: currentUserReview.comment });
          await Swal.fire({
            title: 'You already reviewed',
            text: 'Editing your existing review instead.',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } else {
        await Swal.fire({
          title: 'Error!',
          text: message || 'Failed to submit review. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditClick = (review) => {
    if (!user || review.user_email !== user.email) return;
    setEditingReviewId(review.id);
    setReviewForm({ rating: review.rating, comment: review.comment });
  };

  const handleDeleteClick = async (review) => {
    if (!user || review.user_email !== user.email) return;
    const confirm = await Swal.fire({
      title: 'Delete review?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });
    if (!confirm.isConfirmed) return;
    try {
      await axiosInstance.delete(`/api/reviews/${review.id}`, { data: { user_email: user.email } });
      await Swal.fire({
        title: 'Deleted',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
      });
      setEditingReviewId(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete review.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar
            key={i}
            className={`text-yellow-400 ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(i) : undefined}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`text-yellow-400 ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(i) : undefined}
          />
        );
      } else {
        stars.push(
          <FaStar
            key={i}
            className={`text-gray-300 ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(i) : undefined}
          />
        );
      }
    }
    
    return stars;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <FaSpinner className="text-4xl text-primary animate-spin" />
              <p className="text-base-content/70">Loading menu details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-base-200 py-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4 text-center">
              <FaUtensils className="text-6xl text-base-content/30" />
              <h3 className="text-2xl font-semibold text-base-content">Menu Not Found</h3>
              <p className="text-base-content/70">The menu item you're looking for doesn't exist.</p>
              <button 
                onClick={() => navigate('/menus')}
                className="btn btn-primary"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-6 px-5 lg:px-15">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-sm gap-2"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>
          
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Menu Image */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-0">
                <div className="relative">
                  <div className="w-full h-96 rounded-t-lg overflow-hidden bg-base-300 flex items-center justify-center">
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
                      <FaUtensils className="text-6xl" />
                    </div>
                  </div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isFavorite 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <FaHeart className={`text-xl ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Menu Details */}
          <div className="space-y-6">
            {/* Menu Info */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h1 className="text-3xl font-bold text-base-content mb-2 font-aladin">
                  {menu.name}
                </h1>
                
                {/* Rating Display */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(calculateAverageRating())}
                  </div>
                  <span className="text-base-content/70 text-sm">
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>

                <p className="text-base-content/80 text-lg leading-relaxed mb-6">
                  {menu.description}
                </p>

                {/* Price */}
                <div className="text-4xl font-bold text-primary mb-6">
                  ${parseFloat(menu.price).toFixed(2)}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-base-content font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-sm btn-outline btn-circle"
                      disabled={quantity <= 1}
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="btn btn-sm btn-outline btn-circle"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="btn btn-primary btn-lg w-full gap-2"
                >
                  {isAddingToCart ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="text-sm" />
                      Add to Cart (${(parseFloat(menu.price) * quantity).toFixed(2)})
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            
          </div>
        </div>

        <div className="card mt-10 w-full shadow-xl">
     <div className="card-body bg-base-100  ">
    <h2 className="text-2xl font-bold text-base-content mb-4">
      Reviews ({reviews.length})
    </h2>

    <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
      {/* Left Column - Review Form */}
      <div className=''>
        {/* Add/Edit Review Form */}
        {!authLoading && user && (
          <form onSubmit={handleSubmitReview} className="p-4 bg-base-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">
              {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            
            {/* Rating Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center gap-1">
                {renderStars(reviewForm.rating, true, (rating) => 
                  setReviewForm(prev => ({ ...prev, rating }))
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this dish..."
                className="textarea textarea-bordered w-full"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="btn btn-primary gap-2 flex-1"
              >
                {isSubmittingReview ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    {editingReviewId ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  editingReviewId ? 'Update Review' : 'Submit Review'
                )}
              </button>
              {editingReviewId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setEditingReviewId(null); setReviewForm({ rating: 5, comment: '' }); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Sign In Prompt for Non-logged Users */}
        {!authLoading && !user && (
          <div className="p-4 bg-base-200 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Want to leave a review?</h3>
            <p className="text-base-content/70 mb-4">Sign in to share your experience with this dish!</p>
            <button 
              onClick={() => navigate('/signin')}
              className="btn btn-primary gap-2"
            >
              Sign In to Review
            </button>
          </div>
        )}
      </div>

      {/* Right Column - Reviews List */}
      <div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <FaStar className="text-4xl text-base-content/30 mx-auto mb-3" />
              <p className="text-base-content/70">No reviews yet. Be the first to review this dish!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-base-300 pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    {review.user_image ? (
                      <img 
                        src={review.user_image} 
                        alt={review.user_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-primary" />
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1  min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-base-content text-sm">
                          {review.user_name}
                        </span>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-base-content/70">
                          <FaCalendarAlt className="inline mr-1" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {user && review.user_email === user.email && (
                        <div className="flex items-center gap-1">
                          <button
                            className="btn btn-ghost btn-xs text-primary"
                            title="Edit"
                            onClick={() => handleEditClick(review)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            title="Delete"
                            onClick={() => handleDeleteClick(review)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-base-content/80 text-sm leading-relaxed break-words">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default MenuDetails;

