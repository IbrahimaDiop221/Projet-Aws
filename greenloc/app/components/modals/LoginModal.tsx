'use client';

import { signIn } from "next-auth/react";
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import ReCAPTCHA from "react-google-recaptcha";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "@/app/components/modals/Modal";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import useLoginModal from "@/app/hooks/useLoginModal";

const LoginModal = () => {
    const router = useRouter();

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();

    const [isLoading, setIsLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
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

        signIn('credentials', {
            ...data,
            captchaToken, // Inclure le token captcha
            redirect: false
        })
        .then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Connexion réussie');
                router.refresh();
                loginModal.onClose();
            }

            if (callback?.error) {
                toast.error(callback.error);
            }
        });
    };

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    };

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Bienvenue à nouveau"
                subTitle="Connectez-vous à votre compte !"
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
                label="Mot de passe"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            {/* Widget reCAPTCHA */}
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={handleCaptchaChange}
                onExpired={() => setCaptchaToken(null)}
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

            <Button
                outline
                label="Continuer avec Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="flex flex-row items-center justify-center gap-2">
                    <div>
                        Première fois sur Greenloc ?
                    </div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Créer un compte
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Connexion"
            actionLabel="Continuer"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default LoginModal;