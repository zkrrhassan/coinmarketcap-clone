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

interface Inputs {
	status: 'bullish' | 'bearish' | null;
	content: string;
}

interface PostFormProps {
	comment?: boolean;
	postId?: string;
}

const CreatePostForm = ({ comment, postId }: PostFormProps) => {
	const schema = z.object({
		status: z.string().nullish(),
		content: z.string().min(1).max(999),
	});
	const { register, handleSubmit, watch, setValue } = useForm<Inputs>({
		resolver: zodResolver(schema),
	});
	const status = watch('status');
	const { data } = useSession();
	const {
		colors: { white, upColor, downColor },
	} = useTheme();

	const unselectRadioInput = (
		e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>
	) => {
		const button = e.target as HTMLInputElement;
		if (button.value === status) {
			setValue('status', null);
		}
	};

	const onSubmit = async (inputs: Inputs) => {
		const { status, content } = inputs;

		const ednpoint = comment ? '/api/comment/create' : '/api/post/create';
		const params = comment
			? { postId, userId: data?.user.id }
			: { userId: data?.user.id };

		const createPostOrComment = axios.post(
			ednpoint,
			{
				content,
				status,
			},
			{
				params,
			}
		);

		toast.promise(createPostOrComment, {
			loading: '',
			success: 'Post created downColor',
			error: "Couldn't create your post",
		});
	};

	return (
		<PostFormContainer comment={comment}>
			<ImageWrapper>
				<ProfileImage
					variant="medium"
					width={56}
					height={56}
					firstLetter="Guest"
					source={data?.user.image && `/uploads/${data.user.image}.jpeg`}
				/>
			</ImageWrapper>
			<PostFormWrapper>
				<form onSubmit={handleSubmit(onSubmit)}>
					<PostFormHeader>
						<Link href={``}>
							<a>
								<NameWrapper>
									<DisplayName>ema</DisplayName>
									<Name>@ema</Name>
								</NameWrapper>
							</a>
						</Link>
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
						<PostButton type="submit">Post</PostButton>
					</ButtonsWrapper>
				</form>
			</PostFormWrapper>
		</PostFormContainer>
	);
};

export default CreatePostForm;
