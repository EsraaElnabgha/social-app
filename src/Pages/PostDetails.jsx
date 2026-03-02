import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tokenContext } from "../Context/TokenContext";
import { BaseUrl } from "../env/env.environment";
import axios from "axios";
import Loading from "../Components/shared/Loading";

export default function PostDetails() {
  const { id } = useParams();
  const { userToken, userData } = useContext(tokenContext);
  const queryClient = useQueryClient();
  const [ commentText, setCommentText ] = useState("");
  const [ editingCommentId, setEditingCommentId ] = useState(null);
  const [ editCommentText, setEditCommentText ] = useState("");

  async function getPostDetails() {
    const { data } = await axios.get(`${BaseUrl}/posts/${id}`, {
      headers: { token: userToken },
    });
    return data.data.post;
  }

  async function getPostComments() {
    const { data } = await axios.get(
      `${BaseUrl}/posts/${id}/comments?page=1&limit=10`,
      { headers: { token: userToken } }
    );
    return data.data;
  }

  const { data: post, isLoading, isError } = useQuery({
    queryKey: [ "postDetails", id ],
    queryFn: getPostDetails,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: [ "postComments", id ],
    queryFn: getPostComments,
  });

  // Create comment
  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: (content) =>
      axios.post(
        `${BaseUrl}/posts/${id}/comments`,
        { content },
        { headers: { token: userToken } }
      ),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [ "postComments", id ] });
    },
  });

  // Update comment
  const { mutate: updateComment, isPending: isUpdatingComment } = useMutation({
    mutationFn: ({ commentId, content }) =>
      axios.put(
        `${BaseUrl}/posts/${id}/comments/${commentId}`,
        { content },
        { headers: { token: userToken } }
      ),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditCommentText("");
      queryClient.invalidateQueries({ queryKey: [ "postComments", id ] });
    },
  });

  // Delete comment
  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId) =>
      axios.delete(`${BaseUrl}/posts/${id}/comments/${commentId}`, {
        headers: { token: userToken },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ "postComments", id ] });
    },
  });

  function handleCreateComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    createComment(commentText);
  }

  function handleUpdateComment(commentId) {
    if (!editCommentText.trim()) return;
    updateComment({ commentId, content: editCommentText });
  }

  function handleDeleteComment(commentId) {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteComment(commentId);
    }
  }

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen bg-violet-100">
        <p className="text-xl font-bold text-red-500">Error loading post</p>
      </div>
    );

  return (
    <div className="flex py-8 items-center flex-col min-h-screen bg-violet-100">
      <div className="max-w-2xl w-full mx-4">
        <article className="p-6 rounded-xl bg-white flex flex-col shadow-md">
          {/* User info */}
          <div className="flex pb-6 items-center">
            <a className="inline-block mr-4" href="#">
              <img
                className="rounded-full max-w-none w-14 h-14"
                src={post?.user?.photo}
                alt={post?.user?.name}
              />
            </a>
            <div className="flex flex-col">
              <span className="text-lg font-bold">{post?.user?.name}</span>
              <span className="text-slate-500">{post?.createdAt?.slice(0, 10)}</span>
            </div>
          </div>

          {/* Post body */}
          <h2 className="text-2xl font-extrabold mb-4">{post?.body}</h2>

          {/* Post image */}
          {post?.image && (
            <div className="py-4">
              <img
                className="max-w-full rounded-lg"
                src={post.image}
                alt="post img"
              />
            </div>
          )}

          {/* Add Comment */}
          <form onSubmit={handleCreateComment} className="mt-4 pt-4 border-t">
            <div className="flex gap-3 items-start">
              <img
                className="rounded-full w-10 h-10 object-cover"
                src={userData?.photo}
                alt={userData?.name}
              />
              <div className="flex-1">
                <textarea
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none transition text-sm"
                  rows="2"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isCreating}
                  className="mt-2 px-4 py-1.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isCreating ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </form>

          {/* Comments section */}
          <div className="pt-6 border-t mt-4">
            <h3 className="text-lg font-bold mb-4">
              Comments ({commentsData?.comments?.length || 0})
            </h3>
            {commentsLoading ? (
              <div className="flex justify-center py-4">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
                </div>
              </div>
            ) : commentsData?.comments?.length > 0 ? (
              commentsData.comments.map((comment) => {
                const isCommentOwner = userData?._id === comment.commentCreator?._id;
                return (
                  <div key={comment._id} className="media flex pb-4 group">
                    <a className="mr-4 flex-shrink-0" href="#">
                      <img
                        className="rounded-full max-w-none w-10 h-10"
                        src={
                          comment.commentCreator?.photo ||
                          "https://randomuser.me/api/portraits/men/82.jpg"
                        }
                        alt={comment.commentCreator?.name}
                      />
                    </a>
                    <div className="media-body flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="inline-block text-base font-bold mr-2">
                            {comment.commentCreator?.name || "User"}
                          </span>
                          <span className="text-slate-500 text-sm">{comment.createdAt?.slice(0, 10)}</span>
                        </div>
                        {/* Edit/Delete for comment owner */}
                        {isCommentOwner && editingCommentId !== comment._id && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditCommentText(comment.content);
                              }}
                              className="p-1 rounded hover:bg-purple-50 text-purple-600"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="p-1 rounded hover:bg-red-50 text-red-500"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Editing or displaying comment */}
                      {editingCommentId === comment._id ? (
                        <div className="mt-1">
                          <textarea
                            className="w-full p-2 bg-gray-50 rounded-lg border border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none text-sm"
                            rows="2"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                          />
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => handleUpdateComment(comment._id)}
                              disabled={isUpdatingComment}
                              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                            >
                              {isUpdatingComment ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1">{comment.content}</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-4">No comments yet</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
