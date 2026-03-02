import React, { useContext } from 'react'
import { tokenContext } from '../Context/TokenContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BaseUrl } from '../env/env.environment'
import Loading from '../Components/shared/Loading'
import PostCard from '../Components/shared/PostCard'

export default function Profile() {
  const { userData, userToken } = useContext(tokenContext);

  async function getUserPosts() {
    const { data } = await axios.get(
      `${BaseUrl}/users/${userData._id}/posts`,
      {
        headers: {
          token: userToken,
        },
      }
    );
    console.log("profile posts response:", data);
    return data.data?.posts || data.posts || [];
  }

  const { data: userPosts, isLoading: postsLoading } = useQuery({
    queryKey: [ "userPosts", userData?._id ],
    queryFn: getUserPosts,
    enabled: !!userData?._id,
  });

  if (!userData) return <Loading />;

  return (
    <div className="flex py-12 items-center flex-col min-h-screen bg-violet-100">
      <div className="max-w-4xl w-full mx-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-purple-600 to-violet-500"></div>

          {/* Avatar & Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col items-center -mt-16">
              <img
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                src={userData?.photo}
                alt={userData?.name}
              />
              <h1 className="mt-4 text-2xl font-bold text-gray-800">{userData?.name}</h1>
              <p className="text-purple-600 font-medium">@{userData?.name?.toLowerCase().replace(/\s+/g, '')}</p>
            </div>

            {/* Info Section */}
            <div className="mt-8 space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-700">{userData?.email}</p>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold text-gray-700">{userData?.name}</p>
                </div>
              </div>

              {/* Date Joined */}
              <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Joined</p>
                  <p className="font-semibold text-gray-700">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h2>
          {postsLoading ? (
            <div className="flex justify-center py-8">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
              </div>
            </div>
          ) : userPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.map((post) => (
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
