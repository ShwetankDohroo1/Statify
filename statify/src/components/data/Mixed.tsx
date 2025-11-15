
export default function Mixed({ userData }: { userData: any }) {
    return (
        <div className="w-full p-4">

            {userData && (
                <div className="bg-white flex flex-col justify-center items-center p-4 rounded-lg shadow">
                    <div className="flex items-center mt-4">
                        <img src={userData.github?.avatar} alt="GitHub Avatar" className="w-12 h-12 rounded-full" />
                        <div className="ml-3">
                            <p className="font-semibold">{userData.github?.name}</p>
                            <a href={userData.github?.profileUrl} target="_blank" className="text-blue-500">
                                GitHub Profile
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
