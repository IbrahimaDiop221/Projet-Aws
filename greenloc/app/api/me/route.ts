import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/app/libs/prismadb';  // Assuming you're using Prisma for DB interaction

// Secret key used to sign the JWT (ensure it's stored in .env for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Function to verify the token and extract user data
async function verifyToken(token: string) {
  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded; // Return decoded data (contains userId, email, etc.)
  } catch (error) {
    return null; // Return null if the token is invalid or expired
  }
}

// API handler to get user info based on token
export async function GET(req: NextRequest) {
  // Get the token from the Authorization header
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return NextResponse.json({ error: 'Authorization token is required' }, { status: 400 });
  }

  // Verify the token
  const decoded = await verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Vérifiez que decoded.userId n'est pas nul
  if (!decoded.userId) {
    return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
  }

  // Fetch user data from the database using the userId from the decoded token
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId }, // Assuming `userId` is part of the decoded token
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Return user info (remove sensitive information like password)
  const { hashedPassword, ...userData } = user;

  return NextResponse.json({ currentUser: userData });
}