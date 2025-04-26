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
        return;
    }
    return (
        <div className="w-fit">
            <div className="w-fit p-[50px] rounded-[50px] backdrop-blur-[20px] saturate-[138%] bg-[rgba(17,25,40,0)] text-white font-sans shadow-[inset_0px_0px_20px_rgba(255,255,255,0.15)] max-w-[480px] text-wrap">
                <div className="flex justify-center items-center">
                    <div className="relative w-full max-w-[300px] h-[300px] rounded-2xl mb-4 shadow-[0_0px_4px_rgba(255,255,255,0.2)] md:max-w-[350px] md:min-h-[350px] overflow-hidden">
                        <Image
                            src={icon}
                            alt="Icon"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-2xl"
                        />
                    </div>
                </div>
                <h3 className="text-lg font-bold mb-1.5">{title}</h3>
                <p className="mb-1.5 break-words">{description}</p>
                {label.length > 0 && <h5 className="text-xl font-normal">{label}</h5>}
                <div className="mt-5">
                  <div className="flex gap-1.5 md:flex-col md:gap-2.5">
                    <button className="w-full py-3 px-0 border-none rounded-[50px] font-bold cursor-pointer mb-3 shadow-[0_3px_10px_rgba(0,0,0,1)] transition-colors duration-1000 bg-white text-[var(--bg-color)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent" onClick={handleClick}>0.01 SOL</button>
                    <button className="w-full py-3 px-0 border-none rounded-[50px] font-bold cursor-pointer mb-3 shadow-[0_3px_10px_rgba(0,0,0,1)] transition-colors duration-1000 bg-white text-[var(--bg-color)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent md:hidden" onClick={handleClick}>0.05 SOL</button>
                    <button className="w-full py-3 px-0 border-none rounded-[50px] font-bold cursor-pointer mb-3 shadow-[0_3px_10px_rgba(0,0,0,1)] transition-colors duration-1000 bg-white text-[var(--bg-color)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent" onClick={handleClick}>1.00 SOL</button>
                  </div>
                  <div className="flex mt-3">
                    <input
                        type="text"
                        className="w-full py-3 px-0 bg-black border border-[var(--border-color)] rounded-l-full text-[#bbbdbd] shadow-[0_3px_10px_rgba(0,0,0,1)] pl-3"
                        placeholder="Enter the amount of SOL to send*"
                    />
                    <button
                        className="w-1/2 rounded-r-full mb-0 bg-white text-black border-none py-3 px-0 font-bold cursor-pointer shadow-[0_3px_10px_rgba(0,0,0,1)] transition-colors duration-1000 hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent"
                        onClick={handleClick}
                    >
                        Send SOL
                    </button>
                  </div>
                </div>
            </div>
        </div>
    );
}

export default Preview;
