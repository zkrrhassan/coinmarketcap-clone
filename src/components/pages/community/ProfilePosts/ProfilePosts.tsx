import React, { MouseEvent, useState } from 'react';
import { Like, Post as PrismaPost, User } from '@prisma/client';
import axios from 'axios';
import Post from '../Post/Post';
import Link from 'next/link';
import {
	ActivitiesWrapper,
	ActivityItem,
	NoMoreContent,
	PostsContainer,
} from './ProfilePosts.styled';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

type Activity = 'posts' | 'comments' | 'likes';

type UserWithContent = User & {
	likes: (Like & {
		post: PrismaPost & {
			postAuthor: User | null;
			replyAuthor: User | null;
			likes: Like[];
		};
	})[];
	posts: (PrismaPost & {
		postAuthor: User;
		likes: Like[];
	})[];
	replies: (PrismaPost & {
		likes: Like[];
		replyAuthor: User;
		replyTo: PrismaPost & {
			postAuthor: User | null;
			replyAuthor: User | null;
		};
	})[];
};

const ProfilePosts = () => {
	const [activity, setActivity] = useState<Activity>('posts');
	const { query } = useRouter();
	const name = query.name;
	const {
		data: user,
		refetch,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['user', name],
		queryFn: async () =>
			(
				await axios.get<UserWithContent>('/api/user/getByName', {
					params: {
						name,
					},
				})
			).data,

		enabled: !!name,
	});

	const changeActivity = (e: MouseEvent) => {
		const target = e.target as HTMLDivElement;
		setActivity(target.innerText.toLowerCase() as Activity);
	};

	if (isLoading) return <div></div>;

	if (isError) return <div></div>;

	const { posts, replies, likes } = user;

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
				{activity === 'posts' && posts && (
					<>
						{posts.map((post) => (
							<Link key={post.id} href={`/community/post/${post.id}`}>
								<a>
									<Post
										key={post.id}
										{...post}
										image={post.postAuthor.image}
										name={post.postAuthor.name}
										displayName={post.postAuthor.displayName}
									/>
								</a>
							</Link>
						))}
					</>
				)}
				{activity === 'comments' && posts && (
					<>
						{replies.map((post) => {
							if (post.replyTo.postAuthor !== null) {
								// REPLY TO POST
								return (
									<div key={post.id}>
										<Post
											{...post.replyTo}
											likes={post.likes}
											image={post.replyTo.postAuthor.image}
											name={post.replyTo.postAuthor.name}
											displayName={post.replyTo.postAuthor.displayName}
											commented
										/>
										<Post
											{...post}
											likes={post.likes}
											image={post.replyAuthor.image}
											name={post.replyAuthor.name}
											displayName={post.replyAuthor.displayName}
											noMarginTop
											isComment
										/>
									</div>
								);
							} else if (post.replyTo.replyAuthor !== null) {
								// 'replyAuthor' in post.replyTo
								// REPLY TO REPLY
								return (
									<div key={post.id}>
										<Post
											{...post.replyTo}
											likes={post.likes}
											image={post.replyTo.replyAuthor.image}
											name={post.replyTo.replyAuthor.name}
											displayName={post.replyTo.replyAuthor.displayName}
											commented
										/>
										<Post
											{...post}
											likes={post.likes}
											image={post.replyAuthor.image}
											name={post.replyAuthor.name}
											displayName={post.replyAuthor.displayName}
											noMarginTop
											isComment
										/>
									</div>
								);
							}
						})}
					</>
				)}
				{activity === 'likes' && posts && (
					<>
						{likes.map((like) => {
							const post = like.post;
							if (post.postAuthor !== null) {
								return (
									<Post
										key={post.id}
										{...post}
										image={post.postAuthor.image}
										name={post.postAuthor.name}
										displayName={post.postAuthor.name}
										refetchCallback={refetch}
									/>
								);
							} else if (post.replyAuthor !== null) {
								return (
									<Post
										key={post.id}
										{...post}
										image={post.replyAuthor.image}
										name={post.replyAuthor.name}
										displayName={post.replyAuthor.name}
										refetchCallback={refetch}
									/>
								);
							}
						})}
					</>
				)}
				<NoMoreContent>No more {activity}</NoMoreContent>
			</PostsContainer>
		</div>
	);
};

export default ProfilePosts;
