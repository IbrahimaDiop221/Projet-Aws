'use client';

import { CldUploadWidget } from "next-cloudinary"
import { useCallback } from "react"
import { TbPhotoPlus } from "react-icons/tb"
import Image from "next/image"

declare global {
    var cloudinary: any;
}

interface ImageUploadProps {
    onChange: (value: string) => void
    value: string;
}

const ImageUpload = ({ onChange, value }: ImageUploadProps) => {

    const handleUpload = useCallback((result: any) => {
        onChange(result.info.secure_url);
    },[onChange]);

    return (
        <CldUploadWidget
            onUpload={handleUpload}
            uploadPreset="greenloc"
            options={{
                maxFiles: 1
            }}
        >
            {({ open }) => {
                return (
                    <div
                        onClick={() => open?.()}
                        className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
                    >
                        <TbPhotoPlus size={50} />
                        <div className="font-semibold text-lg">
                            Cliquer pour téléverser une image
                        </div>

                        {value && (
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    alt="Upload"
                                    fill
                                    style={{ objectFit: 'cover'}}
                                    src={value}
                                />
                            </div>
                        )}
                    </div>
                )
            }}
        </CldUploadWidget>
    )
}

export default ImageUpload;