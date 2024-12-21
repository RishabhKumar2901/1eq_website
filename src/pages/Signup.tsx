import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createUser } from "../redux/slices/authSlice";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createUser({ email, password, pincode }));
      setEmail("");
      setPassword("");
      setPincode("");
      if (!authState?.createUser?.error) {
        navigate("/signin");
      }
    } catch (error) {}
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-semibold text-gray-700"
            >
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your pincode"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {authState?.createUser?.loading ? (
              <div className="flex w-full flex-wrap justify-center items-center">
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
          {authState?.createUser?.error && (
            <div className="text-red-500 text-sm">
              {authState?.createUser?.error}
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <div
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
