import PlatformCard from "../dashboard-cards";

const GFG = ({ userData }: any) => {
    if (!userData) return <p>No GFG data.</p>;

    const d = userData.data;

    return (
        <PlatformCard
            title="GeeksForGeeks"
            image={d.profile_image_url}
            name={d.name}
            fields={[
                { label: "Problems Solved", value: d.total_problems_solved },
                { label: "Score", value: d.score },
                { label: "Institute Rank", value: d.institute_rank },
                { label: "Monthly Score", value: d.monthly_score },
                { label: "POD Longest Streak", value: d.pod_solved_longest_streak },
                { label: "Global Longest Streak", value: d.pod_solved_global_longest_streak },
                { label: "Current POD Streak", value: d.pod_solved_current_streak },
                { label: "POD Correct Submissions", value: d.pod_correct_submissions_count },
            ]}
        />
    );
}

export default GFG;