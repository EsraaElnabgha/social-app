import React, { useContext } from 'react'
import { tokenContext } from '../Context/TokenContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import PostCard from '../Components/shared/PostCard'
import Loading from '../Components/shared/Loading'

export default function Posts() {
    let { userToken } = useContext(tokenContext);

    async function getPosts() {
        let { data } = await axios.get("https://route-posts.routemisr.com/posts",
            {
                headers: {
                    token: userToken
                }
            }
        )
        return data.data;
    }

    let { data, isLoading, isError } = useQuery({
        queryKey: [ "posts" ],
        queryFn: getPosts
    })

    if (isLoading) return <Loading />
    if (isError) return <div>Error loading posts</div>
    console.log(data);

    return (
        <div className="box-border max-w-7xl mx-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    )
}