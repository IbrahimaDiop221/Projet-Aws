'use client';

import { useRouter } from "next/navigation";
import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";

interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}
const EmptyState = ({
    title = 'Aucune correspondance exacte',
    subtitle = 'Essayez de modifier ou de supprimer certains de vos filtres',
    showReset
}: EmptyStateProps) => {
    const router = useRouter();


    return (
        <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
            <Heading
                title={title}
                subTitle={subtitle}
                center
            />

            <div className="w-48 mt-4">
                {showReset && (
                    <Button
                        outline
                        label="Supprimer tous les filtres"
                        onClick={() => router.push('/')}
                    />
                )}
            </div>
        </div>
    )
}

export default EmptyState;