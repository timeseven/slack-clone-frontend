'use client';

import React, { useState, useCallback, useEffect } from 'react';

import Image from 'next/image';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import LiveClock from '@/components/global/LiveClock';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { getCroppedImg } from '@/lib/utils';
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from '@/consts/file';

interface UploadAvatarDialogProps {
	user_name: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	onSave: (croppedImg: string) => void;
}

const UploadAvatarDialog = ({ user_name, open, setOpen, onSave }: UploadAvatarDialogProps) => {
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
	const [step, setStep] = useState<'upload' | 'crop'>('upload');
	const [avatarPreview, setAvatarPreview] = useState<string | null>('');

	const validateLogo = (file: File | null) => {
		if (!file) return true;
		if (file.size > MAX_FILE_SIZE) {
			toast.error('Max image size is 5MB.');
			return false;
		}
		if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
			toast.error('Only .jpg, .jpeg, .png and .webp files are allowed.');
			return false;
		}
		return true;
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onCropComplete = useCallback((croppedArea: any, croppedPixels: any) => {
		setCroppedAreaPixels(croppedPixels);
	}, []);

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (file && validateLogo(file)) {
			const reader = new FileReader();
			reader.onload = () => {
				setImageSrc(reader.result as string);
				setStep('crop');
			};
			reader.readAsDataURL(file);
		}
	};

	const handleClear = () => {
		setImageSrc(null);
		setStep('upload');
		setAvatarPreview(null);
	};

	const handleCancel = () => {
		handleClear();
		setOpen(false);
	};

	const handleSave = async () => {
		if (!avatarPreview) {
			toast.error('Failed to crop image');
			return;
		}
		onSave(avatarPreview);
	};

	useEffect(() => {
		const updatePreview = async () => {
			if (imageSrc && croppedAreaPixels) {
				try {
					const preview = await getCroppedImg(imageSrc, croppedAreaPixels);
					setAvatarPreview(preview);
				} catch (err) {
					console.error('Failed to generate preview', err);
				}
			}
		};

		updatePreview();
	}, [imageSrc, croppedAreaPixels]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle>{step === 'upload' ? 'Add a profile photo' : 'Crop your photo'}</DialogTitle>
				</DialogHeader>
				<div className='flex h-80 items-center justify-center rounded-md border-2 border-dashed'>
					{step === 'upload' && (
						<Label htmlFor='logo' className='flex h-full w-full cursor-pointer flex-col items-center justify-center'>
							<Image
								src='/images/undraw_photograph.svg'
								alt='Upload illustration'
								width={200}
								height={100}
								className='mx-auto'
							/>
							<p className='text-muted-foreground my-1 text-sm'>Click to upload or drag and drop</p>
							<p className='text-muted-foreground text-xs'>JPEG, JPG, PNG, WEBP (max. 5MB)</p>
							<Input id='logo' type='file' accept='image/*' className='hidden' onChange={handleLogoChange} />
						</Label>
					)}
					{step === 'crop' && imageSrc && (
						<div className='relative h-full w-full bg-black'>
							<Cropper
								image={imageSrc}
								crop={crop}
								zoom={zoom}
								cropShape='rect'
								aspect={1}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
								showGrid={false}
							/>
						</div>
					)}
				</div>
				{step === 'crop' && (
					<div className='flex flex-col gap-y-2'>
						<div className='grid grid-cols-[4rem_1fr_5rem] items-center'>
							<span>Zoom </span>
							<Slider
								max={2}
								min={1}
								step={0.1}
								value={[zoom]}
								onValueChange={(value) => {
									setZoom(value[0]);
								}}
							/>
							<span className='flex items-center justify-center'>{Math.round(zoom * 100)} %</span>
						</div>
					</div>
				)}
				<div className='flex flex-col gap-y-2'>
					<div className='font-semibold text-gray-500'>Preview</div>
					<div className='flex items-center gap-x-2'>
						<div className='rounded-md border border-dashed'>
							<Image
								src={avatarPreview || '/images/square-user-round.svg'}
								alt="User's avatar preview"
								className='rounded-md object-cover'
								width={100}
								height={100}
							/>
						</div>
						<div className='mb-auto flex flex-col gap-2'>
							<span className='flex gap-2'>
								<span className='max-w-[200px] truncate'>{user_name}</span>
								<LiveClock />
							</span>
							{avatarPreview && (
								<Button variant='destructive' size='sm' onClick={handleClear}>
									Delete
								</Button>
							)}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={handleCancel}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UploadAvatarDialog;
