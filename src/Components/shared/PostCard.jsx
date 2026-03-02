import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { tokenContext } from '../../Context/TokenContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseUrl } from '../../env/env.environment'
import axios from 'axios'

export default function PostCard({ post }) {
    const { userData, userToken } = useContext(tokenContext);
    const queryClient = useQueryClient();
    const [ isEditing, setIsEditing ] = useState(false);
    const [ editBody, setEditBody ] = useState(post?.body || '');
    const [ commentText, setCommentText ] = useState('');
    const isOwner = userData?._id === post?.user?._id;

    // Delete post
    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: () => axios.delete(`${BaseUrl}/posts/${post._id}`, {
            headers: { token: userToken },
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ 'posts' ] });
            queryClient.invalidateQueries({ queryKey: [ 'userPosts' ] });
        },
    });

    // Update post
    const { mutate: updatePost, isPending: isUpdating } = useMutation({
        mutationFn: (updatedBody) => axios.put(`${BaseUrl}/posts/${post._id}`, { body: updatedBody }, {
            headers: { token: userToken },
        }),
        onSuccess: () => {
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: [ 'posts' ] });
            queryClient.invalidateQueries({ queryKey: [ 'userPosts' ] });
        },
    });

    // Create comment
    const { mutate: createComment, isPending: isCommenting } = useMutation({
        mutationFn: (content) => axios.post(`${BaseUrl}/posts/${post._id}/comments`, { content }, {
            headers: { token: userToken },
        }),
        onSuccess: () => {
            setCommentText('');
            queryClient.invalidateQueries({ queryKey: [ 'posts' ] });
        },
    });

    function handleUpdate() {
        if (!editBody.trim()) return;
        updatePost(editBody);
    }

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost();
        }
    }

    function handleComment() {
        if (!commentText.trim()) return;
        createComment(commentText);
    }

    return (
        <article className="break-inside break-inside-avoid p-6 rounded-xl bg-white flex flex-col bg-clip-border hover:shadow-lg transition-shadow">
            <div className="flex pb-6 items-center justify-between">
                <div className="flex">
                    <Link className="inline-block mr-4" to={`/profile/${post.user._id}`}>
                        <img className="rounded-full max-w-none w-12 h-12" src={post.user.photo} />
                    </Link>
                    <div className="flex flex-col">
                        <div>
                            <Link className="inline-block text-lg font-bold hover:text-purple-600 transition" to={`/profile/${post.user._id}`}>{post.user.name}</Link>
                        </div>
                        <div className="text-slate-500">{post.createdAt?.slice(0, 10)}</div>
                    </div>
                </div>
                {isOwner && (
                    <div className="flex gap-2">
                        <button onClick={() => { setIsEditing(!isEditing); setEditBody(post?.body || ''); }} className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition" title="Edit">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onClick={handleDelete} disabled={isDeleting} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition disabled:opacity-50" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Post body */}
            {isEditing ? (
                <div className="mb-4">
                    <textarea className="w-full p-3 bg-gray-50 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" rows="3" value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                    <div className="flex gap-2 mt-2">
                        <button onClick={handleUpdate} disabled={isUpdating} className="px-4 py-1.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 text-sm">
                            {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-sm">Cancel</button>
                    </div>
                </div>
            ) : (
                <h2 className="text-3xl font-extrabold">{post?.body}</h2>
            )}

            {/* Post image */}
            <div className="py-4">
                <div className="flex justify-between gap-1 mb-1">
                    <a className="flex" href="#">
                        <img className="w-full h-48 object-cover rounded-lg" src={post?.image || 'https://placehold.co/600x400?text=No+Image'} alt='post img' />
                    </a>
                </div>
            </div>

            {/* Likes, Comments count, View Details */}
            <div className="py-4 flex items-center gap-4">
                <a className="inline-flex items-center" href="#">
                    <span className="mr-2">
                        <svg className="fill-rose-600" style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
                            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                        </svg>
                    </span>
                    <span className="text-lg font-bold">{post.likesCount || 0}</span>
                </a>
                <a className="inline-flex items-center" href="#">
                    <span className="mr-2">
                        <svg className="text-slate-600" style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z" />
                        </svg>
                    </span>
                    <span className="text-lg font-bold">{post.commentsCount || 0}</span>
                </a>
                <Link to={`/postdetails/${post._id}`} className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold transition ml-auto">
                    View Details →
                </Link>
            </div>

            {/* Write a comment */}
            <div className="relative">
                <input
                    className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 rounded-lg placeholder:text-slate-600 font-medium pr-20"
                    type="text"
                    placeholder="Write a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleComment(); }}
                />
                <span className="flex absolute right-3 top-2/4 -mt-3 items-center">
                    <svg className="mr-2" style={{ width: 26, height: 26 }} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />
                    </svg>
                    <button onClick={handleComment} disabled={isCommenting} className="disabled:opacity-50">
                        <svg className="fill-purple-700 hover:fill-purple-900 transition cursor-pointer" style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                        </svg>
                    </button>
                </span>
            </div>

            {/* Top Comment */}
            <div className="pt-6">
                {post.topComment ? (
                    <div className="media flex pb-4">
                        <a className="mr-4" href="#">
                            <img className="rounded-full max-w-none w-12 h-12" src={post.topComment.commentCreator?.photo || 'https://randomuser.me/api/portraits/men/82.jpg'} />
                        </a>
                        <div className="media-body">
                            <div>
                                <a className="inline-block text-base font-bold mr-2" href="#">{post.topComment.commentCreator?.name || 'User'}</a>
                                <span className="text-slate-500">{post.topComment.createdAt?.slice(0, 10)}</span>
                            </div>
                            <p>{post.topComment.content}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">No comments</p>
                )}
            </div>
        </article>
    )
}