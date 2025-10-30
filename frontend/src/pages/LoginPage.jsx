import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

import loginImg from "../assets/1147164.jpg";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData, {
      onSuccess: () => {
        toast.success("Logged in successfully!");
        navigate("/");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Login failed!");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90 p-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-black/50 border-2 border-[#0ff] rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden">
        
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3 mb-6">
            <ShipWheelIcon className="text-[#0ff] w-10 h-10 animate-pulse" />
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] via-[#f0f] to-[#ff0] tracking-wider">
              TalkToGod
            </span>
          </div>

          {error && (
            <div className="text-red-500 font-medium">{error?.response?.data?.message || "Login failed."}</div>
          )}

          <h2 className="text-2xl font-bold text-[#0ff]">Welcome Back</h2>
          <p className="text-white/80 mb-4 text-sm">Sign in to continue your useless conversations.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full bg-black/70 border-[#0ff] text-[#0ff] placeholder-[#0ff]/60 focus:border-[#f0f] focus:ring-[#f0f]"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full bg-black/70 border-[#0ff] text-[#0ff] placeholder-[#0ff]/60 focus:border-[#f0f] focus:ring-[#f0f]"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={isPending}
              className="btn w-full bg-[#0ff] hover:bg-[#f0f] text-black font-bold"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-white/80 text-center mt-3 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#0ff] hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-black/30 p-5">
          <img
            src={loginImg}
            alt="Gaming Neon"
            className="rounded-xl shadow-xl object-cover w-60 h-80"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
