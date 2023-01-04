import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { User } from '@prisma/client';
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

const editUserSchema = z.object({
	displayName: z.string().max(20).nullable(),
	name: z.string().max(20),
	biography: z.string().max(160).nullable(),
	birthday: z.date().nullable(),
	website: z.string().max(100).nullable(),
	image: typeof window === 'undefined' ? z.any() : z.instanceof(Blob),
});

type EditUserInputs = z.infer<typeof editUserSchema>;
type EditUserKey = keyof EditUserInputs;

const EditProfileForm = () => {
	const { register, handleSubmit, setValue } = useForm<EditUserInputs>({
		resolver: zodResolver(editUserSchema),
		mode: 'onSubmit',
	});
	const [cropperOpen, setCropperOpen] = useState<boolean>(false);
	const [imageToCrop, setImageToCrop] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { data: session, status } = useSession();
	const name = session?.user.name;
	const { data: user, refetch } = useQuery({
		queryKey: ['userEdit', name],
		queryFn: async () =>
			(
				await axios.get(`/api/user/get`, {
					params: {
						name,
					},
				})
			).data,
		enabled: !!name,
		refetchOnWindowFocus: false,
	});
	const uploadImage = useMutation({
		mutationFn: async (body: FormData) =>
			(await axios.post<{ imageName: string }>('/api/images/upload', body))
				.data,
	});
	const saveChanges = useMutation({
		mutationFn: async (userData: EditUserInputs) => {
			console.log(userData);
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
	const { push } = useRouter();
	const { ref, ...rest } = register('image', {
		onChange: async (e: ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files) return;
			try {
				// const imageURL = await convertToBase64(e.target.files[0]);
				const imageURL = URL.createObjectURL(e.target.files[0]);
				setImageToCrop(imageURL);
				setCropperOpen(true);
			} catch (error) {
				console.error(error);
			}
		},
	});

	useEffect(() => {
		fillValues();
	}, [user]);

	useEffect(() => {
		if (status === 'unauthenticated') {
			push('/');
		}
	}, [status]);

	const handleCloseCropper = () => {
		setCropperOpen(false);
		setValue('image', null);
	};

	const handleChangeCroppedImage = (image: Blob) => {
		setValue('image', image);

		setCropperOpen(false);
	};

	const openFileWindow = () => {
		fileInputRef.current?.click();
	};

	const fillValues = () => {
		if (user) {
			const userFileds = {
				biography: user.biography,
				birthday: user.birthday,
				displayName: user.displayName,
				name: user.name,
				website: user.website,
			};

			Object.entries(userFileds).forEach((entry) => {
				if (entry[0] === 'birthday') {
					setValue(
						entry[0] as EditUserKey,
						new Date(entry[1] as string).toISOString().split('T')[0]
					);
					return;
				}
				setValue(entry[0] as EditUserKey, entry[1]);
			});
		}
	};

	const updateUser = async (inputs: EditUserInputs) => {
		const { biography, birthday, displayName, name, website, image } = inputs;

		let imageName;
		if (image) {
			const body = new FormData();
			body.append('file', image);

			uploadImage.mutate(body);
			imageName = uploadImage.data?.imageName;
		}

		saveChanges.mutate({
			biography,
			birthday,
			displayName,
			name,
			website,
			image: imageName,
		});

		refetch();
	};

	return (
		<form onSubmit={handleSubmit(updateUser)}>
			<InputWrapper>
				<Label as="p">Your Avatar</Label>
				<AvatarWrapper>
					{session && (
						<ProfileImage
							source={
								session.user.image && `/uploads/${session.user.image}.jpeg`
							}
							firstLetter={session.user.name.charAt(0)}
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
					setCroppedImage={handleChangeCroppedImage}
					visible={cropperOpen}
					closeCallback={handleCloseCropper}
				/>
			)}
		</form>
	);
};

export default EditProfileForm;
