import Image from 'next/image';
import React from 'react';
import { StyledImage } from './ProfileImage.styled';
import ImagePlaceholder, {
	ImagePlaceholderVariant,
} from 'styled/elements/ImagePlaceholder';

interface ProfileImageProps {
	source?: string | null;
	firstLetter: string;
	width: number;
	height: number;
	variant: ImagePlaceholderVariant;
}

const ProfileImage = ({
	source,
	firstLetter,
	width,
	height,
}: ProfileImageProps) => {
	return source ? (
		<StyledImage src={source} alt="" width={width} height={height} />
	) : (
		<ImagePlaceholder variant="small">{firstLetter}</ImagePlaceholder>
	);
};

export default ProfileImage;
