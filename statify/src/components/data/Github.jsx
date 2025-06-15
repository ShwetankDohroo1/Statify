export default function Github({ data }) {
    return (
        <div className="w-full p-4">
            {data ? (
                <div className="bg-white p-4 rounded-lg shadow text-black">
                    <h1 className="text-5x">Github</h1>
                    <h2 className="text-xl font-bold">{data.name}</h2>
                    <p>About: {data.bio}</p>
                    <p>Followers: {data.followers}</p>
                </div>
            ) : (
                <p className="text-red-500">GitHub data not available.</p>
            )}
        </div>
    );
}