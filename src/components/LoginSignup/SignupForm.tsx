import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import Loader from 'styled/elements/Loader';
import { AuthFormInputs, AuthFormProps } from './LoginSignup';
import axios from 'axios';
import {
	InputWrapper,
	Label,
	Input,
	Error,
	Submit,
} from './LoginSignup.styled';

const SignupForm = ({ closeFormCallback }: AuthFormProps) => {
	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		clearErrors,
		reset,
	} = useForm<AuthFormInputs>({
		resolver: zodResolver(schema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});
	const [loading, setLoading] = useState<boolean>(false);
	const { email, password } = watch();

	useEffect(() => {
		clearErrors('email');
	}, [email]);

	useEffect(() => {
		clearErrors('password');
	}, [password]);

	const onSignUp = async (data: AuthFormInputs) => {
		const { email, password } = data;

		const registerData = {
			email,
			password,
		};

		setLoading(true);
		try {
			await axios.post('/api/signUp', registerData);
			closeFormCallback();
			reset();
			toast('User registered successfully');
		} catch (error) {
			console.error('error!!!', error);
			toast('Error occured during registration');
		}
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit(onSignUp)}>
			<InputWrapper>
				<Label htmlFor="register-email">Email Address</Label>
				<Input
					type="email"
					id="register-email"
					placeholder="Enter your email address..."
					{...register('email')}
					error={errors['email'] ? true : false}
					autoComplete="off"
				/>
				{errors.email?.message && <Error>{errors.email?.message}</Error>}
			</InputWrapper>
			<InputWrapper>
				<Label htmlFor="register-password">Password</Label>
				<Input
					type="password"
					id="register-password"
					placeholder="Enter your password..."
					{...register('password')}
					error={errors['password'] ? true : false}
				/>
				{errors.password?.message && <Error>{errors.password?.message}</Error>}
			</InputWrapper>
			<Submit disabled={loading || !email || !password}>
				{loading ? <Loader /> : 'Sign Up'}
			</Submit>
		</form>
	);
};

export default SignupForm;
