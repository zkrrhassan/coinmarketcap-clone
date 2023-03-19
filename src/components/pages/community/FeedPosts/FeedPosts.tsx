import { Like, Post as PrismaPost, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Post from '../Post/Post';
import { Search, SearchButton, SearchContainer } from './FeedPosts.styled';

type PostWithAuthor = PrismaPost & {
	postAuthor: User;
	likes: Like[];
};

const FeedPosts = () => {
	const { data: posts } = useQuery({
		queryKey: ['posts'],
		queryFn: async () =>
			(await axios.get<PostWithAuthor[]>('/api/post/getAll')).data,
	});

	return (
		<div>
			<SearchContainer>
				<Search type="text" placeholder="Search posts or users..." />
				<SearchButton>Search</SearchButton>
			</SearchContainer>
			{posts && (
				<div>
					{posts.map((post) => (
						<Post
							key={post.id}
							{...post}
							image={post.postAuthor.image}
							name={post.postAuthor.name}
							displayName={post.postAuthor.name}
							marginInline
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default FeedPosts;
