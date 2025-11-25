'use client';

import prepareGraphData, { DailyCountMap, DailySolvedMap } from "@/lib/prepare-graph-data";
import { useState, useMemo } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type PlotGraphProps = {
    dailyCounts: DailyCountMap;
    dailySolved: DailySolvedMap;
}

const PlotGraph = ({ dailyCounts, dailySolved }: PlotGraphProps) => {
    const [selectedMonth, setSelectedMonth] = useState("All");

    const graphData = useMemo(() => {
        return prepareGraphData(
            dailyCounts,
            dailySolved,
            selectedMonth,
            "daily"
        );
    }, [dailyCounts, dailySolved, selectedMonth]);

    const monthKeys = Array.from(
        new Set(Object.keys(dailyCounts).map((d) => d.slice(0, 7)))
    );

    const monthOptions = [
        { key: "All", label: "All" },
        ...monthKeys.map((m) => {
            const [y, mm] = m.split("-");
            return {
                key: m,
                label: `${[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ][Number(mm) - 1]} ${y}`
            };
        })
    ];

    return (
        <div className="space-y-4">
            <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border p-2 rounded bg-neutral-900 text-white"
            >
                {monthOptions.map((m) => (
                    <option key={m.key} value={m.key}>
                        {m.label}
                    </option>
                ))}
            </select>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                    <XAxis dataKey="date" hide />
                    <YAxis />

                    <Tooltip
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;

                            const item = payload[0].payload;

                            return (
                                <div className="bg-black text-white p-3 rounded-xl shadow-xl">
                                    <p className="font-bold">{item.readable}</p>
                                    <p>Solved: {item.count}</p>

                                    {item.problems?.length > 0 && (
                                        <div className="mt-2">
                                            <p className="font-semibold">Problems:</p>
                                            <ul className="text-sm list-disc ml-4">
                                                {item.problems.map((prob: any, idx: number) => (
                                                    <li key={idx}>{prob.title ?? "Unknown Title"}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8b5cf6"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PlotGraph;