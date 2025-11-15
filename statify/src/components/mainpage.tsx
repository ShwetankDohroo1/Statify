'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import GlareHover from './ui/Animations/GlareHover/GlareHover';
import Magnet from './ui/Animations/Magnet/Magnet';
import Particles from './ui/Backgrounds/Particles/Particles';
import ShinyText from './ui/TextAnimations/ShinyText/ShinyText';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import LoginSignupToggleModal from '@/app/loginsignup/page';

const TextPressure = dynamic(() => import('./ui/TextAnimations/TextPressure/TextPressure'), { ssr: false });

export default function MainPage() {
    const containerRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="mainpage flex flex-col h-full w-full justify-center relative overflow-hidden">
            <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={false}
                alphaParticles={false}
                disableRotation={false}
            />

            <div className="absolute flex w-full h-full items-center justify-center px-4">
                <div className="mx-auto w-full max-w-5xl flex flex-col items-center p-4 md:p-8">
                    <div className="container1 flex flex-col w-full">
                        <div className="heading flex flex-col text-center justify-center items-center">
                            <h1 className="subheading relative inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                                <ShinyText text="Get Your Stats Using" disabled={false} speed={3} className="shiny-text text-[#fe9859]" />
                            </h1>

                            <div className="w-full">
                                <TextPressure
                                    text="STATIFY"
                                    flex={true}
                                    alpha={false}
                                    stroke={false}
                                    width={true}
                                    weight={true}
                                    italic={true}
                                    textColor="#fe9859"
                                    strokeColor="#000000"
                                    minFontSize={24}
                                />
                            </div>
                        </div>

                        <div className="about text-center w-full p-4 md:p-6 lg:p-8" ref={containerRef}>
                            <p className="text-[#fe9859] text-2xl sm:text-3xl md:text-4xl">
                                Get your complete statistics of the coding platforms
                            </p>
                        </div>
                    </div>

                    <Magnet padding={100} disabled={false} magnetStrength={5} showTooltip={true} tooltipText="Click to get started">
                        <GlareHover glareColor="#ffffff" glareOpacity={0.4} glareAngle={-30} transitionDuration={800} playOnce={false}>
                            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                                <DialogTrigger>
                                    <div className="cursor-pointer w-full">
                                        <div className="logbut flex flex-col sm:flex-row items-center justify-center w-full gap-4 bg-[#cb7a47] text-white p-3 rounded-xl hover:bg-[#fec19b] hover:text-[#985b35] transition duration-200">
                                            <span className="text-lg sm:text-xl text-center">
                                                Click here to start with your profile
                                            </span>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="!z-100 bg-[#37353E] border-0">
                                    <LoginSignupToggleModal />
                                </DialogContent>
                            </Dialog>
                        </GlareHover>
                    </Magnet>
                </div>
            </div>
        </div>
    );
}
