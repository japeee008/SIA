import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    fname: "",
    lname: "",
    middleInitial: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {

    setError("");

    if (!formData.email.endsWith("@cit.edu") && !formData.email.endsWith("@cit.edu.ph")) {
      setError("Please use your CIT-U institutional email.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Registration successful");
        navigate("/");
      } else {
        const text = await res.text();
        setError(text || "Registration failed.");
      }

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-maroon">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 space-y-4">

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Register
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">

          <input
            name="studentId"
            placeholder="Student ID"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
          />

          <input
            name="email"
            placeholder="Institutional Email"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
          />

          <input
            name="fname"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
          />

          <input
            name="lname"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
          />

          <input
            name="middleInitial"
            placeholder="Middle Initial"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:outline-none"
          />

        </div>

        <div className="flex gap-3 pt-3">

          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleRegister}
            className="flex-1 bg-gold text-black py-2 rounded-lg font-medium hover:bg-yellow-500 transition"
          >
            Register
          </button>

        </div>

      </div>

    </div>

  );

};

export default RegisterPage;