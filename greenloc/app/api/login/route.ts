import bcrypt from "bcrypt";
import prisma from '@/app/libs/prismadb';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

// Définir un type pour la réponse de reCAPTCHA
interface CaptchaResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
}

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password, captchaToken } = body;

    try {
        // Vérification du token reCAPTCHA
        const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY || '',
                response: captchaToken,
            }),
        });

        // Typage explicite de la réponse JSON
        const captchaResult: CaptchaResponse = await captchaResponse.json();

        // Si le captcha est invalide, retourne une erreur
        if (!captchaResult.success) {
            return NextResponse.json({ error: "Captcha invalide" }, { status: 400 });
        }

        // Vérification si l'utilisateur existe dans la base de données
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        if (!user?.hashedPassword) {
            throw new Error("Mot de passe non défini pour cet utilisateur.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        return NextResponse.json({
            message: 'Connexion réussie!',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}