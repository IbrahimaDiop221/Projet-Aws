import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb'; // Adjust the import path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // The listing ID from the URL

  if (req.method === 'DELETE') {
    try {
      // Find the listing and delete it
      const listing = await prisma.listing.delete({
        where: {
          id: String(id), // Convert id to string if it's an ObjectId
        },
      });

      return res.status(200).json({ message: 'Listing deleted successfully', listing });
    } catch (error) {
      console.error('Error deleting listing:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
