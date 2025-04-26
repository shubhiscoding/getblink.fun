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
        <div className="w-full max-w-md">
            <div className="glass-card p-8 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-6 text-gradient bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                    Preview
                </h2>
                
                <div className="w-full bg-[var(--card-bg)] rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-full max-w-[250px] h-[250px] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-lg">
                            <Image
                                src={icon}
                                alt="Icon"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-[var(--text-color)]">{title}</h3>
                    <p className="mb-3 text-[var(--text-secondary)] break-words">{description}</p>
                    {label.length > 0 && <h5 className="text-lg font-medium text-[var(--text-color)] mb-4">{label}</h5>}
                    
                    <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-3 gap-3">
                            <button 
                                className="button-primary py-2 text-sm"
                                onClick={handleClick}
                            >
                                0.01 SOL
                            </button>
                            <button 
                                className="button-primary py-2 text-sm"
                                onClick={handleClick}
                            >
                                0.05 SOL
                            </button>
                            <button 
                                className="button-primary py-2 text-sm"
                                onClick={handleClick}
                            >
                                1.00 SOL
                            </button>
                        </div>
                        
                        <div className="flex mt-3">
                            <input
                                type="text"
                                className="flex-1 py-2 px-4 bg-[rgba(0,0,0,0.2)] border border-[var(--border-color)] rounded-l-full text-[var(--text-color)] text-sm focus:outline-none"
                                placeholder="Enter amount of SOL to send"
                            />
                            <button
                                className="px-4 rounded-r-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-medium"
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
