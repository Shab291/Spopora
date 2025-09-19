import { useState, useEffect, useCallback } from "react";
import {
  FaStar,
  FaTimes,
  FaUserCircle,
  FaRegSmile,
  FaRegFrown,
  FaRegMeh,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useShopContext } from "../context/ShopContext";
import axios from "axios";

const ReviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const { backendUrl } = useShopContext();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Formate date function
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

  // Reviews data from DataBase
  // Memoize fetch functions to avoid dependency issues
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        backendUrl + "/api/reviews?sortBy=createdAt&order=desc"
      );

      if (response.data.success) {
        setReviews(response.data.data);
      } else {
        console.error("Invalid response format:", response.data);
        setReviews([]);
        toast.error("Failed to load reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const fetchReviewStats = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + "/api/reviews/stats");

      if (response.data.success) {
        setReviewStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching review stats:", error);
      toast.error("Failed to load review statistics");
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
      fetchReviewStats();
    }
  }, [isOpen, fetchReviews, fetchReviewStats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(backendUrl + "/api/reviews/", {
        rating,
        name: name || "Anonymous",
        email: email || "undefined",
        comment: comment.trim(),
      });

      if (response.data.success) {
        // Refresh reviews and stats after successful submission
        await fetchReviews();
        await fetchReviewStats();

        // Reset form
        setRating(0);
        setComment("");
        setName("");
        setEmail("");
        closeModal();
        setIsSubmitting(false);

        toast.success("Thank you for your review!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(response.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        />
      ));
  };

  // Get rating text based on score
  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    if (rating >= 1) return "Poor";
  };

  // Get sentiment icon based on rating
  const getSentimentIcon = (rating) => {
    if (rating >= 4) return <FaRegSmile className="text-green-500" />;
    if (rating >= 3) return <FaRegMeh className="text-yellow-500" />;
    return <FaRegFrown className="text-red-500" />;
  };

  const { averageRating, ratingDistribution } = reviewStats;

  return (
    <>
      <div className="main">
        {/* Review Button */}
        <button
          className="fixed right-0 top-1/2 z-40 flex items-center px-4 py-2 -translate-y-3/4 translate-x-9 rounded-bl-lg rounded-br-lg gap-x-2 bg-[#FD0DAA] hover:bg-[#bc127e] text-white rotate-90 cursor-pointer"
          onClick={openModal}
        >
          <FaStar /> <p>Reviews</p>
        </button>

        {/* Review Modal */}
        {isOpen && (
          <div className="fixed mt-16 inset-0 z-50 p-4 items-center justify-center flex bg-black/70">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b bg-indigo-50">
                <h2 className="bold-28 text-gray-700">Customer Reviews</h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border">
                    <div className="bold-36 text-gray-800 mb-2">
                      {averageRating}
                    </div>
                    <div className="flex mb-2">
                      {renderStars(Number(averageRating))}
                    </div>
                    <div className="text-lg font-medium text-gary-600">
                      {getRatingText(Number(averageRating))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Based on {reviews.length} reviews
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">
                      Rating Distribution
                    </h3>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center mb-2">
                        <div className="w-10 text-sm font-medium text-gray-600">
                          {star} Star
                        </div>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full mx-2 overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{
                              width: `${
                                reviews.length > 0
                                  ? (ratingDistribution[star] /
                                      reviews.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div className="w-10 text-sm text-gray-600 text-right">
                          {reviews.length > 0
                            ? Math.round(
                                (ratingDistribution[star] / reviews.length) *
                                  100
                              )
                            : 0}
                          %
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Form */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Your Rating
                      </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="p-1 focus:outline-none"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                          >
                            <FaStar
                              className={`text-2xl ${
                                star <= (hover || rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Name (optional)
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="review"
                        className="block text-sm font-medium mb-2"
                      >
                        Your Review
                      </label>
                      <textarea
                        id="review"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Share your experience with our products..."
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || rating === 0}
                      className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Customer Reviews ({reviews.length})
                  </h3>

                  {loading ? (
                    <p className="text-gray-500 text-center py-8">
                      Loading reviews...
                    </p>
                  ) : reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No reviews yet. Be the first to review!
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((item) => (
                        <div key={item._id} className="p-4 border rounded-lg">
                          <div className="flex items-start mb-2">
                            <div className="mr-3">
                              <FaUserCircle className="text-3xl text-gray-400" />
                            </div>

                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="flex items-center">
                                  {getSentimentIcon(item.rating)}
                                </div>
                              </div>

                              <div className="flex items-center mb-2">
                                <div className="flex mr-2">
                                  {renderStars(item.rating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {formatDate(item.createdAt || item.date)}
                                </span>
                              </div>
                              <p className="text-gray-700">{item.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default ReviewModal;
