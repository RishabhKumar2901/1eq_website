import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { resetSignInState, signIn } from "../redux/slices/authSlice";
import Signup from "./Signup";

const Signin = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const authState = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [showSignup, setShowSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = dispatch(signIn({ email, password }));
      setEmail("");
      setPassword("");
      if (signIn?.fulfilled?.match(resultAction)) {
        handleClose();
      }
    }
    catch (error) { }
  };

  const handleClose = () => {
    dispatch(resetSignInState());
    onClose();
  };

  if (showSignup) {
    return <Signup onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-700"
        >
          ✖
        </button>
        <h2 className="text-3xl font-bold text-center mb-6 text-black">Sign In</h2>
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
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
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
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {authState?.signIn?.loading ? (
              <div className="flex w-full flex-wrap justify-center items-center">
                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
          {authState?.signIn?.error && (
            <div className="text-red-500 text-sm">{authState?.signIn?.error}</div>
          )}
          <div className="mt-4 text-center text-sm text-black">
            <span>Don't have an account? </span>
            <div
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
