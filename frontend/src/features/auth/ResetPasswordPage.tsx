import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {

  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // get token from URL
  const token = searchParams.get("token");

  const handleReset = async () => {

    if (!password) {
      alert("Please enter a new password");
      return;
    }

    try {

      await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        {
          token: token,
          password: password
        }
      );

      alert("Password reset successful");

      // redirect back to login
      navigate("/");

    } catch (err) {

      alert("Invalid or expired token");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#800000]">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[380px]">

        <h2 className="text-xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          onClick={handleReset}
          className="w-full bg-gold text-black py-3 rounded hover:bg-yellow-500 transition"
        >
          Reset Password
        </button>

      </div>

    </div>

  );

};

export default ResetPasswordPage;