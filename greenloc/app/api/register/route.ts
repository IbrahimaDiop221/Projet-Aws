import bcrypt from "bcrypt";
import prisma from '@/app/libs/prismadb';
import { NextResponse } from "next/server";
import fetch from 'node-fetch';

interface CaptchaResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
}

export async function POST(request: Request) {
    const body = await request.json();

    const {
        email,
        name,
        password,
        captchaToken // Récupérer le token reCAPTCHA envoyé par le client
    } = body;

    try {
        // Vérification du token reCAPTCHA
        const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY || '', // Clé secrète reCAPTCHA
                response: captchaToken, // Token envoyé par le client
            }),
        });

        const captchaResult = (await captchaResponse.json()) as CaptchaResponse;

        // Si le captcha est invalide, retourne une erreur
        if (!captchaResult.success) {
            return NextResponse.json({ error: "Captcha invalide" }, { status: 400 });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Création de l'utilisateur dans la base de données
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
            },
        });

        return NextResponse.json(user);

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}