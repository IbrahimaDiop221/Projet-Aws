import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb'; // Adjust the import path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, description, imageSrc, category, roomCount, bathroomCount, guestCount, locationValue, price, userId } = req.body;

      // Create a new listing
      const newListing = await prisma.listing.create({
        data: {
          title,
          description,
          imageSrc,
          category,
          roomCount,
          bathroomCount,
          guestCount,
          locationValue,
          price,
          userId,
        },
      });

      return res.status(201).json(newListing);
    } catch (error) {
      console.error('Error creating listing:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
