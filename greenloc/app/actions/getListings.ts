import { list } from "postcss";
import prisma from "../libs/prismadb";

immport prisma from "@/app/libs/prismadb";

export default async function getListings() {
    try{
        const listings = await prisma/listings.findMany({
            orderBy:{
                createdAt: 'desc'
            }

        })
    }catch (error: any) {
        throw new Error(error);
    }
}