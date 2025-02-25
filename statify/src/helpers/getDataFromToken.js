import { NextRequest } from "next/server";
import  jwt from 'jsonwebtoken'

export const getDataFromToken = (request) => {
    try{
        const token = request.cookies.get("token")?.value || '';
        if(!token) 
            throw new Error("Token not found");
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        return decodedToken.id; 
    }
    catch(error){
        console.error("Token verification error:", error.message);
        throw new Error("Invalid or expired token");
    }
}