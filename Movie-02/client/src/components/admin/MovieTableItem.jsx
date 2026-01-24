import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import cross_icon from '../../assets/cross_icon.svg'


const MovieTableItem = ({ movie, fetchMovies, index }) => {
  const { title, createdAt } = movie;
  const MovieDate = new Date(createdAt);

  const { axios } = useAppContext();

  const deleteMovie = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirm) return;
    try {
      const { data } = await axios.post("/api/movie/delete", { id: movie._id });
      if (data.success) {
        toast.success(data.message);
        await fetchMovies();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post("/api/movie/toggle-publish", {id: movie._id,});
      if (data.success) {
        toast.success(data.message);
        await fetchMovies();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{MovieDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            movie.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {movie.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button onClick={togglePublish} className="border px-2 py-0.5 mt-1 rounded cursor-pointer">
          {movie.isPublished ? "UnPublish" : "Publish"}
        </button>
        <img
        onClick={deleteMovie}
          src={cross_icon}
          alt=""
          className="w-8 hover:scale-110 transition-all cursor-pointer"
        />
      </td>
    </tr>
  );
};

export default MovieTableItem;
