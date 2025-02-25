'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar({ onBgChange }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleBgChange = () => {
        const newColor = prompt("Enter a hex color code (e.g., #ff5733):");
        if (newColor && /^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
            onBgChange(newColor);
            localStorage.setItem("dashboardBg", newColor);
        } else {
            alert("Invalid hex code! Please enter a valid hex color.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        router.push('/');
    };

    return (
        <div className="navbar flex w-full h-14 justify-center">
            <div className="mainnavbar flex relative bg-[#ffffff] h-full w-6/12 rounded-full justify-center items-center m-4 shadow-xl border border-[#d3d0d0]">
                <button onClick={toggleDropdown} className="px-4 py-2 text-black font-semibold">
                    Customise
                </button>
                <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                    <ul className="flex flex-col">
                        <li onClick={handleBgChange} className="px-4 py-2 hover:bg-[#f0f0f0] cursor-pointer">
                            Change BG
                        </li>
                    </ul>
                </div>
                <button onClick={handleLogout} className="ml-4 px-4 py-2 text-black font-semibold">
                    Logout
                </button>
            </div>
        </div>
    );
}
