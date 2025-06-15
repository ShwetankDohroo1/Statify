export default function GFG({ userData }) {
    if (!userData) {
        return (
            <div className="w-full p-4">
                <p>Loading your GFG data...</p>
            </div>
        );
    }

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">GFG Profile</h1>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="font-semibold">Name:</p>
                    <p>{userData.name}</p>
                </div>
                <div>
                    <p className="font-semibold">Institute:</p>
                    <p>{userData.institute_name}</p>
                </div>
                <div>
                    <p className="font-semibold">Problems Solved:</p>
                    <p className="text-blue-600 font-bold">{userData.total_problems_solved}</p>
                </div>
                <div>
                    <p className="font-semibold">Institute Rank:</p>
                    <p>#{userData.institute_rank}</p>
                </div>
            </div>
        </div>
    );
}
