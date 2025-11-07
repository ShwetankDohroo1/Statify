'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
    username: z.string().min(3, 'Username must be at least 3 characters'),
});

const LoginSignupToggleModal = () => {
    const router = useRouter();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(isSignup ? signupSchema : loginSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const handleToggle = () => {
        setIsSignup(!isSignup);
        form.reset();
        setShowPassword(false);
    };

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            if (isSignup) {
                await axios.post('/api/users/signup', values);
                toast.success('Welcome aboard! 🎉');
                setIsSignup(false);
                form.reset();
            } else {
                const res = await axios.post('/api/users/login', values);
                if (res.data?.user) {
                    const { username, leetcodeId, codeforcesId, gfgId, githubId } = res.data.user;
                    toast.success('Welcome back! 👋');
                    router.push(
                        !leetcodeId && !codeforcesId && !gfgId && !githubId
                            ? `/platform`
                            : `/dashboard/${username}`
                    );
                } else {
                    toast.error('Invalid response from server');
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative">
            <motion.div
                className="absolute rounded-3xl opacity-75"
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="relative rounded-3xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: 'easeOut' },
                }}
            >
                <div className="h-2" />

                <div className="p-8">
                    <div className="relative mb-8">
                        <div className="flex items-center justify-center gap-4 bg-gray-100 rounded-xl p-2">
                            <button
                                onClick={() => isSignup && handleToggle()}
                                className={`relative flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${!isSignup
                                        ? 'text-black'
                                        : 'text-gray-400 hover:text-[#474d57]'
                                    }`}
                            >
                                {!isSignup && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#948979] rounded-xl"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                    <Mail size={16} />
                                    Login
                                </span>
                            </button>

                            <button
                                onClick={() => !isSignup && handleToggle()}
                                className={`relative flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${isSignup
                                        ? 'text-black'
                                        : 'text-gray-400 hover:text-[#474d57]'
                                    }`}
                            >
                                {isSignup && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#DFD0B8] rounded-xl"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center text-lg justify-center gap-2">
                                    <Sparkles size={16} />
                                    Sign Up
                                </span>
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isSignup ? 'signup' : 'login'}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="text-center mb-6"
                        >
                            <h2 className="text-2xl font-bold text-[#E0D9D9] mb-2">
                                {isSignup ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-sm text-[#D2C1B6]">
                                {isSignup
                                    ? 'Join us and track your coding journey'
                                    : 'Sign in to continue to your dashboard'}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {isSignup && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <User
                                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#00ff8c] transition-colors"
                                                                size={20}
                                                            />
                                                            <Input
                                                                placeholder="Username"
                                                                {...field}
                                                                className="text-white pl-12 pr-4 py-6 border-2 rounded-xl focus:border-[#00ff8c] transition-all text-md"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs mt-1 ml-1" />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ff8c] transition-colors"
                                                    size={20}
                                                />
                                                <Input
                                                    type="email"
                                                    placeholder="Email address"
                                                    {...field}
                                                    className="text-white pl-12 pr-4 py-6 border-2 border-gray-200 rounded-xl focus:border-[#00ff8c] focus:ring-2 focus:ring-[#00ff8c]/20 transition-all text-md"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1 ml-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00ff8c] transition-colors"
                                                    size={20}
                                                />
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Password"
                                                    {...field}
                                                    className="text-white pl-12 pr-12 py-6 border-2 border-gray-200 rounded-xl focus:border-[#00ff8c] focus:ring-2 focus:ring-[#00ff8c]/20 transition-all text-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1 ml-1" />
                                    </FormItem>
                                )}
                            />

                            {!isSignup && (
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#00ff8c] focus:ring-[#00ff8c] cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-300 group-hover:text-gray-800 transition-colors">
                                            Remember me
                                        </span>
                                    </label>
                                    <button
                                        type="button"
                                        className="text-md text-[#948979] hover:text-[#00d4ff] font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full py-6 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {isSignup ? 'Create Account' : 'Sign In'}
                                        <ArrowRight
                                            size={18}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </span>
                                )}
                            </Button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-white px-3 text-gray-400 font-medium rounded-lg">
                                        OR CONTINUE WITH
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full py-4 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 group"
                                onClick={() => toast.info('Google login coming soon! 🚀')}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="group-hover:text-gray-900 transition-colors text-white">
                                    Continue with Google
                                </span>
                            </button>
                        </form>
                    </Form>
                    
                    <p className="text-center text-sm text-gray-500 mt-6">
                        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            onClick={handleToggle}
                            className="text-[#00ff8c] hover:text-[#00d4ff] font-semibold transition-colors"
                        >
                            {isSignup ? 'Sign in' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginSignupToggleModal;