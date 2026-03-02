import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { tokenContext } from '../Context/TokenContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BaseUrl } from '../env/env.environment'
import Loading from '../Components/shared/Loading'
import PostCard from '../Components/shared/PostCard'

export default function UserProfile() {
    const { userId } = useParams();
    const { userToken } = useContext(tokenContext);

    // Fetch user's posts (which includes user info)
    async function getUserPosts() {
        const { data } = await axios.get(
            `${BaseUrl}/users/${userId}/posts`,
            { headers: { token: userToken } }
        );
        console.log("userPosts response:", data);
        return data;
    }

    const { data, isLoading } = useQuery({
        queryKey: [ "userPosts", userId ],
        queryFn: getUserPosts,
        enabled: !!userId,
    });

    if (isLoading) return <Loading />;

    const posts = data?.data?.posts || data?.posts || [];
    // Get user info from the first post, or fallback
    const user = posts.length > 0 ? posts[ 0 ].user : null;

    return (
        <div className="flex py-12 items-center flex-col min-h-screen bg-violet-100">
            <div className="max-w-4xl w-full mx-4">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-purple-600 to-violet-500"></div>
                    <div className="relative px-8 pb-8">
                        <div className="flex flex-col items-center -mt-16">
                            <img
                                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                                src={user?.photo}
                                alt={user?.name}
                            />
                            <h1 className="mt-4 text-2xl font-bold text-gray-800">{user?.name || 'User'}</h1>
                        </div>
                    </div>
                </div>

                {/* User Posts */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Posts</h2>
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-xl shadow">
                            <p className="text-gray-500 text-lg">No posts yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
