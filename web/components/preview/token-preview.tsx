import React from 'react';
import Image from 'next/image';

interface TokenPreviewProps {
    icon: string;
    label: string;
    description: string;
    title: string;
}

const TokenPreview: React.FC<TokenPreviewProps> = ({ icon, label, description, title }) => {
    const handleClick = () => {
      window.alert("It's a dummy button only for preview, Generate Blink and try it for real!!");
    }

    return (
        <div className="w-full md:max-w-md">
            <div className="glass-card p-4 sm:p-6 md:p-8 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 md:mb-6 text-gradient bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                    Preview
                </h2>

                <div className="w-full bg-[var(--card-bg)] rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
                    <div className="flex justify-center mb-4 md:mb-6">
                        <div className="relative w-full max-w-[200px] sm:max-w-[220px] md:max-w-[250px] h-[200px] sm:h-[220px] md:h-[250px] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-lg">
                            <Image
                                src={icon}
                                alt="Icon"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold mb-2 text-[var(--text-color)] break-words">{title}</h3>
                    <p className="mb-3 text-sm sm:text-base text-[var(--text-secondary)] break-words">{description}</p>
                    {label.length > 0 && <h5 className="text-base sm:text-lg font-medium text-[var(--text-color)] mb-3 md:mb-4 break-words">{label}</h5>}

                    <div className="space-y-3 md:space-y-4 mt-4 md:mt-6">
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-2 sm:gap-3">
                            <button
                                className="button-primary py-1.5 sm:py-2 text-xs sm:text-sm"
                                onClick={handleClick}
                            >
                                0.05 SOL
                            </button>
                            <button
                                className="button-primary py-1.5 sm:py-2 text-xs sm:text-sm"
                                onClick={handleClick}
                            >
                                1.00 SOL
                            </button>
                        </div>

                        <div className="flex flex-col gap-1 mt-2 sm:mt-3">
                            <input
                                type="text"
                                className="flex-1 py-2 px-4 bg-[rgba(0,0,0,0.2)] border border-[var(--border-color)] rounded-full text-[var(--text-color)] text-sm focus:outline-none"
                                placeholder="Amount of SOL to Buy For.."
                            />
                            <button
                                className="md:button-primary md:py-1.5 px-4 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-medium"
                                onClick={handleClick}
                            >
                                {title}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TokenPreview;
