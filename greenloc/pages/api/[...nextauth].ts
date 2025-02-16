import NextAuth, { AuthOptions } from "next-auth";  // Importation de NextAuth et du type AuthOptions
import { PrismaAdapter } from "@next-auth/prisma-adapter";  // Importation de l'adaptateur Prisma pour NextAuth
import prisma from '@/app/libs/prismadb';  // Importation de l'instance Prisma pour accéder à la base de données
import GoogleProvider from "next-auth/providers/google";  // Importation du fournisseur d'authentification Google
import CredentialsProvider from "next-auth/providers/credentials";  // Importation du fournisseur d'authentification par identifiants (email/mot de passe)
import bcrypt from 'bcrypt';  // Importation de bcrypt pour comparer les mots de passe hachés

// Définition des options d'authentification pour NextAuth
export const authOptions: AuthOptions = {
    providers: [

        // Fournisseur d'authentification avec Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,  // ID de l'application Google, récupéré depuis les variables d'environnement
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,  // Secret de l'application Google, récupéré depuis les variables d'environnement
        }),

        // Fournisseur d'authentification par identifiants (email et mot de passe)
        CredentialsProvider({
            name: 'credentials',  // Nom du fournisseur (ici "credentials")
            credentials: {
                email: { label: 'email', type: 'text' },  // Champ email de l'utilisateur
                password: { label: 'password', type: 'password' }  // Champ mot de passe de l'utilisateur
            },
            async authorize(credentials) {
                // Vérification de la validité des informations d'identification fournies
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');  // Si l'email ou le mot de passe sont manquants, lever une erreur
                }

                // Recherche de l'utilisateur dans la base de données
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email  // Recherche par email
                    }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');  // Si l'utilisateur n'est pas trouvé ou si le mot de passe haché est manquant, lever une erreur
                }

                // Comparaison du mot de passe fourni avec celui stocké dans la base de données
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,  // Mot de passe fourni par l'utilisateur
                    user.hashedPassword as string  // Mot de passe haché stocké dans la base de données
                );

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');  // Si les mots de passe ne correspondent pas, lever une erreur
                }

                return user;  // Si tout est valide, retourner l'utilisateur
            }
        })
    ],
    adapter: PrismaAdapter(prisma),  // Utilisation de l'adaptateur Prisma pour stocker les informations d'authentification dans la base de données
    pages: {
        signIn: '/',  // Redirection vers la page d'accueil pour se connecter
    },
    debug: process.env.NODE_ENV === 'development',  // Activer le mode debug en développement pour des logs détaillés
    session: {
        strategy: 'jwt'  // Utilisation de JWT pour gérer les sessions utilisateurs (tokens JSON Web)
    },
    secret: process.env.NEXTAUTH_SECRET,  // Secret utilisé pour signer les JWT (doit être stocké en toute sécurité dans les variables d'environnement)
}

// Exportation de la configuration NextAuth
export default NextAuth(authOptions);
