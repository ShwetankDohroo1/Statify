export type DailyCountMap = Record<string, number>;
export type DailySolvedMap = Record<string, any[]>;

export type GraphMode = "daily" | "monthly";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const formatReadableDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};

const formatMonthName = (ym: string) => {
    const [y, m] = ym.split("-");
    return `${MONTHS[Number(m) - 1]} ${y}`;
};

export interface GraphPoint {
    date: string;
    month?: string;
    count: number;
    problems?: any[];
}

const prepareGraphData = (
    dailyCounts: DailyCountMap,
    dailySolved: DailySolvedMap,
    monthFilter: string | "All" = "All",
    mode: GraphMode = "daily"
): GraphPoint[] => {
    if (!dailyCounts) return [];

    if (mode === "monthly") {
        const monthly: Record<
            string,
            { count: number; problems: any[] }
        > = {};

        Object.entries(dailyCounts).forEach(([date, count]) => {
            const monthKey = date.slice(0, 7);

            if (!monthly[monthKey]) monthly[monthKey] = { count: 0, problems: [] };

            monthly[monthKey].count += count;

            if (dailySolved[date]) {
                monthly[monthKey].problems.push(...dailySolved[date]);
            }
        });

        return Object.entries(monthly).map(([ym, obj]) => ({
            date: ym + "-01",
            readable: formatMonthName(ym),
            count: obj.count,
            problems: obj.problems,
        }));
    }

    return Object.entries(dailyCounts)
        .filter(([date]) => monthFilter === "All" || date.startsWith(monthFilter))
        .map(([date, count]) => ({
            date,
            readable: formatReadableDate(date),
            count,
            problems: dailySolved[date] || [],
        }));
}
export default prepareGraphData;