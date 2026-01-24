import React, { useEffect, useState } from "react";
import { movieCategories } from "../../assets/assets";
import { useRef } from "react";
import Quill from "quill";
import toast from "react-hot-toast";
import { parse } from "marked";
import { useAppContext } from "../../context/AppContext";
import upload_area from "../../assets/upload_area.svg";
const AddMovie = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [category, setcategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/movie/generate", {
        prompt: title,
      });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message ||
          "AI service is busy. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const movie = {
        title,
        subTitle,
        year: Number(year),
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("movie", JSON.stringify(movie));
      formData.append("image", image);

      const { data } = await axios.post("/api/movie/add", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(false);
        setTitle("");
        setYear("");
        setSubtitle("");
        quillRef.current.root.innerHTML = "";
        setcategory("");
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    //Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? upload_area : URL.createObjectURL(image)}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="mt-4">Movie title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="mt-4">Sub title</p>
        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubtitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Year</p>
        <input
          type="number"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setYear(e.target.value)}
          value={year}
        />

        <p className="mt-4">Movie Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}

          <button
            disabled={loading} //to avoid the over loading
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer "
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <p className="mt-4">Movie category</p>
        <select
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
          value={category}
          onChange={(e) => setcategory(e.target.value)}
        >
          <option value="">Select category</option>
          {movieCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {isAdding ? "Adding......" : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddMovie;
