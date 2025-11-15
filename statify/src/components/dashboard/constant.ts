export const THEME_COLORS = {
    primary: {
        light: 'bg-blue-100 border-blue-300',
        medium: 'bg-blue-300 border-blue-500',
        dark: 'bg-blue-500 border-blue-700',
        darkest: 'bg-blue-600 border-blue-800 text-white',
    },
    accent: {
        green: 'bg-green-200 border-green-400',
        indigo: 'bg-indigo-200 border-indigo-400',
    },
} as const;

export const PLATFORM_COLORS = {
    leetcode: { bg: 'bg-yellow-500', name: 'LeetCode' },
    gfg: { bg: 'bg-green-500', name: 'GFG' },
    codeforces: { bg: 'bg-blue-500', name: 'CodeForces' },
    github: { bg: 'bg-purple-500', name: 'GitHub' },
} as const;

export const SHADES = [
    'bg-blue-100 border-blue-300',
    'bg-blue-200 border-blue-400',
    'bg-blue-300 border-blue-500',
    'bg-blue-400 border-blue-600',
    'bg-blue-500 border-blue-700',
    'bg-blue-600 border-blue-800 text-white',
];