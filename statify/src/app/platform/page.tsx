"use client";

import { motion } from "framer-motion";
import {
    Code2,
    Github,
    Trophy,
    FileCode,
    Sparkles,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PlatformKey, usePlatformForm } from "./usePlatform";

const platforms: {
    label: string;
    field: PlatformKey;
    icon: any;
    color: string;
    placeholder: string;
}[] = [
        {
            label: "LeetCode",
            field: "leetcodeId",
            icon: Code2,
            color: "from-yellow-400 to-orange-500",
            placeholder: "Enter your LeetCode username",
        },
        {
            label: "CodeForces",
            field: "codeforcesId",
            icon: Trophy,
            color: "from-blue-400 to-blue-600",
            placeholder: "Enter your CodeForces handle",
        },
        {
            label: "GeeksforGeeks",
            field: "gfgId",
            icon: FileCode,
            color: "from-green-400 to-green-600",
            placeholder: "Enter your GFG username",
        },
        {
            label: "GitHub",
            field: "githubId",
            icon: Github,
            color: "from-gray-600 to-gray-800",
            placeholder: "Enter your GitHub username",
        },
    ];

export default function Platform() {
    const {
        form,
        loading,
        isValidating,
        invalidFields,
        allSkipped,
        handleSkipToggle,
        getPlatformStatus,
        onSubmit,
    } = usePlatformForm();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F2F0FF] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl relative"
            >
                <div className="backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="bg-[#8C8C8C] p-8 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-8 h-8" />
                            <h2 className="text-3xl font-bold">Connect Your Platforms</h2>
                        </div>
                        <p className="text-blue-100">
                            Link your coding profiles to track your progress
                        </p>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="p-8 space-y-6 bg-[#faf8ff]"
                        >
                            <div className="space-y-4 text-[#a7a4b6]">
                                <label className="block text-lg font-semibold text-black mb-2">
                                    Platform IDs
                                </label>

                                {platforms.map(
                                    ({ label, field, icon: Icon, color, placeholder }, index) => {
                                        const { data, loading: statusLoading, error, isValidated } =
                                            getPlatformStatus(field);
                                        const isInvalid = invalidFields.includes(field);
                                        const skipField = `${field.replace("Id", "")}Skipped` as any;
                                        const isSkipped = form.watch(skipField);
                                        const value = form.watch(field);

                                        return (
                                            <motion.div
                                                key={field}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`p-4 rounded-xl border transition-all ${isInvalid
                                                        ? "bg-red-500/10 border-red-500"
                                                        : isSkipped
                                                            ? "bg-white/5 border-white/10"
                                                            : "bg-white/10 border-white/20 hover:border-white/40"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div
                                                        className={`p-2 rounded-lg bg-gradient-to-br ${color}`}
                                                    >
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-semibold text-[#474554] flex-1">
                                                        {label}
                                                    </span>
                                                    <FormField
                                                        control={form.control}
                                                        name={skipField}
                                                        render={({ field: skipFieldProps }) => (
                                                            <FormItem>
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={skipFieldProps.value as boolean}
                                                                            onCheckedChange={(checked) => {
                                                                                skipFieldProps.onChange(checked);
                                                                                handleSkipToggle(field);
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <span className="text-sm text-gray-300">
                                                                        Skip
                                                                    </span>
                                                                </label>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name={field}
                                                    render={({ field: inputField }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={placeholder}
                                                                    disabled={isSkipped}
                                                                    {...inputField}
                                                                    value={
                                                                        typeof inputField.value === "string"
                                                                            ? inputField.value
                                                                            : ""
                                                                    }
                                                                    className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${isInvalid
                                                                            ? "border-red-500 focus:ring-red-500"
                                                                            : "border-white/20 focus:ring-blue-500"
                                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {statusLoading && (
                                                    <p className="text-blue-400 text-sm mt-2 flex items-center gap-1">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Validating {label}...
                                                    </p>
                                                )}

                                                {!statusLoading &&
                                                    isValidated &&
                                                    data &&
                                                    !error &&
                                                    !isSkipped &&
                                                    value && (
                                                        <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            ✅ Verified: {value}
                                                        </p>
                                                    )}

                                                {!statusLoading &&
                                                    isValidated &&
                                                    error &&
                                                    !isSkipped &&
                                                    value && (
                                                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                                            <XCircle className="w-4 h-4" />
                                                            Invalid {label} ID - User not found
                                                        </p>
                                                    )}
                                            </motion.div>
                                        );
                                    }
                                )}
                            </div>

                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full">
                                            <Button
                                                type="submit"
                                                disabled={loading || isValidating || allSkipped}
                                                className="w-full text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                                            >
                                                {loading || isValidating ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        {isValidating ? "Validating..." : "Saving..."}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-5 h-5" />
                                                        Continue to Dashboard
                                                    </>
                                                )}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>

                                    {(loading || isValidating || allSkipped) && (
                                        <TooltipContent side="top">
                                            <p>
                                                {allSkipped
                                                    ? "You cannot skip all the IDs"
                                                    : "Please wait..."}
                                            </p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </form>
                    </Form>
                </div>
            </motion.div>
        </div>
    );
}