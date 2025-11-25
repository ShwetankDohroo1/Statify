import PlatformCard from "../dashboard-cards";

const Github = ({ data }: any) => {
    if (!data) return <p>No GitHub data.</p>;

    return (
        <PlatformCard
            title="GitHub"
            image={data.avatar}
            name={data.name}
            fields={[
                { label: "Followers", value: data.followers, },
                { label: "Public Repos", value: data.publicRepos },
                { label: "Bio", value: data.bio ?? "None" },
            ]}
        />
    );
}

export default Github;