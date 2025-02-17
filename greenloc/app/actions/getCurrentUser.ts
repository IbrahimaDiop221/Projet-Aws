import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'; 
import axios from "axios";

export default async function getCurrentUser(token: any) {
    try {
        if (!token) {
            console.error('Token is missing, user is not authenticated');
            return;
        }

        // Make the request to the server with the token in the Authorization header
        const response = await axios.get('/api/me', {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
        });

        // Handle the server response
        console.log(response);
    
       return response.data.currentUser

    } catch (error: any) {
        return null;
    }
}