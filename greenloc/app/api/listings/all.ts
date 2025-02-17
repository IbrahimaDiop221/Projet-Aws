import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/libs/prismadb'; // Adjust the import path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Optionally, you can add query parameters to filter listings, such as by category, price, etc.
      const { category } = req.query;

      // Construct filters
      const filters: any = {};

      if (category) {
        filters.category = category;
      }



      // Fetch listings with optional filters
      const listings = await prisma.listing.findMany({
        where: filters,
      });

      return res.status(200).json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
