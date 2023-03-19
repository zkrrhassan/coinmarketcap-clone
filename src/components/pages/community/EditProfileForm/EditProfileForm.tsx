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
import Loader from 'styled/elements/Loader';
import { toast } from 'react-hot-toast';

const editUserSchema = z.object({
	displayName: z.string().max(20),
	name: z.string().max(20),
	biography: z.string().max(160),
	birthday: z.string().min(1),
	website: z.string().max(100),
});

type EditUserInputs = z.infer<typeof editUserSchema>;

const EditProfileForm = () => {
	const { register, handleSubmit, setValue, watch } = useForm<EditUserInputs>({
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
				await axios.get<Omit<User, 'password'>>(`/api/user/getByName`, {
					params: {
						name,
					},
				})
			).data,
		enabled: !!name,
		refetchOnWindowFocus: false,
		onSuccess: ({ biography, birthday, displayName, name, website }) => {
			setValue('name', name);
			biography && setValue('biography', biography);
			birthday &&
				setValue('birthday', (birthday as unknown as string).substring(0, 10));
			displayName && setValue('displayName', displayName);
			website && setValue('website', website);
		},
	});
	const saveChanges = useMutation({
		mutationFn: async (userData: EditUserInputs) => {
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
		onSuccess: () => {
			toast('Updated successfully');
			refetch();
		},
	});

	const openFileWindow = () => {
		fileInputRef.current?.click();
	};

	const changeImageToCrop = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const imageURL = URL.createObjectURL(event.target.files[0]);
		setImageToCrop(imageURL);
		setCropperOpen(true);
	};

	const handleCloseCropper = () => {
		setCropperOpen(false);
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
	};

	if (isLoading) return <div></div>;

	if (isError) return <div></div>;

	const { image, name: username } = user;

	const changedValues = () => {
		const { biography, birthday, displayName, name, website } = watch();

		if (
			biography !== user.biography ||
			birthday !==
				(user.birthday &&
					(user.birthday as unknown as string).substring(0, 10)) ||
			displayName !== user.displayName ||
			name !== user.name ||
			website !== user.website
		)
			return true;
		return false;
	};

	return (
		<form onSubmit={handleSubmit(updateUser)}>
			<InputWrapper>
				<Label as="p">Your Avatar</Label>
				<AvatarWrapper>
					<ProfileImage
						source={image}
						firstLetter={username.charAt(0)}
						width={64}
						height={64}
						variant="medium"
					/>
					<Input
						type="file"
						accept="image/png, image/jpg, image/jpeg"
						ref={fileInputRef}
						onChange={changeImageToCrop}
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
				<Input type="date" id="birthday" {...register('birthday')} />
			</InputWrapper>
			<InputWrapper>
				<Label htmlFor="website">Website</Label>
				<Input type="url" id="website" {...register('website')} />
			</InputWrapper>
			<SaveButton
				disabled={saveChanges.isLoading || !changedValues()}
				type="submit"
			>
				{saveChanges.isLoading ? <Loader /> : 'Save'}
			</SaveButton>
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
