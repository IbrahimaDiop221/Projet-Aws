import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb'; // Adjust the import path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // The listing ID from the URL

  if (req.method === 'GET') {
    try {
      // Find the listing by its ID
      const listing = await prisma.listing.findUnique({
        where: {
          id: String(id), // Convert the id to string if it's an ObjectId
        },
      });

      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      return res.status(200).json(listing);
    } catch (error) {
      console.error('Error fetching listing:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
