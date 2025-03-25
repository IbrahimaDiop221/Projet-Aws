'use client';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";

import Avatar from '../Avatar'
import MenuItem from "@/app/components/navbar/MenuItem";

interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, []);

    const onRent = useCallback(() => {
        if(!currentUser) {
            return loginModal.onOpen();
        }

        rentModal.onOpen();
    }, [currentUser, loginModal, rentModal])

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                    onClick={onRent}
                >
                    Créer une annonce
                </div>
                <div
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-100 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                    onClick={toggleOpen}
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image}/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                            {currentUser ? (
                                <>
                                    <MenuItem onClick={() => router.push('/trips')} label="Mes réservations" />
                                    <MenuItem onClick={() => router.push('/favorites')} label="Mes favoris" />
                                    <MenuItem onClick={() => router.push('/reservations')} label="Mes voyages" />
                                    <MenuItem onClick={() => router.push('/properties')} label="Mes propriétés" />
                                    <MenuItem onClick={rentModal.onOpen} label="Louer ma maison" />
                                    <hr />
                                    <MenuItem onClick={() => signOut()} label="Se déconnecter"/>
                                </>
                            ):(
                                <>
                                    <MenuItem onClick={loginModal.onOpen} label="Se connecter"/>
                                    <MenuItem onClick={registerModal.onOpen} label="S'inscrire"/>
                                </>
                            )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu;