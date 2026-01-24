import React from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import { useAppContext } from "./context/AppContext";
import Layout from "./pages/admin/Layout";
import Login from "./components/admin/Login";
import AddMovie from "./pages/admin/AddMovie";
import Dashboard from "./pages/admin/Dashboard";
import ListMovie from "./pages/admin/ListMovie";
import Reviews from "./pages/admin/Reviews";
import "quill/dist/quill.snow.css";
const App = () => {
  const { token } = useAppContext();
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/admin" element={token ? <Layout /> : <Login />}>
          <Route index element={<Dashboard />} />
          <Route path="addMovie" element={<AddMovie />} />
          <Route path="listMovie" element={<ListMovie />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
