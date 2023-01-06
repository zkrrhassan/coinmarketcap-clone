import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Post from '../Post/Post';
import { PostWithAuthor } from '../ProfilePosts/ProfilePosts';
import { Search, SearchButton, SearchContainer } from './FeedPosts.styled';

const Posts = () => {
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
			<div></div>
			{posts && (
				<div>
					{posts.map((post) => (
						<Post
							key={post.id}
							image={post.author.image}
							name={post.author.name}
							displayName={post.author.name}
							{...post}
							marginInline
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default Posts;
