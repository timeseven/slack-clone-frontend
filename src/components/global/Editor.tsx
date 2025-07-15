'use client';

import 'quill/dist/quill.snow.css';

import { CaseSensitive, ImageIcon, SendHorizontal, Smile, XIcon } from 'lucide-react';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import { RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { EmojiPopover } from '@/components/global/EmojiPopover';
import Hint from './Hint';
import { Button } from '@/components/ui/button';

type EditorValue = {
	image: File | null;
	body: string;
};

type RangeStatic = {
	index: number;
	length: number;
};

export interface EditorHandle {
	resetEditor: () => void;
}

interface EditorProps {
	variant?: 'create' | 'update';
	defaultValue?: Delta | Op[];
	disabled?: boolean;
	innerRef?: RefObject<EditorHandle | null>;
	placeholder?: string;
	onCancel?: () => void;
	onSubmit: ({ image, body }: EditorValue) => void;
}

const Editor = ({
	variant = 'create',
	defaultValue = [],
	disabled = false,
	innerRef,
	placeholder = 'Write something...',
	onCancel,
	onSubmit,
}: EditorProps) => {
	const lastRangeRef = useRef<RangeStatic | null>(null);
	const [image, setImage] = useState<File | null>(null);
	const [text, setText] = useState('');
	const isEmpty = useMemo(() => !image && text.replace('/s*/g', '').trim().length === 0, [text, image]);
	const [isToolbarVisible, setIsToolbarVisible] = useState(true);

	const containerRef = useRef<HTMLDivElement>(null);
	const onSubmitRef = useRef(onSubmit);
	const placeholderRef = useRef(placeholder);
	const quillRef = useRef<Quill | null>(null);
	const defaultValueRef = useRef(defaultValue);
	const disabledRef = useRef(disabled);
	const imageElementRef = useRef<HTMLInputElement>(null);

	useLayoutEffect(() => {
		onSubmitRef.current = onSubmit;
		placeholderRef.current = placeholder;
		defaultValueRef.current = defaultValue;
		disabledRef.current = disabled;
	});

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

		const options: QuillOptions = {
			theme: 'snow',
			placeholder: placeholderRef.current,
			modules: {
				toolbar: [
					['bold', 'italic', 'strike'],
					['link'],
					[
						{
							list: 'ordered',
						},
						{
							list: 'bullet',
						},
					],
				],
				keyboard: {
					bindings: {
						enter: {
							key: 'Enter',
							handler: () => {
								const text = quill.getText();
								const addedImage = imageElementRef.current?.files?.[0] || null;
								const isEmpty = !addedImage && text.replace('/s*/g', '').trim().length === 0;

								if (isEmpty) return;

								const body = JSON.stringify(quill.getContents());

								onSubmitRef.current?.({ body, image: addedImage });
							},
						},
						shift_enter: {
							key: 'Enter',
							shiftKey: true,
							handler: () => {
								quill.insertText(quill.getSelection()?.index || 0, '\n');
							},
						},
					},
				},
			},
		};

		const quill = new Quill(editorContainer, options);
		quill.enable(!disabledRef.current);
		quillRef.current = quill;
		quillRef.current.focus();

		if (innerRef) {
			innerRef.current = {
				resetEditor,
			};
		}

		quill.setContents(defaultValueRef.current);
		setText(quill.getText());

		quill.on(Quill.events.TEXT_CHANGE, () => {
			setText(quill.getText());
		});

		quill.on(Quill.events.SELECTION_CHANGE, (range: RangeStatic | null) => {
			if (range) {
				lastRangeRef.current = range;
			}
		});

		return () => {
			quill.off(Quill.events.TEXT_CHANGE);
			if (container) {
				container.innerHTML = '';
			}
			if (quillRef.current) {
				quillRef.current = null;
			}
			if (innerRef) {
				innerRef.current = null;
			}
		};
	}, [innerRef]);

	const handleToolbarToggle = () => {
		setIsToolbarVisible((current) => !current);
		const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');
		if (toolbarElement) {
			toolbarElement.classList.toggle('hidden');
		}
	};

	const resetEditor = () => {
		quillRef.current?.setContents([]);
		setText('');
		setImage(null);
		if (imageElementRef.current) {
			imageElementRef.current.value = '';
		}
		lastRangeRef.current = null;
	};

	const handleEmojiSelect = (emoji: string) => {
		const quill = quillRef.current;
		if (!quill) return;

		const currentSelection = quill.getSelection();
		const index = currentSelection?.index ?? lastRangeRef.current?.index ?? 0;

		quill.insertText(index, emoji);
		quill.setSelection(index + emoji.length);
	};

	return (
		<div className='flex flex-col rounded-lg'>
			<input
				type='file'
				accept='image/*'
				ref={imageElementRef}
				onChange={(event) => setImage(event.target.files![0])}
				className='hidden'
			/>
			<div
				className={cn(
					'border-input focus-within:border-ring flex flex-col overflow-hidden rounded-md border bg-white transition focus-within:shadow-sm',
					disabled && 'opacity-50'
				)}
			>
				<div ref={containerRef} className='ql-custom h-full'></div>
				{!!image && (
					<div className='p-2'>
						<div className='group/image relative flex size-[62px] items-center justify-center'>
							<Hint label='Remove image'>
								<button
									onClick={() => {
										setImage(null);
										imageElementRef.current!.value = '';
									}}
									className='absolute -top-2.5 -right-2.5 z-[4] hidden size-6 items-center justify-center rounded-full border-2 border-white bg-black/70 text-white group-hover/image:flex hover:bg-black'
								>
									<XIcon className='size-3.5' />
								</button>
							</Hint>
							<Image
								src={URL.createObjectURL(image)}
								alt='Uploaded'
								fill
								className='overflow-hidden rounded-xl object-cover'
							/>
						</div>
					</div>
				)}
				<div className='z-[5] flex px-2 pb-2'>
					<Hint label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}>
						<Button disabled={disabled} size='sm' variant='ghost' onClick={handleToolbarToggle}>
							<CaseSensitive className='size-4' />
						</Button>
					</Hint>
					<EmojiPopover onEmojiSelect={handleEmojiSelect}>
						<Button
							disabled={disabled}
							size='sm'
							variant='ghost'
							onClick={() => {
								const range = quillRef.current?.getSelection();
								if (range) {
									lastRangeRef.current = range;
								}
							}}
						>
							<Smile className='size-4' />
						</Button>
					</EmojiPopover>
					{variant === 'create' && (
						<Hint label='Image'>
							<Button disabled={disabled} size='sm' variant='ghost' onClick={() => imageElementRef.current?.click()}>
								<ImageIcon className='size-4' />
							</Button>
						</Hint>
					)}
					{variant === 'update' && (
						<div className='ml-auto flex items-center gap-x-2'>
							<Button variant='outline' size='sm' onClick={onCancel} disabled={disabled}>
								Cancel
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => {
									if (!quillRef.current) return;
									onSubmit({
										body: JSON.stringify(quillRef.current?.getContents()),
										image,
									});
								}}
								disabled={disabled || isEmpty}
								className='bg-[#007a5a] text-white hover:bg-[#007a5a]/80'
							>
								Save
							</Button>
						</div>
					)}
					{variant === 'create' && (
						<Button
							disabled={disabled || isEmpty}
							onClick={() => {
								if (!quillRef.current) return;
								onSubmit({
									body: JSON.stringify(quillRef.current?.getContents()),
									image,
								});
								resetEditor();
							}}
							className={cn(
								'ml-auto',
								isEmpty
									? 'text-muted-foreground bg-white hover:bg-white'
									: 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80'
							)}
							size='sm'
						>
							<SendHorizontal className='size-4' />
						</Button>
					)}
				</div>
			</div>
			{variant === 'create' && (
				<div
					className={cn(
						'text-muted-foreground flex justify-end p-2 text-[10px] opacity-0 transition',
						!isEmpty && 'opacity-100'
					)}
				>
					<p>
						<strong>Shift + Return</strong> to add new line
					</p>
				</div>
			)}
		</div>
	);
};

export default Editor;
