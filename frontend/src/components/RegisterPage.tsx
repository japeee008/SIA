import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
    fname: "",
    lname: "",
    middleInitial: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {

    if (!formData.email.endsWith("@cit.edu") && !formData.email.endsWith("@cit.edu.ph")) {
      alert("Please use your CIT-U institutional email");
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
        alert("Registration failed");
      }

    } catch (err) {
      console.error(err);
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Register
        </h2>

        <div className="space-y-3">

          <input
            name="studentId"
            placeholder="Student ID"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            name="email"
            placeholder="Institutional Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            name="fname"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            name="lname"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            name="middleInitial"
            placeholder="Middle Initial"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

        </div>

        <div className="flex gap-3 pt-2">

          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleRegister}
            className="flex-1 bg-red-700 text-white py-2 rounded-lg hover:bg-red-800"
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
};

export default RegisterPage;