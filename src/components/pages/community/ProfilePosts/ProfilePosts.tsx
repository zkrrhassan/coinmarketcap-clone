import React, { MouseEvent, useEffect, useState } from 'react';
import { Comment, Post as PrismaPost, User } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Post from '../Post/Post';
import Link from 'next/link';
import {
	ActivitiesWrapper,
	ActivityItem,
	NoMoreContent,
	PostsContainer,
} from './ProfilePosts.styled';

type Activity = 'posts' | 'comments' | 'likes';

export type PostWithAuthor = PrismaPost & {
	author: User;
};

type CommentWithPost = Comment & {
	post: PostWithAuthor;
	author: User;
};

const ProfilePosts = () => {
	const [activity, setActivity] = useState<Activity>('posts');
	const [posts, setPosts] = useState<PostWithAuthor[]>([]);
	const [comments, setComments] = useState<CommentWithPost[]>([]);
	const [likes, setLikes] = useState<PostWithAuthor[]>([]);
	const { data } = useSession();

	useEffect(() => {
		fetchPosts();
	}, []);

	useEffect(() => {
		fetchActivity();
	}, [activity]);

	const changeActivity = (e: MouseEvent) => {
		const target = e.target as HTMLDivElement;
		setActivity(target.innerText.toLowerCase() as Activity);
	};

	const fetchPosts = async () => {
		const posts = await (
			await axios.get('/api/post/getAll', {
				params: {
					userId: data?.user.id,
				},
			})
		).data;
		setPosts(posts);
	};

	const fetchComments = async () => {
		if (!data) return;

		const comments = (
			await axios.get('/api/comment/getAll', {
				params: {
					userId: data.user.id,
				},
			})
		).data;

		setComments(comments);
	};

	const fetchLikes = async () => {
		if (!data) return;

		const likes = (
			await axios.get('/api/post/getLiked', {
				params: {
					userId: data.user.id,
				},
			})
		).data;

		setLikes(likes);
	};

	const fetchActivity = () => {
		if (activity === 'posts') {
			fetchPosts();
		}
		if (activity === 'comments') {
			fetchComments();
		}
		if (activity === 'likes') {
			fetchLikes();
		}
	};

	return (
		<div>
			<div>
				<ActivitiesWrapper>
					<ActivityItem
						selected={activity === 'posts'}
						onClick={changeActivity}
					>
						Posts
					</ActivityItem>
					<ActivityItem
						selected={activity === 'comments'}
						onClick={changeActivity}
					>
						Comments
					</ActivityItem>
					<ActivityItem
						selected={activity === 'likes'}
						onClick={changeActivity}
					>
						Likes
					</ActivityItem>
				</ActivitiesWrapper>
			</div>
			<PostsContainer>
				{activity === 'posts' && (
					<>
						{posts.map((post) => (
							<Link key={post.id} href={`/community/post/${post.id}`}>
								<a>
									<Post
										key={post.id}
										{...post}
										image={post.author.image}
										name={post.author.name}
										displayName={post.author.name}
									/>
								</a>
							</Link>
						))}
					</>
				)}
				{activity === 'comments' && (
					<>
						{comments.map(
							({
								id,
								createdAt,
								status,
								content,
								likes,
								author: commentAuthor,
								post,
								post: { author: postAuthor },
							}) => {
								const postData = {
									id: post.id,
									image: postAuthor.image,
									name: postAuthor.name,
									displayName: postAuthor.name,
									createdAt: post.createdAt,
									status: post.status,
									content: post.content,
									likes: post.likes,
								};
								const commentData = {
									id: id,
									image: commentAuthor.image,
									name: commentAuthor.name,
									displayName: commentAuthor.name,
									createdAt: createdAt,
									status: status,
									content: content,
									likes: likes,
								};
								return (
									<div key={id}>
										<Post {...postData} commented />
										<Post {...commentData} noMarginTop isComment />
									</div>
								);
							}
						)}
					</>
				)}
				{activity === 'likes' && (
					<>
						{likes.map((like) => (
							<Post
								key={like.id}
								{...like}
								image={like.author.image}
								name={like.author.name}
								displayName={like.author.name}
							/>
						))}
					</>
				)}
				<NoMoreContent>No more {activity}</NoMoreContent>
			</PostsContainer>
		</div>
	);
};

export default ProfilePosts;
