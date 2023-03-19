import React, { MouseEvent } from 'react';
import Link from 'next/link';
import { faFaceLaugh } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import ProfileImage from 'components/ProfileImage/ProfileImage';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import {
	ButtonsWrapper,
	DisplayName,
	ImageWrapper,
	MessageBox,
	Name,
	NameWrapper,
	PostButton,
	PostFormContainer,
	PostFormHeader,
	PostFormWrapper,
	RadioInput,
	RadioLabel,
	StatusWrapper,
} from './CreatePostForm.styled';
import { useTheme } from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from 'hooks/redux';
import { changeAuthOpen } from 'app/slices/menuSlice';
import Loader from 'styled/elements/Loader';

interface Inputs {
	status: 'bullish' | 'bearish' | null;
	content: string;
}

interface PostFormProps {
	comment?: boolean;
	postId?: string;
}

const createPostSchema = z.object({
	status: z.string().nullish(),
	content: z.string().min(1).max(999),
});

const CreatePostForm = ({ comment, postId }: PostFormProps) => {
	const { register, handleSubmit, watch, setValue } = useForm<Inputs>({
		resolver: zodResolver(createPostSchema),
	});
	const dispatch = useAppDispatch();
	const status = watch('status');
	const { data: session } = useSession();
	const userId = session?.user.id;
	const {
		colors: { white, upColor, downColor },
	} = useTheme();
	const queryClient = useQueryClient();
	const create = useMutation({
		mutationFn: async (inputs: Inputs) => {
			const params = comment
				? { replyToId: postId, replyAuthorId: userId }
				: { postAuthorId: userId };

			return await axios.post(
				'/api/post/create',
				{
					...inputs,
				},
				{
					params,
				}
			);
		},
		onSuccess: () => {
			toast(`Created ${comment ? 'comment' : 'post'} successfully`);
			setValue('content', '');
			setValue('status', null);
			comment
				? queryClient.invalidateQueries(['postWithComments'])
				: queryClient.invalidateQueries(['posts']);
		},
	});

	const unselectRadioInput = (event: MouseEvent) => {
		const button = event.target as HTMLInputElement;
		if (button.value === status) {
			setValue('status', null);
		}
	};

	const onSubmit = async (inputs: Inputs) => {
		create.mutate(inputs);
	};

	const handleSignupOpen = (event: MouseEvent) => {
		event.preventDefault();
		dispatch(changeAuthOpen('signup'));
	};

	return (
		<PostFormContainer comment={comment}>
			<ImageWrapper>
				<ProfileImage
					variant="medium"
					width={56}
					height={56}
					firstLetter="Guest"
					source={session?.user.image}
				/>
			</ImageWrapper>
			<PostFormWrapper>
				<form onSubmit={handleSubmit(onSubmit)}>
					<PostFormHeader>
						{session ? (
							<Link href={``}>
								<a>
									<NameWrapper>
										<DisplayName>{session.user.displayName}</DisplayName>
										<Name>{session.user.name}</Name>
									</NameWrapper>
								</a>
							</Link>
						) : (
							<DisplayName>Guest</DisplayName>
						)}

						<StatusWrapper>
							<div>
								<RadioInput
									type="radio"
									id="bullish"
									value="bullish"
									onClick={unselectRadioInput}
									{...register('status')}
								/>
								<RadioLabel
									variant="bullish"
									htmlFor="bullish"
									selected={status === 'bullish'}
									onClick={!session ? handleSignupOpen : undefined}
								>
									<FontAwesomeIcon
										icon={faCaretUp}
										color={status === 'bullish' ? white : upColor}
									/>
									<span>Bullish</span>
								</RadioLabel>
							</div>
							<div>
								<RadioInput
									type="radio"
									id="bearish"
									value="bearish"
									onClick={unselectRadioInput}
									{...register('status')}
								/>
								<RadioLabel
									variant="bearish"
									htmlFor="bearish"
									selected={status === 'bearish'}
									onClick={!session ? handleSignupOpen : undefined}
								>
									<FontAwesomeIcon
										icon={faCaretDown}
										color={status === 'bearish' ? white : downColor}
									/>
									<span>Bearish</span>
								</RadioLabel>
							</div>
						</StatusWrapper>
					</PostFormHeader>
					<MessageBox
						id=""
						placeholder="How do you fell about the markets today? Share your ideas here!"
						{...register('content')}
					/>
					<ButtonsWrapper>
						<button>
							<FontAwesomeIcon
								fontSize={25}
								color="#a7b0c2"
								icon={faFaceLaugh}
							/>
						</button>
						<PostButton
							type="submit"
							onClick={!session ? handleSignupOpen : undefined}
							disabled={create.isLoading}
						>
							{create.isLoading ? <Loader /> : 'Post'}
						</PostButton>
					</ButtonsWrapper>
				</form>
			</PostFormWrapper>
		</PostFormContainer>
	);
};

export default CreatePostForm;
