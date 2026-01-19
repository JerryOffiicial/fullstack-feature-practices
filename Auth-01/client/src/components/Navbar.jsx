import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const {navigate, axios, userData,setUserData,setIsLoggedin} = useAppContext();

  const logout = async()=>{
    try {
      const {data} = await axios.post("/api/auth/logout");

      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");

    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img onClick={()=>navigate("/")} src={assets.logo} alt="" className="cursor-pointer w-28 sm:w-32" />

      {userData? 
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group"> 
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-10 rounded">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify email</li>
              )}
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-12">Logout</li>
            </ul>
          </div>
        </div>
      : <button onClick={()=>navigate('/login')} className="bg-black text-white text-md py-1.5 px-5 hover:rounded-full hover:border border-blue-600 transition-all cursor-pointer"> Login </button>}
      
    </div>
  );
};

export default Navbar;
