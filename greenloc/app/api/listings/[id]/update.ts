import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb'; // Adjust the import path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // The listing ID from the URL

  if (req.method === 'PUT') {
    try {
      const { title, description, imageSrc, category, roomCount, bathroomCount, guestCount, locationValue, price, userId } = req.body;

      // Update the listing by its ID
      const updatedListing = await prisma.listing.update({
        where: {
          id: String(id), // Convert id to string if it's an ObjectId
        },
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

      return res.status(200).json(updatedListing);
    } catch (error) {
      console.error('Error updating listing:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
