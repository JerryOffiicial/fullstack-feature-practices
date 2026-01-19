import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { navigate, axios, setIsLoggedin, getUserData,toast } =
    useAppContext();

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post("/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message || "Somethin went wrong");
    }
  };

  return (
    <div className="bg-black w-full min-h-screen text-white flex items-center justify-center">
      <div className="w-full sm:w-96 m-10  p-10 sm:p-5 bg-white/20">
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-xl">
            {state === "Sign Up" ? "Register" : "Login"}
          </h1>
          <h3 className="text-m font-light text-gray-400">
            {state === "Sign Up"
              ? "Create your account"
              : "Sign In to your account"}
          </h3>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-3">
            {state === "Sign Up" && (
              <div className="flex items-center justify-center gap-4 bg-black rounded-full py-1.5 px-2.5 ">
                <img src={assets.person_icon} alt="" className="p-1" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Your name"
                  className="outline-none text-xs"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-4 bg-black rounded-full py-1.5 px-2.5 ">
              <img src={assets.mail_icon} alt="" className="p-1" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your mail"
                className="outline-none text-xs"
                required
              />
            </div>

            <div className="flex items-center justify-center gap-4 bg-black rounded-full py-1.5 px-2.5 ">
              <img src={assets.lock_icon} alt="" className="p-1" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Your password"
                className="outline-none text-xs"
                required
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-3 mt-2">
              <button
                type="submit"
                className="w-30 font-medium text-sm py-1 bg-blue-400/40 cursor-pointer rounded-full"
              >
                {state}
              </button>

              {state === "Sign Up" ? (
                <p className="text-xs">
                  Already have an Accout?{" "}
                  <span
                    onClick={() => setState("Login")}
                    className="underline cursor-pointer text-blue-400/80"
                  >
                    Sign in
                  </span>
                </p>
              ) : (
                <p className="text-xs">
                  Don't have an Accout?{" "}
                  <span
                    onClick={() => setState("Sign Up")}
                    className="underline cursor-pointer text-blue-400/80"
                  >
                    Sign up
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
