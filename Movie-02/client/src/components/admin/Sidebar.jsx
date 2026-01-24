import React from "react";
import { NavLink } from "react-router-dom";
import home_icon from '../../assets/home_icon.svg'
import add_icon from '../../assets/add_icon.svg'
import list_icon from '../../assets/list_icon.svg'
import comment_icon from '../../assets/comment_icon.svg'
const Sidebar = () => {
  return (
    <div className="flex flex-col border-r border-gray-200 min-h-full pt-6">
      <NavLink
        end={true}
        to="/admin"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src={home_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>

      <NavLink
        to="/admin/addMovie"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src={add_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Add blogs</p>
      </NavLink>

      <NavLink
        to="/admin/listMovie"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src={list_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Blog lists</p>
      </NavLink>

      <NavLink
        to="/admin/reviews"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
            isActive && "bg-primary/10 border-r-4 border-primary"
          }`
        }
      >
        <img src={comment_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Comments</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
