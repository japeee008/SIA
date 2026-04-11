import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {

    if (!email) {
      alert("Please enter your CIT email");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email }
      );

      const token = res.data.resetToken;

      // redirect user automatically with token
      navigate(`/reset-password?token=${token}`);

    } catch (err) {

      alert("Email not found");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#800000]">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[380px]">

        <h2 className="text-xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter CIT Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-gold text-black py-3 rounded hover:bg-yellow-500 transition"
        >
          Request Reset
        </button>

      </div>

    </div>

  );

};

export default ForgotPasswordPage;