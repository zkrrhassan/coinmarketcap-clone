import { faAngleDown, faPen, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { Watchlist } from '@prisma/client';
import axios from 'axios';
import React, {
	MouseEvent as ReactMouseEvent,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import {
	ListItem,
	InputWrapper,
	TitleWrapper,
	FormWrapper,
	WatchlistModal,
	WatchlistListWrapper,
	CurrentWatchlistWrapper,
	WatchlistDropdown,
	NameWrapper,
	MainBadge,
	Name,
	RenameButton,
	FormTitle,
	WatchlistForm,
	Label,
	Input,
	SaveButton,
} from './WatchlistList.styled';
import { useTheme } from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface WatchlistListProps {
	currentWatchlist: Watchlist;
	watchlists: Watchlist[];
	changeWatchlistCallback: (name: string) => void;
}

interface Inputs {
	name: string;
	description: string;
}

const WatchlistList = ({
	currentWatchlist,
	watchlists,
	changeWatchlistCallback,
}: WatchlistListProps) => {
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const nameWrapperRef = useRef<HTMLDivElement>(null);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const schema = z.object({
		name: z
			.string()
			.min(1, 'Name is required')
			.max(30, 'Name must have 30 characters maximum'),
		description: z.string().optional(),
	});
	const { register, handleSubmit, setFocus } = useForm<Inputs>({
		resolver: zodResolver(schema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});
	const { data: session } = useSession();
	const [watchlistAction, setWatchlistAction] = useState<
		'edit' | 'create' | null
	>(null);
	const {
		colors: { textColor },
	} = useTheme();
	const queryClient = useQueryClient();
	const createWatchlist = useMutation({
		mutationFn: async (name: string) => {
			await axios.post(
				'api/watchlist/create',
				{
					name,
				},
				{
					params: {
						userId: session?.user.id,
					},
				}
			);
		},
		onSuccess: () => queryClient.invalidateQueries(['watchlists']),
	});
	const updateWatchlist = useMutation({
		mutationFn: async (name: string) => {
			await axios.patch(
				'/api/watchlist/update',
				{
					name,
				},
				{
					params: {
						watchlistId: currentWatchlist.id,
					},
				}
			);
		},
		onSuccess: () => queryClient.invalidateQueries(['watchlists']),
	});

	const onSubmit = async (inputs: Inputs) => {
		const { name, description } = inputs;

		if (watchlistAction === 'create') {
			createWatchlist.mutate(name);
		}
		if (watchlistAction === 'edit') {
			updateWatchlist.mutate(name);
		}

		setModalOpen(false);
		setWatchlistAction(null);
	};

	const handleOpenCreate = () => {
		setModalOpen(true);
		setWatchlistAction('create');
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setWatchlistAction(null);
	};

	const handleOpenEdit = (e: ReactMouseEvent) => {
		e.stopPropagation();
		setModalOpen(true);
		setWatchlistAction('edit');
		setFocus('name');
	};

	const handleDropdownOpen = () => {
		setDropdownOpen(true);
	};

	useEffect(() => {
		document.body.style.overflow = `${modalOpen ? 'hidden' : ''}`;
	}, [modalOpen]);

	useEffect(() => {
		const handleDropdownClose = (e: MouseEvent) => {
			if (!nameWrapperRef.current?.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		};

		window.addEventListener('click', handleDropdownClose);

		return () => window.removeEventListener('click', handleDropdownClose);
	}, []);

	return (
		<CurrentWatchlistWrapper>
			{currentWatchlist.isMain && <MainBadge>Main</MainBadge>}
			<WatchlistListWrapper>
				<NameWrapper ref={nameWrapperRef} onClick={handleDropdownOpen}>
					<Name>{currentWatchlist.name}</Name>
					<RenameButton onClick={handleOpenEdit}>
						<FontAwesomeIcon icon={faPen} fontSize={10} />
					</RenameButton>
					<button>
						<FontAwesomeIcon
							icon={faAngleDown}
							fontSize={10}
							color={textColor}
						/>
					</button>
				</NameWrapper>
				<WatchlistDropdown isOpen={dropdownOpen}>
					{watchlists.map((item) => (
						<ListItem
							key={item.id}
							onClick={() => changeWatchlistCallback(item.name)}
						>
							{item.name}
						</ListItem>
					))}
					<ListItem add onClick={handleOpenCreate}>
						+ New Watchlist
					</ListItem>
				</WatchlistDropdown>
			</WatchlistListWrapper>
			<WatchlistModal isOpen={modalOpen}>
				<FormWrapper>
					<TitleWrapper>
						{watchlistAction === 'create' && (
							<FormTitle>New Watchlist</FormTitle>
						)}
						{watchlistAction === 'edit' && (
							<FormTitle>Edit Watchlist</FormTitle>
						)}
						<button onClick={handleModalClose}>
							<FontAwesomeIcon icon={faX} color={textColor} />
						</button>
					</TitleWrapper>
					<WatchlistForm onSubmit={handleSubmit(onSubmit)}>
						<InputWrapper>
							<Label htmlFor="">Watchlist Name</Label>
							<Input
								{...register('name')}
								type="text"
								defaultValue={
									watchlistAction === 'edit' ? currentWatchlist.name : ''
								}
								placeholder="Watchlist Name"
							/>
						</InputWrapper>
						<InputWrapper second>
							<Label htmlFor="">Description (optional)</Label>
							<Input
								textarea
								as="textarea"
								{...register('description')}
								name=""
								id=""
								placeholder="Watchlist description"
							/>
						</InputWrapper>
						<SaveButton type="submit">
							{watchlistAction === 'edit' && 'Save Changes'}
							{watchlistAction === 'create' && 'Create Watchlist'}
						</SaveButton>
					</WatchlistForm>
				</FormWrapper>
			</WatchlistModal>
		</CurrentWatchlistWrapper>
	);
};

export default WatchlistList;
