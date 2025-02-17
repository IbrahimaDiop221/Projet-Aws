"use client"

import { signIn } from "next-auth/react";

import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form'

import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import axios from "axios";
const LoginModal = () => {
    const router = useRouter();

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/login', data)
        .then((response) => {
            // Check if the response is successful
            if (response.status === 200) {
                // Assuming the response contains a success message or user data
                console.log('Connexion réussie! ' );
                console.log(response.data)
    
                // Perform any actions after successful login
                // Example: Saving token or user data in localStorage or state
                localStorage.setItem('userToken', response.data.token);
               
                loginModal.onClose();
                window.location.reload(); // Reloads the entire page

            } else {
                // Handle cases where response code is not 200, if necessary
                toast.error('Une erreur s\'est produite lors de la connexion.');
            }
        })
        .catch((error) => {
            // Handle different types of error responses
            if (error.response) {
                console.log(error.response)
                // Server-side error (e.g., 401 - Unauthorized, 500 - Internal Server Error)
                if (error.response.status === 401) {
                    toast.error('Identifiants incorrects.');
                } else {
                    toast.error('Erreur serveur, réessayez plus tard.');
                }
            } else if (error.request) {
                // Network error or no response from server
                toast.error('Problème de connexion. Vérifiez votre connexion réseau.');
            } else {
                // Any other error (e.g., invalid axios setup)
                toast.error('Une erreur inattendue est survenue.');
            }
        })
    }

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome back"
                subTitle="Login to your account!"
            />

            <Input
                id="email"
                label="E-mail"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />

            <Button
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row items-center justify-center gap-2">
                    <div>
                        First time using Airbnb?
                    </div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Create an account
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal;