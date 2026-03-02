import React, { useContext, useState } from 'react'
import { tokenContext } from '../../Context/TokenContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseUrl } from '../../env/env.environment'
import axios from 'axios'

export default function CreatePost() {
    const { userData, userToken } = useContext(tokenContext);
    const [ body, setBody ] = useState('');
    const [ image, setImage ] = useState(null);
    const [ preview, setPreview ] = useState(null);
    const queryClient = useQueryClient();

    function handleImageChange(e) {
        const file = e.target.files[ 0 ];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    function removeImage() {
        setImage(null);
        setPreview(null);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append('body', body);
            if (image) formData.append('image', image);

            const { data } = await axios.post(`${BaseUrl}/posts`, formData, {
                headers: {
                    token: userToken,
                },
            });
            return data;
        },
        onSuccess: () => {
            setBody('');
            setImage(null);
            setPreview(null);
            queryClient.invalidateQueries({ queryKey: [ 'posts' ] });
        },
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) return;
        mutate();
    }

    return (
        <div className="max-w-2xl w-full mx-auto mb-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                {/* User info + textarea */}
                <div className="flex gap-4">
                    <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={userData?.photo}
                        alt={userData?.name}
                    />
                    <div className="flex-1">
                        <p className="font-bold text-gray-800 mb-2">{userData?.name}</p>
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none transition"
                            rows="3"
                            placeholder="What's on your mind?"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                </div>

                {/* Image preview */}
                {preview && (
                    <div className="mt-4 relative">
                        <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer text-purple-600 hover:text-purple-800 transition font-medium">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <button
                        type="submit"
                        disabled={!body.trim() || isPending}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}
