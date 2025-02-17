'use client';

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
import { useEffect, useState } from "react";
import getCurrentUser from "@/app/actions/getCurrentUser";



const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(null)
    useEffect(() => {
          // Fetch current user when the component mounts on the client-side
          const token = localStorage.getItem('userToken');
          if (token) {
           
              // Fetch the current user using the token
              getCurrentUser(token)
                .then(user => {
                  // Set the user state after fetching the user data
                  setCurrentUser(user);
                })
                .catch(error => {
                  console.error('Failed to fetch current user:', error);
                });
            
          }else{
            setCurrentUser(null)
          }
        }, []);
    console.log({currentUser});

  
    return (
        <div className="fixed w-full bg-white z-10 shadow-sm">
            <div className="
            py-4
            border-b-[1px]">
                <Container>
                   <div className="
                   flex
                   flex-row
                   items-center
                   justify-between
                   gap-3
                   md:gap-0
                   ">

                    <Logo />
                    <Search />
                    <UserMenu currentUser ={currentUser} />
                    </div> 
                </Container>

            </div>
            <Categories />
        </div>
    );
}

export default Navbar;