"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Platform() {
    const [username, setUsername] = useState("");
    const [leetcodeId, setLeetcodeId] = useState("");
    const [codeforcesId, setCodeforcesId] = useState("");
    const [gfgId, setgfgId] = useState("");
    const [githubId, setgithubId] = useState("");
    const [loading, setLoading] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const [noLeetcodeId, setNoLeetcodeId] = useState(false);
    const [noCodeforcesId, setNoCodeforcesId] = useState(false);
    const [noGfgId, setNoGfgId] = useState(false);
    const [noGithubId, setNoGithubId] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setInvalidFields([]);
        const invalidIds = [];

        try {
            const requests = [];

            if (!noCodeforcesId) {
                requests.push(
                    fetch(`https://codeforces.com/api/user.info?handles=${codeforcesId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.status !== "OK") invalidIds.push("codeforcesId");
                        })
                        .catch(() => invalidIds.push("codeforcesId"))
                );
            }

            if (!noGfgId) {
                requests.push(
                    fetch(`/api/gfg?username=${gfgId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            if (!data.data) invalidIds.push("gfgId");
                        })
                        .catch(() => invalidIds.push("gfgId"))
                );
            }

            if (!noGithubId) {
                requests.push(
                    fetch(`https://api.github.com/users/${githubId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.message === "Not Found") invalidIds.push("githubId");
                        })
                        .catch(() => invalidIds.push("githubId"))
                );
            }

            if (!noLeetcodeId) {
                requests.push(
                    fetch(`https://leetcode-api-faisalshohag.vercel.app/${leetcodeId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            if (!data) invalidIds.push("leetcodeId");
                        })
                        .catch(() => invalidIds.push("leetcodeId"))
                );
            }

            await Promise.all(requests);

        } 
        catch (error) {
            console.error("Error occurred while fetching platform IDs:", error);
            toast.error("An error occurred while fetching platform IDs. Please try again.");
            setLoading(false);
            return;
        }

        if (invalidIds.length > 0) {
            setInvalidFields(invalidIds);
            setLoading(false);
            toast.error("Some IDs are invalid, please check them!");
        } 
        else {
            try {
                const response = await axios.post("/api/users/platform", {
                    username,
                    leetcodeId: noLeetcodeId ? null : leetcodeId,
                    codeforcesId: noCodeforcesId ? null : codeforcesId,
                    gfgId: noGfgId ? null : gfgId,
                    githubId: noGithubId ? null : githubId,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.data.success) {
                    router.push(`/dashboard/${username}`);
                } 
                else {
                    toast.error("Failed to save platform IDs.");
                }
            } 
            catch (error) {
                console.error("Error occurred while saving data:", error);
                toast.error("An error occurred while saving the data.");
            } 
            finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800">Coding Platform IDs</h2>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <input type="text" placeholder="Your Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    {[
                        { label: "LeetCode ID", state: leetcodeId, setter: setLeetcodeId, noState: noLeetcodeId, noSetter: setNoLeetcodeId, field: "leetcodeId" },
                        { label: "CodeForces ID", state: codeforcesId, setter: setCodeforcesId, noState: noCodeforcesId, noSetter: setNoCodeforcesId, field: "codeforcesId" },
                        { label: "GFG ID", state: gfgId, setter: setgfgId, noState: noGfgId, noSetter: setNoGfgId, field: "gfgId" },
                        { label: "GitHub ID", state: githubId, setter: setgithubId, noState: noGithubId, noSetter: setNoGithubId, field: "githubId" },
                    ].map(({ label, state, setter, noState, noSetter, field }) => (
                        <div className="flex items-center" key={field}>
                            <input type="checkbox" checked={noState} onChange={() => noSetter(!noState)} className="mr-2" />
                            <input type="text" placeholder={label} value={state} onChange={(e) => setter(e.target.value)} className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${invalidFields.includes(field) ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`} disabled={noState} />
                        </div>
                    ))}
                    <button type="submit" className={`w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none ${loading && "opacity-50 cursor-not-allowed"}`} disabled={loading}> {loading ? "Saving..." : "Save IDs"}
                    </button>
                </form>
            </div>
        </div>
    );
}
