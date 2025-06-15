'use client'

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import codeforces from '../../public/pics/codeforces.webp';
import gfg from '../../public/pics/gfg.png';
import leet from '../../public/pics/leet.png';
import arrow from '../../public/pics/right-arrow.png';
import Scene from './Scene';
const images = [
    { src: codeforces, alt: 'codeforces' },
    { src: gfg, alt: 'gfg' },
    { src: leet, alt: 'leetcode' },
];

export default function MainPage() {
    const [positions, setPositions] = useState([]);
    const dragItem = useRef(null);
    const lastMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        setPositions(images.map(() => ({
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100),
            dx: (Math.random() - 1) * 4,
            dy: (Math.random() - 1) * 4,
            isDragging: false
        })));
    }, []);

    useEffect(() => {
        const moveImages = () => {
            setPositions((prevPositions) =>
                prevPositions.map(({ x, y, dx, dy, isDragging }) => {
                    if (isDragging)
                        return { x, y, dx, dy, isDragging };
                    let newX = x + dx;
                    let newY = y + dy;
                    let newDx = dx;
                    let newDy = dy;
                    if (newX <= 0 || newX + 100 >= window.innerWidth) newDx *= -1;
                    if (newY <= 0 || newY + 100 >= window.innerHeight) newDy *= -1;
                    return { x: newX, y: newY, dx: newDx, dy: newDy, isDragging };
                })
            );
        };
        const interval = setInterval(moveImages, 16);
        return () => clearInterval(interval);
    }, []);

    const [holding, setHolding] = useState(false);
    const holdTimeout = useRef(null);

    const startDrag = (index, event) => {
        holdTimeout.current = setTimeout(() => {
            dragItem.current = index;
            lastMousePosition.current = { x: event.clientX, y: event.clientY };
            setHolding(true);
            setPositions((prev) =>
                prev.map((pos, i) => (i === index ? { ...pos, isDragging: true } : pos))
            );
        }, 150);
    };

    const onDrag = (event) => {
        if (dragItem.current === null || !holding)
            return;
        setPositions((prev) =>
            prev.map((pos, i) =>
                i === dragItem.current
                    ? { ...pos, x: event.clientX - 50, y: event.clientY - 50 }
                    : pos
            )
        );
    };
    const endDrag = (event) => {
        clearTimeout(holdTimeout.current);
        if (dragItem.current === null)
            return;
        const index = dragItem.current;
        const movementX = event.clientX - lastMousePosition.current.x;
        const movementY = event.clientY - lastMousePosition.current.y;
        setPositions((prev) =>
            prev.map((pos, i) =>
                i === index ? { ...pos, isDragging: false, dx: movementX * 0.01, dy: movementY * 0.01, } : pos
            )
        );
        //reset
        dragItem.current = null;
        setHolding(false);
    };


    return (
        <div className="mainpage flex flex-col h-screen w-full justify-evenly relative overflow-hidden" onMouseMove={onDrag} onMouseUp={endDrag} onMouseLeave={endDrag} >
            <div className="mx-auto w-6/12 flex flex-col items-center p-5">
                <div className="container1 flex flex-col w-full">
                    <div className="heading flex flex-col text-center justify-center items-center">
                        <h1 className="subheading relative inline-block text-7xl font-bold text-[#fe9859]">
                            Get Your Stats Using
                        </h1>
                        <div className="w-full max-w-3xl aspect-video relative">
                            <Scene />
                        </div>
                    </div>
                    <div className="about text-center p-5 m-5">
                        <h1 className="text-xl text-[#fe9859]">Get your complete statistics of your coding platforms</h1>
                    </div>
                </div>
                <div onClick={() => (window.location.href = "/loginsignup")} className="logbut flex w-6/12 text-white gap-5 text-center items-center justify-center bg-[#cb7a47] p-3 rounded-xl hover:bg-[#fec19b] hover:text-[#985b35] duration-200" >
                    <div className="flex flex-col">
                        <button className="text1 text-xl">Click here to start with your profile</button>
                        <button className="text2 text-xl">Click here to start with your profile</button>
                    </div>
                    <div className="">
                        <Image src={arrow} alt='arrow' width={30} className="invert arrow" />
                        <Image src={arrow} alt='arrow' width={30} className="invert arrow2" />
                    </div>
                </div>
            </div>
            <div className="floatdiv">
                {positions.map(({ x, y }, index) => (
                    <Image key={index} src={images[index].src} alt={images[index].alt} width={100} height={100} className="absolute cursor-pointer" style={{ transform: `translate(${x}px, ${y}px)`, position: 'absolute' }} onMouseDown={(event) => startDrag(index, event)} />
                ))}
            </div>
        </div>
    );
}
