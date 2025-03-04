'use client';

import { SafeUser } from "@/app/types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavorite from "@/app/hooks/useFavorite";

interface HeartButtonProps {
    listingId: string;
    currentUser?: SafeUser | null;
}

const HeartButton = ({
    listingId,
    currentUser
}: HeartButtonProps) => {
    const { hasFavorited, toggleFavorite } = useFavorite({
        listingId,
        currentUser
    });

    return (
        <div
            onClick={toggleFavorite}
            className="relative hover:opacity-80 transition cursor-pointer"
        >
            <AiOutlineHeart
                size={28}
                className="absolute -top-[2px~] -right-[2px] fill-white"
            />
            <AiFillHeart
                size={24}
                className={
                    hasFavorited ? 'fill-green-500' : 'fill-neutral-500/70'
                }
            />
        </div>
    )
}

export default HeartButton;