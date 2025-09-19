import { useEffect, useState } from "react";
import axios from "axios";
import { useShopContext } from "../context/ShopContext";
import {
  FaStar,
  FaUserCircle,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown,
} from "react-icons/fa";
import Login from "./Login";
import { useParams } from "react-router-dom";

const ProductReview = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    name: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { backendUrl, token } = useShopContext();
  const { productId } = useParams();

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get sentiment icon based on rating
  const getSentimentIcon = (rating) => {
    if (rating >= 4) return <FaRegSmile className="text-green-500" />;
    if (rating >= 3) return <FaRegMeh className="text-yellow-500" />;
    return <FaRegFrown className="text-red-500" />;
  };

  //Getting Rating and Product Reviews form DataBase
  const getProductReviews = async () => {
    if (!productId) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        backendUrl + `/api/productReviews/product/${productId}`
      );
      if (response.data.success) {
        setReviews(response.data.productReviews || []);
        setAverageRating(response.data.averageRating || 0);
        setTotalReviews(response.data.totalReviews || 0);
      } else {
        setError(response.data.message || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductReviews();
  }, [productId]);

  // Handle review form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!token) {
      setShowLoginModal(true);
      setIsSubmitting(false);
    }

    if (reviewForm.rating === 0) {
      setError("Please select a rating");
      setIsSubmitting(false);
      return;
    }

    if (!reviewForm.comment.trim()) {
      setError("Please write a review");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/productReviews",
        {
          productId: productId,
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
        },
        { headers: { token } }
      );

      if (response.data.success) {
        // Refresh reviews
        await getProductReviews();
        // Reset form
        setReviewForm({
          rating: 0,
          name: "",
          email: "",
          comment: "",
        });
        setShowReviewForm(false);
        setShowLoginModal(false);
        setError(null);
      } else {
        setError(response.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, editable = false, onRate, onHover }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type={editable ? "button" : undefined}
            key={star}
            onClick={editable ? () => onRate(star) : undefined}
            onMouseEnter={editable ? () => onHover(star) : undefined}
            onMouseLeave={editable ? () => onHover(0) : undefined}
            className={editable ? "cursor-pointer" : ""}
          >
            <FaStar
              className={`${
                star <= (hoverRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              } ${editable ? "transition-colors duration-150" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className=" max-padding-container mt-8 border-t pt-8">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Rating Summary */}
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full md:w-1/3 border">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(averageRating)} />
          <div className="text-sm text-gray-600 mt-2">
            {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Review Action Section */}
        <div className="flex flex-col gap-4 justify-center items-start w-full md:w-2/3">
          <div className="text-gray-600 text-lg">
            {totalReviews === 0
              ? "No reviews yet. Be the first to review this product!"
              : "Share your experience with this product"}
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-6 py-3 bg-[#FD0DAA] text-white rounded-lg font-medium hover:bg-[#bc127e] transition-colors"
          >
            {showReviewForm ? "Cancel Review" : "Write Review"}
          </button>

          {error && (
            <div className="text-red-500 bg-red-50 p-3 rounded-lg w-full">
              {error}
            </div>
          )}
        </div>
      </div>
      {showLoginModal && <Login />}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h4 className="text-xl font-semibold mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Your Rating
              </label>
              <StarRating
                rating={reviewForm.rating}
                editable={true}
                onRate={(rating) => setReviewForm({ ...reviewForm, rating })}
                onHover={setHoverRating}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Share your experience with this product..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-4">Customer Reviews</h4>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id || review.id}
                className="p-6 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex items-start mb-2">
                  <div className="mr-4">
                    <FaUserCircle className="text-3xl text-gray-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap">
                      <h4 className="font-medium text-lg">{review.userName}</h4>
                      <div className="flex items-center">
                        {getSentimentIcon(review.rating)}
                      </div>
                    </div>

                    <div className="flex items-center mb-3 flex-wrap">
                      <div className="flex mr-3">
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt || review.date)}
                      </span>
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReview;
