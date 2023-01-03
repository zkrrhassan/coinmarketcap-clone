import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import {
	CropperWrapper,
	Modal,
	ModalWrapper,
	ZoomRange,
	CropButton,
} from './CropImage.styled';

interface CropImageProps {
	image: string;
	setCroppedImage: (image: Blob) => void;
	visible: boolean;
	closeCallback: () => void;
}

const CropImage = ({
	image,
	setCroppedImage,
	visible,
	closeCallback,
}: CropImageProps) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const cropImage = async () => {
		if (!image || !croppedAreaPixels) return;
		try {
			const croppedImage = await getCroppedImg(image, croppedAreaPixels);
			if (!croppedImage) return;
			setCroppedImage(croppedImage);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ModalWrapper visible={visible}>
			<Modal>
				<button type="button" onClick={closeCallback}>
					Close
				</button>
				<CropperWrapper>
					<Cropper
						image={image}
						crop={crop}
						zoom={zoom}
						aspect={1 / 1}
						onCropChange={setCrop}
						onCropComplete={onCropComplete}
						onZoomChange={setZoom}
					/>
				</CropperWrapper>
				<div>
					<ZoomRange
						type="range"
						value={zoom}
						min={1}
						max={3}
						step={0.1}
						aria-labelledby="Zoom"
						onChange={(e) => {
							setZoom(+e.target.value);
						}}
					/>
				</div>
				<CropButton type="button" onClick={cropImage}>
					Crop
				</CropButton>
				<button type="button" onClick={closeCallback}>
					Cancel
				</button>
			</Modal>
		</ModalWrapper>
	);
};
export default CropImage;

const createImage = (url: string) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.src = url;
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
	});

async function getCroppedImg(
	imageSrc: string,
	pixelCrop: Area
): Promise<Blob | null> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		return null;
	}

	// set canvas size to match the bounding box
	canvas.width = image.width;
	canvas.height = image.height;

	// draw image
	ctx.drawImage(image, 0, 0);

	// croppedAreaPixels values are bounding box relative
	// extract the cropped image using these values
	const data = ctx.getImageData(
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height
	);

	// set canvas width to final desired crop size - this will clear existing context
	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	// paste generated image at the top left corner
	ctx.putImageData(data, 0, 0);

	// As Base64 string
	// return canvas.toDataURL('image/jpeg');

	// As Blob
	return new Promise((resolve, reject) => {
		canvas.toBlob((file) => {
			if (!file) {
				reject("Couldn't create blob");
				return null;
			}
			resolve(file);
		}, 'image/jpeg');
	});
}
