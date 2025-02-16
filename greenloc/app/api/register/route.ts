import bcrypt from "bcrypt"; // Importation de bcrypt pour le hachage des mots de passe
import prisma from '@/app/libs/prismadb'; // Importation de Prisma pour interagir avec la base de données
import { NextResponse } from "next/server"; // Importation de NextResponse pour formater la réponse HTTP

// Fonction qui gère les requêtes POST envoyées à cette route
export async function POST(request: Request) {
    
    // Extraction du corps de la requête en JSON
    const body = await request.json();

    // Déstructuration des valeurs reçues dans la requête
    const { name, email, password } = body;

    // Hachage du mot de passe avec bcrypt et un facteur de coût de 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création d'un nouvel utilisateur dans la base de données
    const user = await prisma.user.create({
        data: { name, email, hashedPassword }
    });

    // Retourne l'utilisateur créé sous format JSON
    return NextResponse.json(user);
}
