"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        if(!urlToken){
            setError("Invalid or missing token");
            return;
        }
        setToken(urlToken);
    }, []);
    const handleResetPassword = async () => {
        try{
            setLoading(true);
            const response = await axios.post("/api/users/resetpassword", { 
                token, 
                password 
            });
            toast.success(response.data.message);
            router.push("/login");
        } 
        catch(error){
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to reset password");
        } 
        finally{
            setLoading(false);
        }
    };
    if(error){
        return <div className="flex justify-center items-center min-h-screen">{error}</div>;
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="mb-4">{loading ? "Processing..." : "Reset Password"}</h1>
            <input className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none text-black focus:border-gray-600" type="password" placeholder="Enter your new password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleResetPassword} disabled={loading || password.length === 0} className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600" >
                {loading ? "Processing..." : "Submit"}
            </button>
        </div>
    );
}
