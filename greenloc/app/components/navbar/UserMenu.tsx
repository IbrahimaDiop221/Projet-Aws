'use client';

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback ,useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";

const UserMenu = () => {
    const RegisterModal = useRegisterModal();
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);
    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={() => {} }
                    className ="
                        hidden
                        md:block
                        text-sm
                        font-semibold
                        py-3
                        px-4
                        rounded-full
                        hover:bg-neutral-100
                        transition
                        cursor-pointer
                     "
                        >   
                Greenloc your home
        </div>
               
            <div 
                onClick={toggleOpen}
                className="
                    p-4
                    md:py-1
                    md:px-2
                    border-[1px]
                    border-neutral-200
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    hover:shadow-md
                    transition
                    cursor-pointer
                    "
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar />
                        </div>
                </div>
         </div>
         {isOpen && (
             <div
                className="
                    absolute
                    rounded-xl
                    shadow-md
                    w-[40vw]
                    md:w-3/4
                    bg-white
                    top-12
                    right-0
                    text-sm
                    overflow-hidden
                    ">
                        <div className="flex flex-col cursor-pointer">
                            <>
                            <MenuItem 
                                onClick={() => {}}
                                label="Login"
                            />
                             <MenuItem 
                                onClick={RegisterModal.onOpen}
                                label="Sign up "
                            />
                            </>
                    </div>
                </div>
            )}
        </div>
    );
    }
    export default UserMenu;