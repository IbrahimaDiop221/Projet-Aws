import { PrismaClient } from '@prisma/client';

// Initialiser Prisma Client uniquement s'il n'est pas déjà disponible globalement
const prisma = globalThis.prisma ?? new PrismaClient();

// En mode développement, stocker l'instance de Prisma Client globalement pour éviter plusieurs instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
