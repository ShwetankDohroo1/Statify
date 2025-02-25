"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const verifyUserEmail = async () => {
        try{
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
        } 
        catch(error){
            setError(true);
            console.log(error.response?.data);
        }
    };
    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
    }, []);
    useEffect(() => {
        if(token.length > 0){
            verifyUserEmail();
        }
    }, [token]);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-4">Verify Email</h1>

            <h2 className="p-2 bg-orange-500 text-black rounded mb-4">
                {token ? `Token: ${token}` : "No token provided"}
            </h2>

            {verified && (
                <div className="text-center">
                    <h2 className="text-2xl text-green-500 mb-4">Email Verified!</h2>
                    <Link href="/login">
                        <a className="text-blue-500 underline">Go to Login</a>
                    </Link>
                </div>
            )}

            {error && (
                <div className="text-center">
                    <h2 className="text-2xl bg-red-500 text-black rounded p-2">
                        Verification Error
                    </h2>
                </div>
            )}
        </div>
    );
}
