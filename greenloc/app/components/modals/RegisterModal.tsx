'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import { signIn } from "next-auth/react";

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null); // État pour le token reCAPTCHA
    const [password, setPassword] = useState(""); // État pour le mot de passe
    const [passwordConditions, setPasswordConditions] = useState({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (!captchaToken) {
            toast.error("Veuillez compléter le captcha.");
            return;
        }

        setIsLoading(true);

        axios.post('/api/register', { ...data, captchaToken }) // Inclure le token reCAPTCHA
            .then(() => {
                toast.success('Utilisateur créé avec succès');

                registerModal.onClose();
                loginModal.onOpen();
            })
            .catch((error) => {
                console.log(error);
                toast.error('Une erreur est survenue !');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token); // Mettre à jour le token reCAPTCHA
    };

    const toggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
    }, [loginModal, registerModal]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        // Vérifier les conditions du mot de passe
        setPasswordConditions({
            minLength: value.length >= 8,
            hasUppercase: /[A-Z]/.test(value),
            hasNumber: /[0-9]/.test(value),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        });
    };

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Bienvenue sur Greenloc"
                subTitle="Créez un compte !"
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
                id="name"
                label="Nom"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <div>
                <Input
                    id="password"
                    type="password"
                    label="Mot de passe"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                    onChange={handlePasswordChange} // Correction : Typage explicite pour onChange
                />
                <div className="mt-2 text-sm">
                    <div className={`flex items-center gap-2 ${passwordConditions.minLength ? 'text-green-500' : 'text-red-500'}`}>
                        <span>✔</span> Minimum 8 caractères
                    </div>
                    <div className={`flex items-center gap-2 ${passwordConditions.hasUppercase ? 'text-green-500' : 'text-red-500'}`}>
                        <span>✔</span> Une majuscule
                    </div>
                    <div className={`flex items-center gap-2 ${passwordConditions.hasNumber ? 'text-green-500' : 'text-red-500'}`}>
                        <span>✔</span> Un chiffre
                    </div>
                    <div className={`flex items-center gap-2 ${passwordConditions.hasSpecialChar ? 'text-green-500' : 'text-red-500'}`}>
                        <span>✔</span> Un caractère spécial
                    </div>
                </div>
            </div>

            {/* Widget reCAPTCHA */}
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={handleCaptchaChange}
                onExpired={() => setCaptchaToken(null)} // Réinitialiser le token si le captcha expire
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                label="Continuer avec Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />

           
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row items-center justify-center gap-2">
                    <div>
                        Vous avez déjà un compte ?
                    </div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Connectez-vous
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Inscription"
            actionLabel="Continuer"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default RegisterModal;