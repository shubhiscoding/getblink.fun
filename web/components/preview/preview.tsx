import React from 'react';
import Image from 'next/image';

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
        <div className="w-full md:max-w-md">
            <div className="card p-6 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-6 text-[var(--accent-primary)]">
                    Preview
                </h2>

                <div className="w-full bg-white rounded-md p-5 shadow-sm border border-[var(--border-color)]">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-full max-w-[200px] sm:max-w-[220px] md:max-w-[250px] h-[200px] sm:h-[220px] md:h-[250px] rounded-md overflow-hidden border border-[var(--border-color)]">
                            <Image
                                src={icon}
                                alt="Icon"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                            />
                        </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold mb-2 text-[var(--text-color)] break-words">{title}</h3>
                    <p className="mb-3 text-sm sm:text-base text-[var(--text-secondary)] break-words">{description}</p>
                    {label.length > 0 && <h5 className="text-base sm:text-lg font-medium text-[var(--text-color)] mb-4 break-words">{label}</h5>}

                    <div className="space-y-4 mt-5">
                        <div className="flex gap-3">
                            <button
                                className="button-primary py-1.5 sm:py-2 text-xs sm:text-sm flex-1"
                                onClick={handleClick}
                            >
                                0.05 SOL
                            </button>
                            <button
                                className="button-primary py-1.5 sm:py-2 text-xs sm:text-sm flex-1"
                                onClick={handleClick}
                            >
                                1.00 SOL
                            </button>
                            <button
                                className="button-primary py-1.5 sm:py-2 text-xs sm:text-sm flex-1"
                                onClick={handleClick}
                            >
                                5.00 SOL
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <input
                                type="text"
                                className="flex-1 py-2 px-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md text-[var(--text-color)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                placeholder="Enter amount of SOL to send"
                            />
                            <button
                                className="px-4 py-2 rounded-md bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 transition-all duration-300"
                                onClick={handleClick}
                            >
                                Send SOL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Preview;
