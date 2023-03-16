import React, { ChangeEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import CropImage from '../CropImage/CropImage';
import ProfileImage from 'components/ProfileImage/ProfileImage';
import {
	AvatarButton,
	AvatarWrapper,
	Input,
	InputWrapper,
	Label,
	SaveButton,
} from './EditProfileForm.styled';
import { useMutation, useQuery } from '@tanstack/react-query';
import { User } from '@prisma/client';

const editUserSchema = z.object({
	displayName: z.string().max(20).nullable(),
	name: z.string().max(20),
	biography: z.string().max(160).nullable(),
	birthday: z.string().nullable(),
	website: z.string().max(100).nullable(),
	image: z.string().nullable(),
});

type EditUserInputs = z.infer<typeof editUserSchema>;

const EditProfileForm = () => {
	const { register, handleSubmit, setValue } = useForm<EditUserInputs>({
		resolver: zodResolver(editUserSchema),
		mode: 'onSubmit',
	});
	const [cropperOpen, setCropperOpen] = useState<boolean>(false);
	const [imageToCrop, setImageToCrop] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { data: session } = useSession();
	const name = session?.user.name;
	const {
		data: user,
		refetch,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['user', name],
		queryFn: async () =>
			(
				await axios.get<Omit<User, 'password'>>(`/api/user/get`, {
					params: {
						name,
					},
				})
			).data,
		enabled: !!name,
		refetchOnWindowFocus: false,
		onSuccess: ({ biography, birthday, displayName, name, website, image }) => {
			setValue('biography', biography);
			setValue(
				'birthday',
				birthday ? (birthday as unknown as string).substring(0, 10) : null
			);
			setValue('displayName', displayName);
			setValue('name', name);
			setValue('website', website);
			setValue('image', image);
		},
	});
	const saveChanges = useMutation({
		mutationFn: async (
			userData: Omit<EditUserInputs, 'image'> | Pick<EditUserInputs, 'image'>
		) => {
			await axios.post(
				'/api/user/update',
				{
					...userData,
				},
				{
					params: {
						userId: session?.user.id,
					},
				}
			);
		},
	});

	const { ref, ...rest } = register('image', {
		onChange: async (e: ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files) return;
			try {
				const imageURL = URL.createObjectURL(e.target.files[0]);
				setImageToCrop(imageURL);
				setCropperOpen(true);
			} catch (error) {
				console.error(error);
			}
		},
	});

	const handleCloseCropper = () => {
		setCropperOpen(false);
		setValue('image', null);
	};

	const openFileWindow = () => {
		fileInputRef.current?.click();
	};

	const updateUser = async (inputs: EditUserInputs) => {
		const { biography, birthday, displayName, name, website } = inputs;

		saveChanges.mutate({
			biography,
			birthday,
			displayName,
			name,
			website,
		});

		refetch();
	};

	if (isLoading) return <div></div>;

	if (isError) return <div></div>;

	const { image, name: username } = user;

	return (
		<form onSubmit={handleSubmit(updateUser)}>
			<InputWrapper>
				<Label as="p">Your Avatar</Label>
				<AvatarWrapper>
					{session && (
						<ProfileImage
							source={image}
							firstLetter={username.charAt(0)}
							width={64}
							height={64}
							variant="medium"
						/>
					)}
					<Input
						type="file"
						accept="image/png, image/jpg, image/jpeg"
						ref={(e) => {
							ref(e);
							fileInputRef.current = e;
						}}
						{...rest}
					/>
					<AvatarButton type="button" onClick={openFileWindow}>
						Edit Avatar
					</AvatarButton>
				</AvatarWrapper>
			</InputWrapper>
			<InputWrapper>
				<Label htmlFor="displayName">Display Name</Label>
				<Input type="text" id="displayName" {...register('displayName')} />
			</InputWrapper>
			<InputWrapper>
				<Label htmlFor="userName">UserName</Label>
				<Input type="text" id="userName" {...register('name')} />
			</InputWrapper>
			<InputWrapper>
				<Label htmlFor="biography">Biography</Label>
				<Input
					textarea
					as="textarea"
					id="biography"
					{...register('biography')}
				/>
			</InputWrapper>
			<InputWrapper>
				<Label htmlFor="birthday">Birthday</Label>
				<Input
					type="date"
					id="birthday"
					{...register('birthday', {
						setValueAs: (v) => (v ? new Date(v) : null),
					})}
				/>
			</InputWrapper>
			<InputWrapper>
				<Label htmlFor="website">Website</Label>
				<Input type="url" id="website" {...register('website')} />
			</InputWrapper>
			<SaveButton type="submit">Save</SaveButton>
			{imageToCrop && (
				<CropImage
					image={imageToCrop}
					refetch={refetch}
					visible={cropperOpen}
					closeCallback={handleCloseCropper}
				/>
			)}
		</form>
	);
};

export default EditProfileForm;
