import PlatformCard from "../dashboard-cards";


const CodeForces = ({ userData }: any) => {
    if (!userData) return <p>No Codeforces data.</p>;

    const profile = userData.profile;
    const submissions = userData.submissions;

    const solved = submissions.filter((s: any) => s.verdict === "OK");
    const uniqueSolved = new Set(
        solved.map((s: any) => `${s.problem.contestId}-${s.problem.index}`)
    );

    return (
        <PlatformCard
            title="Codeforces"
            name={`${profile.firstName ?? ""} ${profile.lastName ?? ""}`}
            subtitle={profile.handle}
            fields={[
                { label: "Rank", value: profile.rank ?? "Unrated" },
                { label: "Rating", value: profile.rating ?? "N/A" },
                { label: "Max Rating", value: profile.maxRating ?? "N/A" },
                { label: "Max Rank", value: profile.maxRank ?? "N/A" },
                { label: "Organization", value: profile.organization ?? "N/A" },
                { label: "Country", value: profile.country ?? "N/A" },
                { label: "City", value: profile.city ?? "N/A" },
                { label: "Contribution", value: profile.contribution ?? 0 },
                { label: "Friends", value: profile.friendOfCount ?? 0 },
            ]}
            footer={
                <p><strong>Solved:</strong> {uniqueSolved.size}</p>
            }
        />
    );
}

export default CodeForces;
