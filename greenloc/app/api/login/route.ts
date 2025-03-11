import bcrypt from "bcrypt"; // Importation de bcrypt pour le hachage des mots de passe
import prisma from '@/app/libs/prismadb'; // Importation de Prisma pour interagir avec la base de données
import { NextResponse } from "next/server"; // Importation de NextResponse pour formater la réponse HTTP
import jwt from 'jsonwebtoken'; // If you're using JWT for authentication

// Fonction qui gère les requêtes POST envoyées à cette route pour le login
export async function POST(request: Request) {

    // Extraction du corps de la requête en JSON
    const body = await request.json();

    // Déstructuration des valeurs reçues dans la requête
    const { email, password } = body;

    try {
        // Vérification si l'utilisateur existe dans la base de données
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // Si l'utilisateur n'existe pas, retourne une erreur
        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        // Comparaison du mot de passe entré avec le mot de passe haché dans la base de données
        if (!user?.hashedPassword) {
            throw new Error("Mot de passe non défini pour cet utilisateur.");
          }
          
          const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
          
        // Si le mot de passe est incorrect, retourne une erreur
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
        }

        // Si le mot de passe est correct, on peut créer un JWT ou autre token d'authentification
        // Exemple d'un JWT :
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key', // Assurez-vous que cette clé est stockée de manière sécurisée
            { expiresIn: '1h' } // Expiration du token
        );

        // Retourne une réponse avec un token d'authentification
        return NextResponse.json({
            message: 'Connexion réussie!',
            token: token, // On retourne le token généré
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        // Si une erreur se produit pendant la vérification, retourne une erreur serveur
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}
