import React, { useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const { axios, navigate, isLoggedin, userData, getUserData } =
    useAppContext();
  const inputRefs = useRef([]);

  const handleInput = (e, index)=>{
    if(e.target.value.length > 0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
    
  }

  const handleKeyDown = (e,index)=>{
    if(e.key === "Backspace" && e.target.value=== "" && index > 0){
      inputRefs.current[index-1].focus();
    }
  }

  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");//it will become an array
    pasteArray.forEach((char, index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otpArray = inputRefs.current.map((e) => e.value); //takes the value from the each element
      const otp = otpArray.join(""); //""->no seprater

      const { data } = await axios.post("/api/auth/verify-account", { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate("/")
  },[isLoggedin, userData])
  return (
    <div onPaste={handlePaste} className="flex flex-col gap-30 items-center justify-center p-4 sm:p-6 sm:px-24">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="w-28 cursor-pointer"
      />
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 items-center justify-center"
      >
        <h1 className="font-bold text-lg sm:text-2xl">Email Verification</h1>
        <p className="font-normal text-m ">
          Please enter the 6-digit code that you've recieved from the mail
        </p>

        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 m-2 bg-black text-white text-center text-xl rounded-md outline-none"
                ref={(e) => (inputRefs.current[index] = e)} //e-> DOM element, Store THIS input DOM element at position index inside the current array
                onInput={e=>handleInput(e, index)}
                onKeyDown={e=>handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="bg-blue-200 py-1.5 px-5 hover:rounded-full border border-blue-950"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
