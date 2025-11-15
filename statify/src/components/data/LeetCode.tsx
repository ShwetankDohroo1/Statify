import PlatformCard from "../dashboard-cards";


const LeetCode = ({ userData }: any) => {
    if (!userData) return <p>No LeetCode data.</p>;

    const d = userData;

    return (
        <PlatformCard
            title="LeetCode"
            name={d.username}
            subtitle={`Global Rank: #${d.ranking}`}
            fields={[
                { label: "Total Solved", value: d.solved.total },
                { label: "Easy", value: d.solved.easy },
                { label: "Medium", value: d.solved.medium },
                { label: "Hard", value: d.solved.hard },
            ]}
        />
    );
}
export default LeetCode;