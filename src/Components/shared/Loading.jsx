import React from 'react'

export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-violet-100">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
                </div>
                <p className="text-purple-700 font-semibold text-lg animate-pulse">Loading...</p>
            </div>
        </div>
    )
}
