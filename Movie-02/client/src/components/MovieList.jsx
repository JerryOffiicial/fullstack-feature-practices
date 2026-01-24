import React from "react";
import {  movieCategories } from "../assets/assets";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import MovieCard from "./MovieCard";
const MovieList = () => {
  const [menu, setMenu] = useState("All");
  const {movies, input} = useAppContext()

  const filteredMovies = ()=>{
    if(input === ''){
      return movies
    }
    return movies.filter((movie)=>movie.title.toLowerCase().includes(input.toLowerCase()) || movie.category.toLowerCase().includes(input.toLowerCase()))
  }
  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {movieCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0 h-7 -z-1 bg-primary rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredMovies()
          .filter((movie) => (menu === "All" ? true : movie.category === menu))
          .map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
      </div>
    </div>
  );
};

export default MovieList;
