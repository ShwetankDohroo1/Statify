"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    try{
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", { email });
      toast.success(response.data.message);
      setSuccess(true);
    }
    catch(error){
      console.log("Error sending email", error);
      toast.error(error.response?.data?.message || "Verification failed");
    } 
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="mb-7">{loading ? "Processing" : "Forgot Password"}</h1>
      <hr />
      <label htmlFor="email">Email</label>
      <input className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black mt-2" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
      <button type="submit" onClick={onSend} disabled={loading || email.length === 0} className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600" >
        {loading ? "Processing" : "Send Email"}
      </button>
    </div>
  );
};

export default ForgotPasswordPage;
