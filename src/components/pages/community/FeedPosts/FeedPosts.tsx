import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import { PostWithAuthor } from '../ProfilePosts/ProfilePosts';
import { Search, SearchButton, SearchContainer } from './FeedPosts.styled';

const Posts = () => {
	const [posts, setPosts] = useState<PostWithAuthor[]>([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const data = await (await axios.get('/api/post/getAll')).data;

			setPosts(data);
		};
		fetchPosts();
	}, []);

	return (
		<div>
			<SearchContainer>
				<Search type="text" placeholder="Search posts or users..." />
				<SearchButton>Search</SearchButton>
			</SearchContainer>
			<div></div>
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
		</div>
	);
};

export default Posts;
