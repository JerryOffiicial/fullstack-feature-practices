import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; //set the base url as default

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState("");

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get("/api/movie/all");
      data.success ? setMovies(data.movies) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setAuthToken = (newToken) => {
    setToken(newToken);
    axios.defaults.headers.common["Authorization"] = newToken;
  };

  const removeAuthToken = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
  };

  useEffect(() => {
    fetchMovies();
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `${token}`;
    }
  }, []);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    setAuthToken,
    movies,
    setMovies,
    input,
    setInput,
    removeAuthToken,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
