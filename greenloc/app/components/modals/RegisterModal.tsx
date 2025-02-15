'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useState, useCallback } from 'react';

import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import Heading from '@/app/components/Heading';
import Modal from '@/app/components/modals/Modal';
import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button'; 
import { toast }   from 'react-hot-toast';

const RegisterModal = () => {
 const RegisterModal = useRegisterModal();
 const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> =  (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
        .then(() => {
            RegisterModal.onClose();
        })
        .catch((error) => {
            toast.error('Il ya erreur');
        })
        .finally(() => {
            setIsLoading(false);
        })
 
}

const bodyContent = (
    <div className="flex flex-col gap-4">
            <Heading 
                title="Bienvenue sur GreenLoc"
                subTitle="Inscrivez-vous pour continuer"
            />
            <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
             />
             <Input
                id="Nom"
                label="Nom"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
             />
             <Input
                id="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
             />
        </div>
);
const footerContent = (
    <div className='flex flex-col gap-4'>
        <hr />
        <Button 
            label="Continue with Google"
            icon={FcGoogle }
            onClick={() => {}}
            disabled={isLoading}
            />
        <Button
            label="Continue with Github"
            icon={AiFillGithub}
            onClick={() => {}}
            disabled={isLoading}
            />
        <div className="
            text-neutral-500
            text-center
            mt-4
            font-light">
        <div
            className="justify-center flex flex-row items-center gap-2">
                <div>
                    Already have an account?
                </div>
                <div className="
                text-neutral-800
                 cursor-pointer
                 hover:underline">
                    Se connecter
            </div>
        </div>
    </div>
 </div>
)   
    return (
        <Modal 
            disabled={isLoading}
            isOpen={RegisterModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={RegisterModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
            />
 );
}

export default RegisterModal;
