import React from 'react';
import Image from 'next/image';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FormProps {
    icon: string;
    label: string;
    description: string;
    title: string;
}

const Preview: React.FC<FormProps> = ({ icon, label, description, title }) => {
    const handleClick = () => {
      window.alert("It's a dummy button only for preview, Generate Blink and try it for real!!");
    }

    return (
        <div className="w-full max-w-md">
            <Card className="bg-[#0f0a19] text-white overflow-hidden rounded-xl border-none shadow-xl">
                {/* Image Area */}
                <div className="relative h-96 w-full flex items-center justify-center bg-[#1a1225]">
                    {icon ? (
                        <Image
                            src={icon}
                            alt="Icon"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="opacity-90"
                        />
                    ) : (
                        <div className="text-purple-300 opacity-70">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14"></path>
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-white">{title || "Your Title"}</h3>
                    <p className="text-sm text-gray-300">{description || "Your Description shows up here. Keep it short and simple"}</p>
                    {label && <p className="text-purple-400 font-medium">{label || "Your Label"}</p>}

                    {/* SOL Buttons */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <Button
                            className="bg-[#2a1b3d] hover:bg-[#3a2b4d] text-white border-none"
                            onClick={handleClick}
                        >
                            0.05 SOL
                        </Button>
                        <Button
                            className="bg-[#2a1b3d] hover:bg-[#3a2b4d] text-white border-none"
                            onClick={handleClick}
                        >
                            1.00 SOL
                        </Button>
                        <Button
                            className="bg-[#2a1b3d] hover:bg-[#3a2b4d] text-white border-none"
                            onClick={handleClick}
                        >
                            5.00 SOL
                        </Button>
                    </div>

                    {/* Send SOL Input */}
                    <div className="flex gap-2 mt-3">
                        <Input
                            type="text"
                            className="bg-[#1a1225] border-[#3a2b4d] text-gray-300 placeholder-gray-500"
                            placeholder="Enter amount of SOL to send"
                        />
                        <Button
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                            onClick={handleClick}
                        >
                            Send SOL
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Preview;
