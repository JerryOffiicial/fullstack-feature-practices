import React, { useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { axios, navigate, toast } = useAppContext();
  const inputRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmited] = useState(false);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split(""); //it will become an array
    pasteArray.slice(0,6).forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/send-reset-otp", { email });

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 sm:px-24 gap-30 mt-5">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        alt=""
        className="w-28 cursor-pointer"
      />

      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="font-bold text-lg sm:text-2xl">Reset Passsword</h1>

        {/* Enter the email */}

        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="flex flex-col items-center justify-center gap-5"
          >
            <p className="font-normal text-xs md:text-m">
              Enter the registered email
            </p>
            <div className="flex gap-2 bg-black text-white p-2 rounded text-sm w-full">
              <img src={assets.mail_icon} alt="" />
              <input
                type="email"
                placeholder="email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" outline-none "
              />
            </div>

            <button
              className="bg-blue-200/80 py-1.5 px-3 border border-blue-900 hover:rounded-full transition-all cursor-pointer"
              type="submit"
            >
              submit
            </button>
          </form>
        )}

        {/* OTP input from */}

        {!isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitOTP}
            className="flex flex-col items-center justify-center gap-5"
          >
            <p className="font-normal text-xs md:text-m">
              Enter the password reset 6-Digit code that you've recieved from
              the mail
            </p>
            <div onPaste={handlePaste} className="flex justify-between">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    key={index}
                    maxLength="1"
                    placeholder="*"
                    required
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 m-2 bg-black text-white text-center text-xl rounded-md outline-none"
                  />
                ))}
            </div>
            <button
              className="bg-blue-200/80 py-1.5 px-3 border border-blue-900 hover:rounded-full transition-all cursor-pointer"
              type="submit"
            >
              submit
            </button>
          </form>
        )}

        {/* Enter new Password */}
        {isEmailSent && isOtpSubmitted && (
          <form
            onSubmit={onSubmitNewPassword}
            className="flex flex-col items-center justify-center gap-5"
          >
            <p className="font-normal text-xs md:text-m">
              Enter the new Password
            </p>

            <div className="flex gap-2 bg-black text-white p-2 rounded text-sm w-full">
              <img src={assets.lock_icon} alt="" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="outline-none "
              />
            </div>

            <button
              className="bg-blue-200/80 py-1.5 px-3 border border-blue-900 hover:rounded-full transition-all cursor-pointer"
              type="submit"
            >
              submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
