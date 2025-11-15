import PlatformCard from "../dashboard-cards";

const Github = ({ data }: any) => {
    if (!data) return <p>No GitHub data.</p>;

    return (
        <PlatformCard
            title="GitHub"
            image={data.avatar}
            name={data.name}
            subtitle={data.profileUrl}
            fields={[
                { label: "Followers", value: data.followers },
                { label: "Bio", value: data.bio ?? "None" },
            ]}
        />
    );
}

export default Github;