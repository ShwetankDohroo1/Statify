'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginSignupToggle = () => {
    const router = useRouter();
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    const handleToggle = () => {
        setIsSignup(!isSignup);
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup) {
            await onSignup();
        }
        else {
            await onLogin();
        }
    };
    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/login', { email, password });

            if (response.data?.user) {
                const { username, leetcodeId, codeforcesId, gfgId, githubId } = response.data.user;

                if (!leetcodeId && !codeforcesId && !gfgId && !githubId) {
                    router.push(`/platform`);
                } 
                else {
                    router.push(`/dashboard/${username}`);
                }

                toast.success('Login success');
            } 
            else {
                toast.error('Invalid response from server');
            }
        }
        catch (error) {
            console.error('Login Failed', error.message);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/signup', { email, password, username });
            console.log('Signup success', response.data);
            toast.success('Signup success');
            setIsSignup(false);
        }
        catch (error) {
            console.log('Signup failed', error);
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if ((isSignup && username.length > 0 && email.length > 0 && password.length > 0) || (!isSignup && email.length > 0 && password.length > 0)) {
            setButtonDisabled(false);
        }
        else {
            setButtonDisabled(true);
        }
    }, [email, password, username, isSignup]);
    const shake = {
        x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
        transition: { duration: 0.7 }
    };
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
            <motion.div className="w-full max-w-md bg-white rounded-3xl p-8 relative duration-300" style={{ boxShadow: isSignup ? '0 0 0 2px #00ff8c, 0 0 20px rgba(0, 255, 140, 0.2)' : '0 0 0 2px #000000, 0 0 20px rgba(0, 255, 140, 0.2)' }} >

                <div className="flex items-center justify-between mb-8 px-4">
                    <span className={`text-sm font-medium transition-colors duration-200 ${!isSignup ? 'text-[#00ff8c]' : 'text-gray-400'}`}>
                        JOIN
                    </span>
                    <div className="w-14 h-7 bg-gray-200 rounded-full p-1 cursor-pointer relative" onClick={handleToggle} >
                        <div className={`w-5 h-5 bg-[#00ff8c] rounded-full transition-transform duration-200 ${isSignup ? 'translate-x-7' : 'translate-x-0'}`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-200 ${isSignup ? 'text-[#00ff8c]' : 'text-gray-400'}`}>
                        SIGN UP
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <motion.div animate={shouldShake ? shake : {}}>
                            <input type="text" placeholder="USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 border-2 border-[#00ff8c] rounded-lg text-center uppercase text-sm tracking-wider focus:outline-none" />
                        </motion.div>
                    )}

                    <motion.div animate={shouldShake ? shake : {}}>
                        <input type="email" placeholder="E-MAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 border-2 border-[#00ff8c] rounded-lg text-center uppercase text-sm tracking-wider focus:outline-none" />
                    </motion.div>

                    <motion.div animate={shouldShake ? shake : {}}>
                        <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 border-2 border-[#00ff8c] rounded-lg text-center uppercase text-sm tracking-wider focus:outline-none" />
                    </motion.div>

                    {isSignup && (
                        <div className="flex items-center justify-center">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="focus:ring-[#00ff8c] text-[#00ff8c]" />
                                <span className="text-sm">Remember Me</span>
                            </label>
                        </div>
                    )}

                    <motion.button animate={shouldShake ? shake : {}} type="submit" className="w-full p-4 bg-[#00ff8c] text-white rounded-lg uppercase text-sm tracking-wider hover:bg-[#00e07d] transition-colors duration-200" disabled={buttonDisabled || loading} >
                        {isSignup ? 'Sign Up' : 'Login'}
                    </motion.button>

                    <div className="relative py-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">OR</span>
                        </div>
                    </div>

                    <motion.div animate={shouldShake ? shake : {}} className="space-y-4">
                        <button type="button" className="w-full p-4 border-2 border-[#db4437] text-[#db4437] rounded-lg uppercase text-sm tracking-wider hover:bg-[#db4437] hover:text-white transition-colors duration-200" >
                            Google +
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginSignupToggle;
