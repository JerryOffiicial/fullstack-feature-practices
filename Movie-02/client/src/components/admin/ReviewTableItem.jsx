import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import tick_icon from "../../assets/tick_icon.svg";
import bin_icon from "../../assets/bin_icon.svg";

const ReviewTableItem = ({ review, fetchReviews }) => {
  const { movie, createdAt, _id } = review;
  const MovieDate = new Date(createdAt);

  const { axios } = useAppContext();

  const approveReview = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-review", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteReviews = async () => {
    try {
      const confirm = window.confirm(
        "are you sure you want to delete this review?",
      );
      if (!confirm) return;
      const { data } = await axios.post("/api/admin/delete-review", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Movie</b> : {movie.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {review.name}
        <br />
        <b className="font-medium text-gray-600">review</b> : {review.content}
      </td>

      <td className="px-6 py-4 max-sm:hidden">
        {MovieDate.toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!movie.isApproved ? (
            <img
              onClick={approveReview}
              src={tick_icon}
              className="w-5 hover:scale-110 transition-all cursor-pointer"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}

          <img
            onClick={deleteReviews}
            src={bin_icon}
            alt=""
            className="w-5 hover:scale-110 transition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default ReviewTableItem;
