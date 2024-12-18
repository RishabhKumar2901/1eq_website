import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/1eq-foundation-logo.png";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../Firebase";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const createUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential?.user;
      console.log("User created:", user);

      storeUserData(user);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const storeUserData = async (user: any) => {
    try {
      await setDoc(doc(db, "users", user?.uid), {
        pincode: pincode,
      });
      console.log("User data stored successfully");
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser();
    console.log("Sign Up:", { email, password, pincode });
    setEmail("");
    setPassword("");
    setPincode("");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`w-1/2 flex flex-col justify-center px-8 bg-white`}>
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
            Sign Up
          </button>
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

      <div className={`w-1/2 flex justify-center items-center bg-blue-600`}>
        <img src={logo} alt="Logo" className="w-1/4" />
      </div>
    </div>
  );
};

export default SignUp;
